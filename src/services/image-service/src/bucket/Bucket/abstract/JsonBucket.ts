import type { PutOneJson, PutOneResult } from "../types.ts";
import { BucketBase } from "./BucketBase.ts";

export abstract class JsonBucket extends BucketBase {
  public file_type: string = "application";
  async putOne({ id, body: data }: PutOneJson): PutOneResult {
    const body = JSON.stringify(data);
    return super.putRaw({ body, format: "json", id });
  }
}
