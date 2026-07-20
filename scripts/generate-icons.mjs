// Regenerates every raster icon from the single SVG brand mark
// (src/app/icon.svg). Run after any change to the mark:
//   node scripts/generate-icons.mjs
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = new URL("../src/app/icon.svg", import.meta.url);
const svg = await readFile(SOURCE);

const targets = [
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
  { file: "src/app/apple-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(new URL(`../${file}`, import.meta.url).pathname);
  console.log(`✓ ${file} (${size}px)`);
}

// favicon.ico — a minimal ICO container holding one PNG-compressed 32px
// entry (valid since Windows Vista; universally supported by browsers).
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // width
entry.writeUInt8(32, 1); // height
entry.writeUInt16LE(1, 4); // color planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png32.length, 8); // payload size
entry.writeUInt32LE(6 + 16, 12); // payload offset
await writeFile(
  new URL("../src/app/favicon.ico", import.meta.url).pathname,
  Buffer.concat([header, entry, png32])
);
console.log("✓ src/app/favicon.ico (32px)");
