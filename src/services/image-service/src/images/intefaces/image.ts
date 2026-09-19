import type { Metadata, SharpInput } from "sharp";
const SUPORTED_FORMATS_LIST = [
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
export interface ImageObject {
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
