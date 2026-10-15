// Extract embedded images from chosen PDF pages as PNG files.
// Usage: node extract-images.mjs <pdf> <outDir> <sharpPath> <pages, e.g. 21-28,34>
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const [pdfPath, outDir, sharpPath, pageSpec] = process.argv.slice(2);
const require = createRequire(import.meta.url);
const sharp = require(sharpPath);
mkdirSync(outDir, { recursive: true });

const pages = new Set();
for (const part of pageSpec.split(",")) {
  const [a, b] = part.split("-").map(Number);
  for (let p = a; p <= (b || a); p++) pages.add(p);
}

const doc = await pdfjs.getDocument({
  url: pdfPath,
  isOffscreenCanvasSupported: false,
  isImageDecoderSupported: false,
  verbosity: 0,
}).promise;

const getObj = (store, id) =>
  new Promise((resolve) => {
    try {
      store.get(id, resolve);
    } catch {
      resolve(null);
    }
  });

for (const p of [...pages].sort((x, y) => x - y)) {
  if (p < 1 || p > doc.numPages) continue;
  const page = await doc.getPage(p);
  const ops = await page.getOperatorList();
  let n = 0;
  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    if (fn !== pdfjs.OPS.paintImageXObject && fn !== pdfjs.OPS.paintInlineImageXObject) continue;
    const arg = ops.argsArray[i][0];
    const img =
      typeof arg === "string"
        ? (await getObj(arg.startsWith("g_") ? page.commonObjs : page.objs, arg))
        : arg;
    if (!img || !img.data || !img.width) continue;
    const { width, height, kind, data } = img;
    let channels;
    let buf;
    if (kind === 3) {
      channels = 4;
      buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    } else if (kind === 2) {
      channels = 3;
      buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    } else {
      // 1bpp grayscale: expand bits to bytes.
      channels = 1;
      buf = Buffer.alloc(width * height);
      const rowBytes = Math.ceil(width / 8);
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
          buf[y * width + x] = (data[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1 ? 255 : 0;
    }
    if (width * height < 120 * 120) continue; // skip icons / decorations
    const file = path.join(outDir, `p${String(p).padStart(3, "0")}_${n}.png`);
    await sharp(buf, { raw: { width, height, channels } }).png().toFile(file);
    console.log(`${path.basename(file)} ${width}x${height} kind=${kind}`);
    n++;
  }
  page.cleanup();
}
await doc.destroy();
