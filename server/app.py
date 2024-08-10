from flask import Flask, Response, render_template, jsonify, request, make_response, session, redirect, url_for, stream_with_context
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
from flask_session import Session
from threading import Lock
app = Flask(__name__)

app.secret_key = "eut3grbifu32r83gibfejiijohughuijokkijhugvhjiokjbhvghbjkmjhgvfccgvhbygtfdrxcgfhvy3r9eonvj"
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SESSION_TYPE'] = 'filesystem'


Session(app)

# Global dictionary to store recording states per session ID or user ID
recording_states = {}
recording_states_lock = Lock()

uri1 = "mongodb+srv://michael:lxsquid@cluster0.ruhmegq.mongodb."
uri2 = "net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient((uri1 + uri2), server_api=ServerApi('1'))
db = client.get_database('MedRelay')

openai.api_key = os.getenv("OPENAI_API_KEY")

FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
CHUNK = 1024
TOTAL_CHUNKS = 500

audio1 = pyaudio.PyAudio()

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

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully!'}), 200

@app.route('/profile', methods=['GET'])
def profile():
    if 'username' not in session:
        return redirect(url_for('login'))
    return jsonify({'username': session['username']}), 200

@app.route("/ask_gpt", methods=['GET'])
def ask_gpt():
    global transcript
    prompt = transcript
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
    # Check the current entry based on session id
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
        while db.transcripts.find_one({"id" : code})["active"] == True:
            data = stream.read(CHUNK)
            audio_data.append(data)
            chunk_counter += 1

            if chunk_counter % TOTAL_CHUNKS == 0:
                if file_exists:
                    # Append new audio data
                    append_audio(chunk_filename, audio_data)
                else:
                    # Create a new file and save the data
                    save_audio(chunk_filename, audio_data)
                    file_exists = True  # File now exists
                transcribe_audio(code)
                audio_data = []
                yield chunk_filename
    return Response(sound(code))




def append_audio(filename, new_audio_data):
    # Read existing audio data
    with wave.open(filename, 'rb') as wf:
        existing_data = wf.readframes(wf.getnframes())
        params = wf.getparams()  # Get the parameters of the existing file

    # Append new data to existing data
    combined_data = existing_data + b''.join(new_audio_data)

    # Write the combined data back to the file
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
