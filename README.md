# TTS App — Chuyển văn bản thành giọng nói

Ứng dụng web chuyển văn bản thành giọng nói theo ngôn ngữ/quốc gia và giới tính, cho phép nghe trực tiếp và tải file MP3. Sử dụng dịch vụ giọng đọc miễn phí của Microsoft Edge (qua thư viện `msedge-tts`) — không cần API key, không giới hạn số lần dùng.

## Cấu trúc project

```
tts-app/
  app/
    api/tts/route.js   -> API tạo file MP3
    voices.js          -> Danh sách ngôn ngữ + giọng Nam/Nữ
    page.js             -> Giao diện chính
    layout.js
    globals.css
  package.json
  next.config.js
```

## Cách chạy thử trên máy (không bắt buộc)

```
npm install
npm run dev
```
Mở http://localhost:3000

## Thêm ngôn ngữ mới

Mở file `app/voices.js`, thêm dòng mới vào mảng `VOICES` theo mẫu có sẵn. Toàn bộ danh sách giọng có thể xem tại: https://github.com/rany2/edge-tts (phần voice list).
