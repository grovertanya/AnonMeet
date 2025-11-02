import requests

# point to your Flask server
url = "http://127.0.0.1:5000/analyze"   # or 5000 if you’re using that port
file_path = "sample.mp4"                # replace with your test video file

with open(file_path, "rb") as f:
    files = {"file": (file_path, f, "video/mp4")}
    print("Uploading file...")
    response = requests.post(url, files=files)

print("Status Code:", response.status_code)
print("Response:")
print(response.text)
