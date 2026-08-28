import { getVoiceCode } from "../../voices";
import { synthesizeSpeech } from "../../edgeTts";

// Bắt buộc chạy trên Node.js runtime (không dùng Edge runtime của Vercel)
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { text, lang, gender } = await req.json();

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: "Thiếu nội dung văn bản." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const voice = getVoiceCode(lang, gender);
    if (!voice) {
      return new Response(JSON.stringify({ error: "Ngôn ngữ không hợp lệ." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await synthesizeSpeech({ text, voice });

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="tts-output.mp3"',
      },
    });
  } catch (err) {
    console.error("TTS error:", err?.message || err);
    return new Response(
      JSON.stringify({ error: "Có lỗi khi tạo giọng đọc: " + (err?.message || "unknown") }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
