import { BucketBase } from "./BucketBase.ts";
import type { PutOneObject } from "../types.ts";

export abstract class ImageBucket extends BucketBase {
  public file_type: string = "image";
  async putOne(param: PutOneObject) {
    return super.putRaw(param);
  }
}
