import WebSocket from "ws";
import crypto from "crypto";

const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const WSS_URL =
  "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1";
const CHROMIUM_FULL_VERSION = "130.0.2849.68";

// Microsoft yêu cầu 1 mã xác thực (Sec-MS-GEC) tính theo thời gian hiện tại,
// làm tròn xuống mốc 5 phút gần nhất, hash SHA-256 cùng 1 token cố định.
function generateSecMsGec() {
  const WIN_EPOCH = 11644473600n; // giây từ 1601-01-01 đến 1970-01-01
  let ticks = BigInt(Math.floor(Date.now() / 1000)) + WIN_EPOCH;
  ticks -= ticks % 300n; // làm tròn xuống mốc 300 giây (5 phút)
  const winTicks = ticks * 10000000n; // đổi sang đơn vị 100-nanosecond của Windows
  const strToHash = `${winTicks.toString()}${TRUSTED_CLIENT_TOKEN}`;
  return crypto.createHash("sha256").update(strToHash, "ascii").digest("hex").toUpperCase();
}

function randomHex(bytes) {
  return crypto.randomBytes(bytes).toString("hex");
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function synthesizeSpeech({ text, voice, rate = "+0%", volume = "+0%", pitch = "+0Hz" }) {
  return new Promise((resolve, reject) => {
    const secMsGec = generateSecMsGec();
    const url = `${WSS_URL}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=1-${CHROMIUM_FULL_VERSION}`;

    const ws = new WebSocket(url, {
      headers: {
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
      },
    });

    const audioChunks = [];
    let finished = false;
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        ws.terminate();
        reject(new Error("Hết thời gian chờ kết nối tới dịch vụ giọng đọc."));
      }
    }, 15000);

    ws.on("open", () => {
      const timestamp = new Date().toISOString();
      const configMsg =
        `X-Timestamp:${timestamp}\r\n` +
        `Content-Type:application/json; charset=utf-8\r\n` +
        `Path:speech.config\r\n\r\n` +
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: {
                  sentenceBoundaryEnabled: false,
                  wordBoundaryEnabled: false,
                },
                outputFormat: "audio-24khz-48kbitrate-mono-mp3",
              },
            },
          },
        });
      ws.send(configMsg);

      const reqId = randomHex(16);
      const ssml =
        `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>` +
        `<voice name='${voice}'>` +
        `<prosody pitch='${pitch}' rate='${rate}' volume='${volume}'>` +
        escapeXml(text) +
        `</prosody></voice></speak>`;

      const ssmlMsg =
        `X-RequestId:${reqId}\r\n` +
        `Content-Type:application/ssml+xml\r\n` +
        `X-Timestamp:${timestamp}\r\n` +
        `Path:ssml\r\n\r\n` +
        ssml;
      ws.send(ssmlMsg);
    });

    ws.on("message", (data, isBinary) => {
      if (isBinary) {
        const headerLength = data.readUInt16BE(0);
        const audioData = data.subarray(headerLength + 2);
        audioChunks.push(Buffer.from(audioData));
      } else {
        const str = data.toString();
        if (str.includes("Path:turn.end")) {
          finished = true;
          ws.close();
        }
      }
    });

    ws.on("close", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (finished && audioChunks.length > 0) {
        resolve(Buffer.concat(audioChunks));
      } else {
        reject(new Error("Không nhận được dữ liệu âm thanh từ dịch vụ."));
      }
    });

    ws.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(err);
    });
  });
}
