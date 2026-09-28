import { validateBuckets } from "../validate_buckets.ts";
import { ImageBucket as ImageBucketI } from "./abstract/ImageBucket.ts";

await validateBuckets();
export class ImageBucket extends ImageBucketI {
  constructor() {
    super("IMAGES");
  }
}
