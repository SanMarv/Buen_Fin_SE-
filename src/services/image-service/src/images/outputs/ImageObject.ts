import type { ImageProduct, WithMimeType } from "@images/intefaces/image.js";

export class ImageObject {
  public image: WithMimeType<ImageProduct>;
  constructor(data: ImageProduct) {
    const mimeType = data.metadata.mediaType ?? `image/${data.format}`;
    this.image = { ...data, mimeType };
  }
}
