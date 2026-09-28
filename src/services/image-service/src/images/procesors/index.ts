import sharp from "sharp";
import heic from "heic-convert";
import { type SharpInput } from "sharp";

import { SUPORTED_FORMATS, type ImageOptions } from "../intefaces/image.ts";
import { ImageProcessor } from "./ImageProcesor.ts";
import { ImageOnlyHash } from "./ImageOnlyHash.ts";
import { isHeic } from "../utils.ts";
import { DEFAULT_IMAGE } from "./const.ts";

function isSameTypeOutput(mimeType: string, output_format?: string) {
  const outputMime = `image/${output_format ?? DEFAULT_IMAGE.format}`;
  return mimeType === outputMime;
}
export async function ImageProcessorFactory(
  fileParam: Buffer,
  params?: ImageOptions,
): Promise<ImageProcessor> {
  let file: SharpInput = fileParam;
  let metadata = await sharp(fileParam).metadata();
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
    metadata = await sharp(file).metadata();
  }
  return new ImageProcessor({ data: file, metadata }, params);
}
