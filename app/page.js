"use client";

import { useState, useRef } from "react";
import { VOICES } from "./voices";

export default function Home() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState(VOICES[0].label);
  const [gender, setGender] = useState("female");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  async function handleGenerate() {
    setError("");
    if (!text.trim()) {
      setError("Vui lòng nhập văn bản.");
      return;
    }
    setLoading(true);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang, gender }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Có lỗi xảy ra.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "tts-output.mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="container">
      <h1>Chuyển văn bản thành giọng nói</h1>
      <p className="subtitle">
        Chọn ngôn ngữ và giới tính giọng đọc, sau đó nghe hoặc tải file MP3. Miễn phí, không giới hạn.
      </p>

      <textarea
        placeholder="Nhập văn bản cần chuyển thành giọng nói..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="row">
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          {VOICES.map((v) => (
            <option key={v.label} value={v.label}>
              {v.label}
            </option>
          ))}
        </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="female">Giọng Nữ</option>
          <option value="male">Giọng Nam</option>
        </select>
      </div>

      <div className="actions">
        <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo giọng đọc"}
        </button>
        <button className="btn-secondary" onClick={handleDownload} disabled={!audioUrl}>
          Tải MP3
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {audioUrl && (
        <div className="player">
          <audio ref={audioRef} controls src={audioUrl} autoPlay />
        </div>
      )}
    </div>
  );
}
