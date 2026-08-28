import "./globals.css";

export const metadata = {
  title: "Text to Speech - Đa ngôn ngữ",
  description: "Chuyển văn bản thành giọng nói theo ngôn ngữ và giới tính, tải MP3 miễn phí",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
