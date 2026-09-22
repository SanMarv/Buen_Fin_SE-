import type {
  ImageProductWithHash,
  WithMimeType,
} from "@images/intefaces/image.js";

export class ImageWithHash {
  public image: WithMimeType<ImageProductWithHash>;
  constructor(data: ImageProductWithHash) {
    const mimeType = data.metadata.mediaType ?? `image/${data.format}`;
    this.image = { ...data, mimeType };
  }
}
