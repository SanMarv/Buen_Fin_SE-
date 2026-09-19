import { decodeBlurHash } from "fast-blurhash";
import sharp from "sharp";
const HEIF_FORMAT = ["image/heic", "image/heif"] as const;
type HeicExtension = (typeof HEIF_FORMAT)[number];
export const isHeic = (format: string): format is HeicExtension =>
  HEIF_FORMAT.includes(format as HeicExtension);
export async function hash2Image(
  hash: string,
  path: string,
  options: { width?: number; height?: number } = {},
) {
  const { width = 480, height = 420 } = options;
  console.time("decode");
  const pixels = decodeBlurHash(hash, width, height);
  console.timeEnd("decode");
  await sharp(Buffer.from(pixels), { raw: { height, width, channels: 4 } })
    .webp({ quality: 20 })
    .toFile(path);
}
