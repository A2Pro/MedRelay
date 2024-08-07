from flask import Flask, Response, render_template, jsonify, request, make_response, session, redirect, url_for
import pyaudio
import wave
import os
from dotenv import load_dotenv
import openai
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)

app.secret_key = "eut3grbifu32r83gibfeji3r9eonvj"
load_dotenv()

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# MongoDB client setup
uri = "mongodb+srv://michael:lxsquid@cluster0.ruhmegq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client.get_database('MedRelay')

openai.api_key = os.getenv("OPENAI_API_KEY")

transcript = ""
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

def transcribe_audio():
    global transcript
    with open("audio/combined_audio.wav", "rb") as audio_file:
        transcription = openai.Audio.transcribe(
            model="whisper-1",
            file=audio_file
        )
    transcript += transcription['text']
    transcriptentry = db.transcripts.find_one({"username": session.get("username")})
    now = datetime.now()
    if not transcriptentry:
        db.transcripts.insert_one({
            "username": session.get("username"),
            "transcript" : f"Started at {now} from user {session.get("username")}.   {transcript}",
        })
    else:
        currenttranscript = transcriptentry["transcript"]
        db.transcripts.update_one(
            {"username" : session.get("username")},
            {"$set": {"transcript" : currenttranscript + transcription["text"]}}
        )
    return transcription['text']

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


@app.route('/audio')
def audio_stream():
    os.makedirs('audio', exist_ok=True)

    def sound():
        wav_header = generate_wav_header(RATE, 16, CHANNELS)
        stream = audio1.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, input_device_index=1, frames_per_buffer=CHUNK)
        audio_data = []
        chunk_counter = 0
        while True:
            data = stream.read(CHUNK)
            audio_data.append(data)
            chunk_counter += 1
            if chunk_counter % TOTAL_CHUNKS == 0:
                chunk_filename = os.path.join('audio', 'combined_audio.wav')
                save_audio(chunk_filename, audio_data)
                transcribe_audio()
                audio_data = []
                yield chunk_filename

    return Response(sound())

@app.route('/hello')
def hello():
    return "Hello, World!"

@app.route('/transcript')
def get_transcript():
    global transcript
    return jsonify({'transcript': transcript})

@app.route("/trans")
def trans():
    return render_template("transcript.html")

@app.route('/')
def index():
    return render_template('index.html')



if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, threaded=True, port=5000)
