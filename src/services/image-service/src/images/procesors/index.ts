import sharp from "sharp";
import { type SharpInput } from "sharp";
import { SUPORTED_FORMATS, type ImageOptions } from "../intefaces/image";
import { ImageProcessor } from "./ImageProcesor";
import { ImageOnlyHash } from "./ImageOnlyHash";
import { isHeic } from "../utils";
import heic from "heic-convert";
import { DEFAULT_IMAGE } from "./const";

function isSameTypeOutput(mimeType: string, output_format?: string) {
  const outputMime = `image/${output_format ?? DEFAULT_IMAGE.format}`;
  return mimeType === outputMime;
}
export async function ImageProcessorFactory(
  fileParam: Buffer,
  params?: ImageOptions,
): Promise<ImageProcessor> {
  let file: SharpInput = fileParam;
  const metadata = await sharp(fileParam).metadata();
  const mimeType = metadata.mediaType || `image/${metadata.format}`;

  // Error if not supported
  if (!SUPORTED_FORMATS.has(metadata.format)) {
    throw new Error(
      `Unsupported format: format ${metadata.format} not in the support list`,
    );
  }

  if (isSameTypeOutput(mimeType, params?.format))
    return new ImageOnlyHash({ data: file, metadata }, params);
  // Heic supoort
  if (isHeic(mimeType)) {
    file = await heic({ buffer: file, format: "PNG", quality: 1 });
  }
  return new ImageProcessor({ data: file, metadata }, params);
}
