export async function analyzeInterview(videoFile: File) {
    const formData = new FormData();
    formData.append("file", videoFile);
  
    const res = await fetch("http://127.0.0.1:5001/analyze", {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error("Failed to analyze interview");
    }
  
    const data = await res.json();
    return data;
  }
  