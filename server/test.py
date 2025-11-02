import google.generativeai as genai, os
from dotenv import load_dotenv

load_dotenv()
print("✅ Loaded Gemini API key:", os.getenv("GEMINI_API_KEY")[:10] + "...")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

try:
    models = genai.list_models()
    print("✅ Models fetched successfully!")
    for m in models:
        if "generateContent" in m.supported_generation_methods:
            print(" -", m.name)
except Exception as e:
    print("❌ Error:", e)
