import sharp from "sharp";
import type { SharpInput } from "sharp";
import { encode } from "blurhash";

import type {
  ImageOptions,
  InputConstructor,
  ImageDefault,
  ImageProduct,
  ImageProductWithHash,
  ImageObject as ImageObjectType,
} from "../intefaces/image.ts";
import { config } from "../config.ts";
import type {
  ImageProcesor as ImageProcesorI,
  OptimeResult,
  OptimeNoHashResult,
} from "../intefaces/procesor.ts";
import { ImageObject, ImageWithHash } from "../outputs/index.ts";
import { DEFAULT_IMAGE } from "./const.ts";
export class ImageProcessor implements ImageProcesorI {
  protected file: SharpInput;
  public lastModified?: Date;
  protected options: ImageDefault;
  public metadata: ImageObjectType["metadata"];

  constructor(input: InputConstructor, options?: ImageOptions) {
    this.file = input.data;
    this.metadata = input.metadata;
    this.options = { ...DEFAULT_IMAGE, ...options };
  }
  async optimize(): OptimeResult {
    const image = await this.convertFormat();
    const hash = await this.hashImage();
    const construct: ImageProductWithHash = {
      file: image,
      id: this.options.fileName,
      fileName: `${this.options.fileName}.${this.options.format}`,
      createdAt: new Date(),
      format: this.options.format,
      height: this.metadata.height,
      width: this.metadata.width,
      hash,
      metadata: { ...this.metadata },
    };
    return new ImageWithHash(construct);
  }
  async raw(): OptimeNoHashResult {
    const {
      data: image,
      info: { height, width, format },
    } = await sharp(this.file).toBuffer({ resolveWithObject: true });
    const construct: ImageProduct = {
      id: this.options.fileName,
      fileName: `${this.options.fileName}.${this.metadata.format}`,
      createdAt: new Date(),
      file: image,
      format: format as ImageObject["image"]["format"],
      height,
      width,
      metadata: { ...this.metadata },
    };
    return new ImageObject(construct);
  }
  async optimizeNoHash(): OptimeNoHashResult {
    const image = await this.convertFormat();

    const construct: ImageProduct = {
      id: this.options.fileName,
      fileName: `${this.options.fileName}.${this.metadata.format}`,
      createdAt: new Date(),
      file: image,
      format: this.options.format,
      height: this.metadata.height,
      width: this.metadata.width,
      metadata: { ...this.metadata },
    };
    return new ImageObject(construct);
  }
  private getQuality() {
    const size = this.metadata.size || config.MIN_IMAGE_QUALITY;
    if (size <= config.MIN_IMAGE_QUALITY) return 100;
    return 80;
  }

  // Helper functions
  protected async convertFormat() {
    this.lastModified = new Date();
    const format = this.options.format === "jpg" ? "jpeg" : this.options.format;
    const image = await sharp(this.file)
      .withMetadata({ orientation: 3 })
      .toFormat(format, { quality: this.getQuality() })
      .toBuffer();
    this.metadata = await sharp(image).metadata();
    this.file = image;
    return image;
  }
  protected async hashImage() {
    const { height, width } = {
      height: Math.round(this.metadata.height * 0.1),
      width: Math.round(this.metadata.width * 0.1),
    };
    const image = await sharp(this.file)
      .resize({ height, width })
      .ensureAlpha()
      .raw()
      .toBuffer();
    const [x, y] = height < width ? [4, 3] : [4, 3];
    const hash = encode(new Uint8ClampedArray(image), width, height, x, y);
    return hash;
  }
}
