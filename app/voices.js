// Danh sách ngôn ngữ/quốc gia và giọng đọc Nam/Nữ tương ứng (Microsoft Edge Neural voices - miễn phí)
// Có thể thêm/bớt tuỳ nhu cầu. Danh sách đầy đủ: https://github.com/rany2/edge-tts (xem VOICE_LIST)

export const VOICES = [
  { label: "Tiếng Việt", female: "vi-VN-HoaiMyNeural", male: "vi-VN-NamMinhNeural" },
  { label: "English (US)", female: "en-US-JennyNeural", male: "en-US-GuyNeural" },
  { label: "English (UK)", female: "en-GB-SoniaNeural", male: "en-GB-RyanNeural" },
  { label: "English (Australia)", female: "en-AU-NatashaNeural", male: "en-AU-WilliamNeural" },
  { label: "日本語 (Japanese)", female: "ja-JP-NanamiNeural", male: "ja-JP-KeitaNeural" },
  { label: "한국어 (Korean)", female: "ko-KR-SunHiNeural", male: "ko-KR-InJoonNeural" },
  { label: "中文 - 普通话 (Chinese Mandarin)", female: "zh-CN-XiaoxiaoNeural", male: "zh-CN-YunxiNeural" },
  { label: "Français (France)", female: "fr-FR-DeniseNeural", male: "fr-FR-HenriNeural" },
  { label: "Deutsch (Germany)", female: "de-DE-KatjaNeural", male: "de-DE-ConradNeural" },
  { label: "Español (Spain)", female: "es-ES-ElviraNeural", male: "es-ES-AlvaroNeural" },
  { label: "Español (Mexico)", female: "es-MX-DaliaNeural", male: "es-MX-JorgeNeural" },
  { label: "Português (Brazil)", female: "pt-BR-FranciscaNeural", male: "pt-BR-AntonioNeural" },
  { label: "Italiano (Italy)", female: "it-IT-ElsaNeural", male: "it-IT-DiegoNeural" },
  { label: "Русский (Russian)", female: "ru-RU-SvetlanaNeural", male: "ru-RU-DmitryNeural" },
  { label: "ภาษาไทย (Thai)", female: "th-TH-PremwadeeNeural", male: "th-TH-NiwatNeural" },
  { label: "Bahasa Indonesia", female: "id-ID-GadisNeural", male: "id-ID-ArdiNeural" },
  { label: "Bahasa Melayu (Malay)", female: "ms-MY-YasminNeural", male: "ms-MY-OsmanNeural" },
  { label: "Tiếng Ả Rập (Arabic)", female: "ar-SA-ZariyahNeural", male: "ar-SA-HamedNeural" },
  { label: "हिन्दी (Hindi)", female: "hi-IN-SwaraNeural", male: "hi-IN-MadhurNeural" },
  { label: "Filipino (Philippines)", female: "fil-PH-BlessicaNeural", male: "fil-PH-AngeloNeural" },
];

export function getVoiceCode(langLabel, gender) {
  const entry = VOICES.find((v) => v.label === langLabel);
  if (!entry) return null;
  return gender === "male" ? entry.male : entry.female;
}
