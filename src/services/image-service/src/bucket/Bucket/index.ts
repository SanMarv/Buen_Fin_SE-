import { validateBuckets } from "../validate_buckets.ts";
import { ImageBucket } from "./abstract/ImageBucket.ts";

await validateBuckets();
export class PostBucket extends ImageBucket {
  constructor() {
    super("POSTS");
  }
}
