from flask import Flask, request, jsonify
import google.generativeai as genai
import tempfile, subprocess, os, json, whisper, imageio_ffmpeg
from flask_cors import CORS
from dotenv import load_dotenv

# -----------------------------------------------------------
# 🔧 SETUP
# -----------------------------------------------------------
load_dotenv()
app = Flask(__name__)
CORS(app)

api_key = os.getenv("GEMINI_API_KEY")
print("✅ Loaded Gemini API key:", api_key[:10] + "...")
genai.configure(api_key=api_key)

# Use the latest fast model
model = genai.GenerativeModel("gemini-2.5-flash")

# Load Whisper (tiny for speed)
whisper_model = whisper.load_model("tiny")

# Use internal FFmpeg binary (no brew needed)
from whisper import audio
audio.FFMPEG_PATH = imageio_ffmpeg.get_ffmpeg_exe()

def patched_load_audio(file: str, sr: int = 16000):
    cmd = [
        audio.FFMPEG_PATH,
        "-nostdin", "-threads", "0", "-i", file,
        "-f", "s16le", "-ac", "1", "-acodec", "pcm_s16le",
        "-ar", str(sr), "-"
    ]
    out = subprocess.run(cmd, capture_output=True, check=True).stdout
    return audio.np.frombuffer(out, audio.np.int16).flatten().astype(audio.np.float32) / 32768.0

audio.load_audio = patched_load_audio  # override default


# -----------------------------------------------------------
# 🔍 ANALYZE ENDPOINT
# -----------------------------------------------------------
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        video = request.files["file"]
        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

        # Extract audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            video.save(tmp.name)
            subprocess.run([ffmpeg_path, "-i", tmp.name, "-vn", "-ac", "1", "-ar", "16000", "audio.wav"], check=True)
            print("✅ Audio extracted")

            # Transcribe
            text = whisper_model.transcribe("audio.wav")["text"]
            print("✅ Transcribed text:", text[:200])

        # Limit transcript length for Gemini
        text = text[:3000]

        # Structured JSON prompt
        prompt = f"""
You are an HR fairness and ethics evaluator analyzing an interview transcript.

Return only valid JSON with these fields:
{{
  "bias_score": (integer 0–100),
  "flagged_questions": [string],
  "tone_summary": "short summary",
  "overall_feedback": "short feedback"
}}

Example:
{{
  "bias_score": 35,
  "flagged_questions": ["Why did you take time off work?"],
  "tone_summary": "Professional but slightly personal",
  "overall_feedback": "Generally fair but could avoid personal questions."
}}

Now analyze this transcript:
{text}
"""

        # Generate content
        result = model.generate_content(prompt, generation_config={"temperature": 0.4})
        print("✅ Gemini result received")

        # Try parsing JSON safely
        try:
            parsed = json.loads(result.text)
            return jsonify(parsed)
        except json.JSONDecodeError:
            print("⚠️ Gemini returned non-JSON, sending raw result")
            return jsonify({"raw_result": result.text})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# -----------------------------------------------------------
# 🚀 RUN
# -----------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
