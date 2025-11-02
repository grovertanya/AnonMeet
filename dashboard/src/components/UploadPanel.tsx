import React, { useState } from "react";

interface Props {
  onUpload: (file: File) => void;
  loading: boolean;
}

export default function UploadPanel({ onUpload, loading }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) onUpload(file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg text-center border"
    >
      <p className="text-lg mb-4 font-medium">
        Upload your interview video (.mp4, .mov)
      </p>

      <input
        type="file"
        accept="video/mp4,video/quicktime"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full border rounded-md py-2 px-3 mb-4"
      />

      <button
        type="submit"
        disabled={!file || loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>
    </form>
  );
}
