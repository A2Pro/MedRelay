from flask import Flask, Response, render_template, jsonify
import pyaudio
import wave
import os
from dotenv import load_dotenv
from openai import OpenAI

app = Flask(__name__)

load_dotenv()

transcript = ""
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
CHUNK = 1024
TOTAL_CHUNKS = 500

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
audio1 = pyaudio.PyAudio()

@app.route("/ask_gpt")
def ask_gpt():
    global transcript
    prompt = transcript
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Sort the following text into three categories: Status, Injury, and Treatment. Assume the text is about a patient and they are describing them. The text is in chronological order, so if something later on contradicts something that was said earlier, assume that the thing said latest is correct. Also, if there is no clear injury/status/treatment, put N/A in that row. IF THERE IS NO TEXT, PUT NA FOR ALL 3. PUT IN THIS FORMAT: Status: (status) Injury: (injury) Treatment: (treatment). Here's the text: {prompt}"
            }
        ],
        model="gpt-3.5-turbo"
    )
    if "Treatment" not in response.choices[0].message.content:
        ask_gpt()
    return jsonify({"response": response.choices[0].message.content})

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
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
    transcript += transcription.text
    return transcription.text

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
