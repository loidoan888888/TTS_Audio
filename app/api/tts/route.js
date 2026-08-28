import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { getVoiceCode } from "../../voices";

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

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const { audioStream } = await tts.toStream(text);

    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="tts-output.mp3"',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Có lỗi khi tạo giọng đọc." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
