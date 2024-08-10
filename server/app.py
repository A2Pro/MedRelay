from flask import Flask, Response, render_template, jsonify, request, make_response, session, redirect, url_for, stream_with_context, send_file
import pyaudio
import wave
import os
from dotenv import load_dotenv
import openai
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS
import wave
from datetime import datetime
from threading import Lock
from io import BytesIO
import gridfs
import zipfile

app = Flask(__name__)

app.secret_key = "eut3grbifu32r83gibfejiijohughuijokkijhugvhjiokjbhvghbjkmjhgvfccgvhbygtfdrxcgfhvy3r9eonvj"
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SESSION_TYPE'] = 'filesystem'

recording_states = {}
recording_states_lock = Lock()

uri1 = "mongodb+srv://michael:lxsquid@cluster0.ruhmegq.mongodb."
uri2 = "net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient((uri1 + uri2), server_api=ServerApi('1'))
db = client.get_database('MedRelay')
fs = gridfs.GridFS(db)

openai.api_key = os.getenv("OPENAI_API_KEY")

audio1 = pyaudio.PyAudio()

for i in range(audio1.get_device_count()):
    device_info = audio1.get_device_info_by_index(i)
    print(f"Device {i}: {device_info['name']}")
    print(f"  Max Input Channels: {device_info['maxInputChannels']}")
    print(f"  Default Sample Rate: {device_info['defaultSampleRate']}\n")

desired_device_index = 1

device_info = audio1.get_device_info_by_index(desired_device_index)
max_channels = device_info['maxInputChannels']

CHANNELS = min(max_channels, 2)

FORMAT = pyaudio.paInt16
RATE = int(device_info['defaultSampleRate'])
CHUNK = 1024
TOTAL_CHUNKS = 500

@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files or 'code' not in request.form:
        return jsonify({'message': 'No file part or code provided'}), 400
    
    file = request.files['file']
    code = request.form['code']
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    # Determine the file extension
    file_extension = file.filename.split('.')[-1].lower()
    mime_type = f'image/{file_extension}'

    # Find the number of images associated with this code to determine the next number
    count = db.fs.files.count_documents({'filename': {'$regex': f'^{code}_'}})
    file_number = count + 1

    # Set the filename to be code_number.extension
    filename = f"{code}_{file_number}.{file_extension}"
    
    # Store the file in GridFS
    file_id = fs.put(file, filename=filename, content_type=mime_type)
    return jsonify({'file_id': str(file_id), 'filename': filename, 'message': 'Image uploaded successfully'}), 201

@app.route('/get_image/<file_id>', methods=['GET'])
def get_image(file_id):
    try:
        file = fs.get(file_id)
        mime_type = file.content_type if file.content_type else 'application/octet-stream'
        return send_file(BytesIO(file.read()), attachment_filename=file.filename, mimetype=mime_type)
    except gridfs.NoFile:
        return jsonify({'message': 'File not found'}), 404
    
@app.route('/download_images/<code>', methods=['GET'])
def download_images_by_code(code):
    try:
        # Find all files with filenames starting with the given code
        files = list(db.fs.files.find({'filename': {'$regex': f'^{code}_'}}))
        if not files:
            return jsonify({'message': 'No images found for this code'}), 404

        # Create a zip file in memory
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                # Retrieve the file data from GridFS
                file_data = fs.get(file['_id']).read()
                # Add file to the zip file
                zip_file.writestr(file['filename'], file_data)

        zip_buffer.seek(0)
        return send_file(
            zip_buffer,
            as_attachment=True,
            download_name=f"{code}_images.zip",
            mimetype='application/zip'
        )
    except gridfs.NoFile:
        return jsonify({'message': 'File not found in GridFS'}), 404
    except Exception as e:
        app.logger.error(f'An error occurred: {str(e)}')
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    existing_user = db.users.find_one({'$or': [{'email': data['email']}, {'username': data['username']}]})
    if existing_user:
        return jsonify({'message': 'Email or username already exists'}), 400
    db.users.insert_one({
        'email': data['email'],
        'username': data['username'],
        'password': data['password']
    })
    return jsonify({'message': 'User registered successfully!'}), 201

@app.route("/login", methods=["POST"])
def login():
    session["recording"] = False
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"status": "error", "message": "Username and password are required"}), 400

    user = db.users.find_one({"username": username})
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404
    if user["password"] == password:
        response = jsonify({"status": "success", "token": "dummy-token"})
        session["username"] = username
        return response
    else:
        return jsonify({"status": "error", "message": "Incorrect password"}), 401
    
@app.route('/raw_transcription/<code>', methods=['GET'])
def get_raw_transcription(code):
    entry = db.transcripts.find_one({"id": code, "active": True})
    if not entry:
        return jsonify({"message": "No active transcription found for this code."}), 404
    return jsonify({"transcription": entry["transcript"]}), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully!'}), 200

@app.route('/profile', methods=['GET'])
def profile():
    if 'username' not in session:
        return redirect(url_for('login'))
    return jsonify({'username': session['username']}), 200

@app.route('/deactivate', methods=['POST'])
def deactivate_session():
    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return jsonify({"message": "No code provided"}), 400

    transcript_entry = db.transcripts.find_one({"id": code})

    if not transcript_entry:
        return jsonify({"message": "Entry not found"}), 404

    db.transcripts.update_one(
        {"id": code},
        {"$set": {"active": False}}
    )

    return jsonify({"message": "Session deactivated successfully."}), 200

@app.route("/ask_gpt", methods=['POST'])
def ask_gpt():
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"response": "No text provided for analysis. Please provide valid text."}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"Sort the following text into three categories: Status, Injury, and Treatment. Assume the text is about a patient and they are describing them. The text is in chronological order, so if something later on contradicts something that was said earlier, assume that the thing said latest is correct. Also, if there is no clear injury/status/treatment, put N/A in that row. IF THERE IS NO TEXT, PUT NA FOR ALL 3. PUT IN THIS FORMAT: Status: (status) Injury: (injury) Treatment: (treatment). Here's the text: {prompt}"
                }
            ]
        )
        result = response.choices[0].message['content']
        return jsonify({"response": result})
    except Exception as e:
        return jsonify({"response": f"An error occurred while processing the request: {str(e)}"}), 500


def generate_wav_header(sample_rate, bits_per_sample, channels):
    datasize = 2000 * 10**6
    header = bytes("RIFF", 'ascii')
    header += (datasize + 36).to_bytes(4, 'little')
    header += bytes("WAVE", 'ascii')
    header += bytes("fmt ", 'ascii')
    header += (16).to_bytes(4, 'little')
    header += (1).to_bytes(2, 'little')
    header += (channels).to_bytes(2, 'little')
    header += (sample_rate).to_bytes(4, 'little')
    header += (sample_rate * channels * bits_per_sample // 8).to_bytes(4, 'little')
    header += (channels * bits_per_sample // 8).to_bytes(2, 'little')
    header += (bits_per_sample).to_bytes(2, 'little')
    header += bytes("data", 'ascii')
    header += (datasize).to_bytes(4, 'little')
    return header


@app.route('/setidrec', methods=['POST'])
def set_idrec():
    data = request.get_json()
    code = data.get('code')
    session["id"] = code
    print(f"Received code: {code}")
    if not code:
        return jsonify({"message": "No code provided"}), 400
    return jsonify({"message" : "sucess"}), 200

@app.route('/setidamb', methods=['POST'])
def set_idamb():
    data = request.get_json()
    code = data.get('code')
    print(f"Received code: {code}")

    if not code:
        return jsonify({"message": "No code provided"}), 400

    session['id'] = code
    now = datetime.now()

    transcriptentry = db.transcripts.find_one({"id": code})
    print(f"Current transcript entry: {transcriptentry}")

    if transcriptentry:
        result = db.transcripts.update_one(
            {"id": code},
            {
                "$set": {
                    "transcript": f"Started at {now} from id {code}. ",
                    "active": True
                }
            }
        )
        print(f"Update result: Matched count {result.matched_count}, Modified count {result.modified_count}")
    else:
        result = db.transcripts.insert_one({
            "id": code,
            "transcript": f"Started at {now} from id {code}. ",
            "active": True
        })
        print(f"Insert result: Inserted ID {result.inserted_id}")
    session["recording"] = True
    return jsonify({"message": "success"}), 202

def transcribe_audio(code):
    global transcript
    with open(f"audio/{code}.wav", "rb") as audio_file:
        transcription = openai.Audio.transcribe(
            model="whisper-1",
            file=audio_file
        )
    transcriptentry = db.transcripts.find_one({"id": code})
    now = datetime.now()
    if not transcriptentry:
        db.transcripts.insert_one({
            "id": code,
            "transcript": f"Started at {now} from id {code}. {transcription}",
        })
    else:
        currenttranscript = transcriptentry["transcript"]
        db.transcripts.update_one(
            {"id": code},
            {"$set": {"transcript": currenttranscript + transcription["text"]}}
        )
    return transcription['text']

@app.route("/allactiveids", methods=["POST"])
def get_all_active_ids():
    active_transcripts = db.transcripts.find({"active": True})
    if(active_transcripts):
        active_ids = [transcript["id"] for transcript in active_transcripts]
    else:
        active_ids = "None"
    print(active_ids)
    return jsonify(active_ids)

@app.route("/alldeactiveids", methods=["POST"])
def get_all_deactive_ids():
    deactive_transcripts = db.transcripts.find({"active": False})
    if(deactive_transcripts):
        deactive_ids = [transcript["id"] for transcript in deactive_transcripts]
    else:
        deactive_ids = "None"
    print(deactive_ids)
    return jsonify(deactive_ids)

@app.route('/getAllActiveTranscriptions', methods=['GET'])
def get_all_active_transcriptions():
    active_transcriptions = db.transcripts.find({"active": True})
    if not active_transcriptions:
        return jsonify({"message": "No active transcriptions found"}), 404

    output = BytesIO()
    for transcription in active_transcriptions:
        output.write(f"ID: {transcription['id']}\nTranscript: {transcription['transcript']}\n\n".encode())

    output.seek(0)

    return send_file(
        output,
        as_attachment=True,
        download_name="active_transcriptions.txt",
        mimetype="text/plain"
    )

@app.route('/getAllDeActiveTranscriptions', methods=['GET'])
def get_all_deactive_transcriptions():
    deactive_transcriptions = db.transcripts.find({"active": False})
    if not deactive_transcriptions:
        return jsonify({"message": "No deactive transcriptions found"}), 404

    output = BytesIO()
    for transcription in deactive_transcriptions:
        output.write(f"ID: {transcription['id']}\nTranscript: {transcription['transcript']}\n\n".encode())

    output.seek(0)

    return send_file(
        output,
        as_attachment=True,
        download_name="deactive_transcriptions.txt",
        mimetype="text/plain"
    )

def save_audio(filename, audio_data):
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio1.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(audio_data))

@app.route('/get_transcripts', methods=['GET'])
def get_transcripts():
    transcripts = db.transcripts.find()
    usernames = []
    transcript_texts = []
    for entry in transcripts:
        usernames.append(entry['username'])
        try:
            transcript_texts.append(entry['transcript'])
        except:
            transcript_texts.append("")
    return jsonify({
        'usernames': usernames,
        'transcripts': transcript_texts
    })

@app.route("/stop_recording/<code>", methods = ["POST", "GET"])
def stoprecording(code):
    entry  = db.transcripts.find_one({"id" : code})
    if not entry:
        return jsonify({"message" : "Entry not found"}), 400
    db.transcripts.update_one(
            {"id": code},
            {
                "$set": {
                    "active": False
                }
            }
    )
    return jsonify({"message" : "success"}), 200

@app.route('/audio/<code>')
def audio_stream(code):
    os.makedirs('audio', exist_ok=True)
    def sound(code):
        wav_header = generate_wav_header(RATE, 16, CHANNELS)
        stream = audio1.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, input_device_index=1, frames_per_buffer=CHUNK)
        audio_data = []
        chunk_counter = 0
        # Check if file already exists
        chunk_filename = os.path.join('audio', f'{code}.wav')
        file_exists = os.path.exists(chunk_filename)
        entry  =  db.transcripts.find_one({"id" : code})
        now = datetime.now()
        if not entry:
              result = db.transcripts.insert_one({
              "id": code,
              "transcript": f"Started at {now} from id {code}. ",
              "active": True
              })
        while db.transcripts.find_one({"id" : code})["active"] == True:
            data = stream.read(CHUNK)
            audio_data.append(data)
            chunk_counter += 1

            if chunk_counter % TOTAL_CHUNKS == 0:
                if file_exists:
                    append_audio(chunk_filename, audio_data)
                else:
                    save_audio(chunk_filename, audio_data)
                    file_exists = True
                transcribe_audio(code)
                audio_data = []
                yield chunk_filename
    return Response(sound(code))

def append_audio(filename, new_audio_data):
    with wave.open(filename, 'rb') as wf:
        existing_data = wf.readframes(wf.getnframes())
        params = wf.getparams() 

    combined_data = existing_data + b''.join(new_audio_data)

    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(params.nchannels)
        wf.setsampwidth(params.sampwidth)
        wf.setframerate(params.framerate)
        wf.writeframes(combined_data)

@app.route('/hello')
def hello():
    return "Hello, World!"

@app.route('/transcript/<code>')
def get_transcript(code):
    entry = db.transcripts.find_one({"id": code})
    if not entry:
        return("No transcript found.")
    else:
        return entry["transcript"]

@app.route("/trans")
def trans():
    return render_template("transcript.html")

@app.route('/')
def index():
    return render_template('index.html')



if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, threaded=True, port=5000)
