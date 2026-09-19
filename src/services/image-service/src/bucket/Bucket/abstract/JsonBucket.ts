import type { PutOneJson, PutOneResult } from "../types";
import { BucketBase } from "./BucketBase";

export abstract class JsonBucket extends BucketBase {
  public file_type: string = "application";
  override putOne({ id, body: data }: PutOneJson): PutOneResult {
    const body = JSON.stringify(data);
    return super.putOne({ body, format: "json", id });
  }
}
