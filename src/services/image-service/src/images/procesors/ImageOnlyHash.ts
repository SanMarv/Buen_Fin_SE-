import sharp from "sharp";
import type { ImageProductWithHash } from "@images/intefaces/image";
import { ImageProcessor } from "./ImageProcesor";
import type { OptimeResult } from "@images/intefaces/procesor";
import { ImageWithHash } from "@images/outputs";

export class ImageOnlyHash extends ImageProcessor {
  override async optimize(): OptimeResult {
    const hash = await this.hashImage();
    const file = await sharp(this.file).toBuffer();
    const construction: ImageProductWithHash = {
      file,
      fileName: `${this.options.fileName}.${this.options.format}`,
      format: this.options.format,
      height: this.metadata.height,
      width: this.metadata.width,
      createdAt: new Date(),
      hash,
      metadata: { ...this.metadata },
    };
    return new ImageWithHash(construction);
  }
}
