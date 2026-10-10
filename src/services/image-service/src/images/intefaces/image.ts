import type { Metadata, SharpInput } from "sharp";
const SUPORTED_FORMATS_LIST = [
  "svg",
  "webp",
  "avif",
  "jpeg",
  "jpg",
  "png",
  "heic",
  "heif",
] as const;
export type SuportedFormats = (typeof SUPORTED_FORMATS_LIST)[number];
export const SUPORTED_FORMATS: ReadonlySet<string> = new Set(
  SUPORTED_FORMATS_LIST,
);

export const SUPORTED_MIMETYPES = [...SUPORTED_FORMATS].map(
  (format) => `image/${format}`,
) as `image/${SuportedFormats}`[];
export interface ImageObject {
  id: string;
  fileName: string;
  width: number;
  height: number;
  createdAt: Date;
  format: Exclude<SuportedFormats, "heic" | "heif">;
  metadata: Metadata;
}

export interface ImageProduct extends ImageObject {
  file: Buffer;
}
export interface ImageProductWithHash extends ImageObject {
  file: Buffer;
  hash: string;
}

export type WithMimeType<T> = T & { mimeType: string };
export interface ImageOptions {
  fileName?: string;
  format?: ImageObject["format"];
}
export type ImageDefault = Required<ImageOptions>;

export type InputConstructor = {
  data: SharpInput;
  metadata: Metadata;
};
