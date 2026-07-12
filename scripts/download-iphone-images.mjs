// scripts/download-iphone-images.mjs
// -----------------------------------------------------------------------------
// Tải ảnh sản phẩm iPhone về public/products/ theo đúng slug dùng trong data/products.ts
//
// Cách dùng:
//   1) Điền URL ảnh (nền trắng/PNG) vào IMAGES bên dưới. Ưu tiên ảnh chính hãng
//      Apple hoặc ảnh sản phẩm shop tự chụp. (Để trống "" thì bỏ qua model đó.)
//   2) Chạy tại thư mục gốc dự án:  node scripts/download-iphone-images.mjs
//   3) Ảnh sẽ lưu vào public/products/<slug>.png
//
// Yêu cầu: Node 18+ (có sẵn fetch). Không cần cài thêm gì.
// -----------------------------------------------------------------------------

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "products");

// slug (khớp field `slug` trong data/products.ts) -> URL ảnh nguồn
// Các model dưới đây hiện đang DÙNG CHUNG ảnh với model khác — điền URL riêng để có ảnh chuẩn.
const IMAGES = {
  // 7 model mới bổ sung (đang mượn tạm ảnh model gần giống):
  "iphone-15-pro-lock": "",   // hiện dùng 15promax.png
  "iphone-16e-lock": "",      // hiện dùng iphone16.png
  "iphone-13-pro-lock": "",   // hiện dùng iphone13promax.png
  "iphone-13-mini-lock": "",  // hiện dùng iphone13.png
  "iphone-12-pro-lock": "",   // hiện dùng iphone12promax.png
  "iphone-12-lock": "",       // hiện dùng iphone12.png
  "iphone-12-mini-lock": "",  // hiện dùng iphone12.png

  // Có thể bổ sung/ghi đè ảnh cho các model đã có nếu muốn ảnh đẹp hơn:
  // "iphone-17-lock": "https://...",
};

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  const entries = Object.entries(IMAGES).filter(([, url]) => url && url.trim());
  if (entries.length === 0) {
    console.log(
      "Chưa có URL nào được điền trong IMAGES. Hãy mở file này và điền URL rồi chạy lại.",
    );
    return;
  }

  for (const [slug, url] of entries) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const dest = join(OUT_DIR, `${slug}.png`);
      await writeFile(dest, buf);
      console.log(`✓ ${slug}.png  (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error(`✗ ${slug}: ${err.message}`);
    }
  }
  console.log(
    "\nXong. Sau khi có ảnh riêng, nhớ cập nhật field `image` tương ứng trong data/products.ts.",
  );
}

main();
