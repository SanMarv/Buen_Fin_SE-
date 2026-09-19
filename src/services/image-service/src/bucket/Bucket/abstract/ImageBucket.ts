import { BucketBase } from "./BucketBase";

export abstract class ImageBucket extends BucketBase {
  public file_type: string = "image";
}
