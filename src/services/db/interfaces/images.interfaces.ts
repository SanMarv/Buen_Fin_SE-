import type { Result } from "@app/types";
import type { ImageRecord } from "@db/models/image.model.js";
export interface ProductMetadata {
  user_provided_id?: string;
}
export interface ImageMetadata {
  createdAt?: Date;
  uploadedAt?: Date;
  originalFileName?: string;
}

export interface ImageRawFile extends Pick<
  ImageRecord,
  "id" | "user_id" | "url"
> {
  file: Buffer;
}
export type ImageCreate = Omit<ImageRecord, "id">;

type CreateError = { status: 500 | 400; error: string };
export type ImageCreateResult = Promise<Result<ImageRecord, CreateError>>;
type ImageMoveSource = Pick<ImageRecord, "url">;
type ImageMoveDestination = Pick<ImageRecord, "url" | "hash" | "metadata">;
export type ImageMoveUrl = [
  source: ImageMoveSource,
  destination: ImageMoveDestination,
];
