import { BucketBase } from "./BucketBase.ts";

export abstract class ImageBucket extends BucketBase {
  public file_type: string = "image";
}
