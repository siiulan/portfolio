// Regenerates the transparent header logo from the brand icon.
//
//   npm run logo
//
// The source icon is chrome artwork on a solid black backdrop. This crops to the
// artwork, pads it to a square, and turns the black into transparency (each pixel's
// alpha comes from its brightness), which keeps the chrome's soft edges intact on
// the dark site background. No dependencies: PNG decode/encode uses node:zlib.
//
// Outputs (next to the source):
//   logo-mark.png             128×128, imported by the site header
//   icon-s-transparent.png    full resolution, for use outside the site

import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BRAND = join(dirname(fileURLToPath(import.meta.url)), "../src/assets/brand");
const SOURCE = join(BRAND, "icon-s.png");
const PAD = 0.04; // breathing room around the artwork, as a fraction of its size
const THRESHOLD = 24; // channel value above which a pixel counts as artwork
const LOGO_SIZE = 128;

// ---- PNG I/O (8-bit, non-interlaced, RGB or RGBA) ----

function decodePng(buf) {
  let pos = 8;
  let width, height, colorType;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("latin1", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
      if (data[8] !== 8 || data[12] !== 0 || (colorType !== 2 && colorType !== 6))
        throw new Error("Only 8-bit, non-interlaced RGB/RGBA PNGs are supported");
    } else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[y * stride + x - bpp] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= bpp && y > 0 ? px[(y - 1) * stride + x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + x] = v & 255;
    }
  }
  // normalise to RGB; the source's alpha channel is fully opaque, so it carries nothing
  const rgb = new Float64Array(width * height * 3);
  for (let i = 0; i < width * height; i++)
    for (let k = 0; k < 3; k++) rgb[i * 3 + k] = px[i * bpp + k];
  return { width, height, rgb };
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "latin1");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}
function encodePngRgba(width, height, rgba) {
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++)
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4); // filter 0
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- image steps ----

/** Crops to the artwork and centres it on a black square with PAD on every side. */
function squareArtwork({ width, height, rgb }) {
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      if (Math.max(rgb[i], rgb[i + 1], rgb[i + 2]) > THRESHOLD) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x);
        y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
    }
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const side = Math.max(w, h), pad = Math.floor(side * PAD), size = side + 2 * pad;
  const ox = Math.floor((size - w) / 2), oy = Math.floor((size - h) / 2);
  const out = new Float64Array(size * size * 3);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      for (let k = 0; k < 3; k++)
        out[((y + oy) * size + x + ox) * 3 + k] = rgb[((y + y0) * width + x + x0) * 3 + k];
  return { size, rgb: out };
}

/** Area-average downscale: each output pixel is the exact mean of the source area it covers. */
function resize({ size, rgb }, target) {
  if (target >= size) return { size, rgb };
  const scale = size / target;
  const out = new Float64Array(target * target * 3);
  for (let ty = 0; ty < target; ty++) {
    const sy0 = ty * scale, sy1 = sy0 + scale;
    for (let tx = 0; tx < target; tx++) {
      const sx0 = tx * scale, sx1 = sx0 + scale;
      const sum = [0, 0, 0];
      for (let sy = Math.floor(sy0); sy < Math.ceil(sy1); sy++) {
        const wy = Math.min(sy + 1, sy1) - Math.max(sy, sy0);
        for (let sx = Math.floor(sx0); sx < Math.ceil(sx1); sx++) {
          const w = wy * (Math.min(sx + 1, sx1) - Math.max(sx, sx0));
          const i = (sy * size + sx) * 3;
          sum[0] += rgb[i] * w; sum[1] += rgb[i + 1] * w; sum[2] += rgb[i + 2] * w;
        }
      }
      for (let k = 0; k < 3; k++) out[(ty * target + tx) * 3 + k] = sum[k] / (scale * scale);
    }
  }
  return { size: target, rgb: out };
}

/** Un-composites from black: alpha = brightest channel, colour divided back out. */
function blackToAlpha({ size, rgb }) {
  const out = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const r = Math.round(rgb[i * 3]), g = Math.round(rgb[i * 3 + 1]), b = Math.round(rgb[i * 3 + 2]);
    const a = Math.max(r, g, b);
    if (a === 0) continue;
    out[i * 4] = Math.min(255, Math.floor((r * 255) / a));
    out[i * 4 + 1] = Math.min(255, Math.floor((g * 255) / a));
    out[i * 4 + 2] = Math.min(255, Math.floor((b * 255) / a));
    out[i * 4 + 3] = a;
  }
  return out;
}

const square = squareArtwork(decodePng(readFileSync(SOURCE)));
for (const [file, target] of [["logo-mark.png", LOGO_SIZE], ["icon-s-transparent.png", square.size]]) {
  const img = resize(square, target);
  writeFileSync(join(BRAND, file), encodePngRgba(img.size, img.size, blackToAlpha(img)));
  console.log(`wrote ${file} (${img.size}×${img.size})`);
}
