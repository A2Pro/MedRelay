from flask import Flask, Response, render_template, jsonify, request, make_response
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pyaudio
import wave
import os
from dotenv import load_dotenv
import openai
import secrets

app = Flask(__name__)

load_dotenv()

app.config['MONGO_URI'] = 'mongodb+srv://michael:lxsquid@cluster0.ruhmegq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

# Generate a secret key if not provided
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", secrets.token_hex(16))

mongo = PyMongo(app)
jwt = JWTManager(app)

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
    hashed_password = generate_password_hash(data['password'], method='sha256')
    mongo.db.users.insert_one({
        'username': data['username'],
        'password': hashed_password
    })
    return jsonify({'message': 'User registered successfully!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({'username': data['username']})
    
    if user and check_password_hash(user['password'], data['password']):
        token = create_access_token(identity={'username': user['username']})
        response = make_response(jsonify({'message': 'Login successful!', 'token': token}))
        response.set_cookie('token', token, httponly=True)
        return response

    return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify({'username': current_user['username']}), 200

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
    return transcription['text']

def save_audio(filename, audio_data):
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio1.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(audio_data))

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
