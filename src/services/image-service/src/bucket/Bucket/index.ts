import { validateBuckets } from "../validate_buckets";
import { ImageBucket } from "./abstract/ImageBucket";

await validateBuckets();
export class PostBucket extends ImageBucket {
  constructor() {
    super("POSTS");
  }
}
