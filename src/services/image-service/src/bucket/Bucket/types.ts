import type { Readable } from "node:stream";
import type { Result } from "@app/types";

type S3ObjectSucess = {
  id: string;
  uploadedAt: Date;
  url: string;
  path: string;
};
export type AvalibleOptionsStreamingOptions = "stream" | "string" | "bit_array";
interface HeaderType {
  "Content-Type": string;
  "Content-Lenght": number;
}
type StreamOptions<T extends AvalibleOptionsStreamingOptions> =
  T extends "stream"
    ? {
        file: Readable;
        headers: HeaderType;
      }
    : T extends "string"
      ? string
      : Uint8Array<ArrayBufferLike>;

type S3ObjectSuccessFile<T extends AvalibleOptionsStreamingOptions> = {
  key: string;
  data: StreamOptions<T>;
  contentType: string;
  status: 200;
};
export type S3Error = {
  status: number;
  error: string;
};
export type PutOneObject = {
  id: string;
  body: string | Buffer;
  format: string;
};
export interface PutOneObjectBase extends PutOneObject {
  metatada?: Record<string, string>;
}
export interface PutOneJson {
  id: string;
  body: Record<string, unknown>;
}
export type DeleteOneObject = {
  key: string;
};
export type PutOneResult = Promise<Result<S3ObjectSucess, S3Error>>;
export type DeleteOneResult = Promise<
  Result<{ status: number }, { status: number; error: string; key: string }>
>;

export type GetOneResult<T extends AvalibleOptionsStreamingOptions> = Result<
  S3ObjectSuccessFile<T>,
  S3Error
>;
