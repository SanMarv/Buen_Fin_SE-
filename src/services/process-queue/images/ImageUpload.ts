import { v4 as uuid } from "uuid";
import type { Request } from "express";
import { ImageProcessorFactory, type ImageObject } from "@images-service";
import { imageBucket as Bucket } from "@images-service";
import type { PutOneResult } from "@images/types";
import { ImageController } from "@db/controllers/images.controller.js";
import type { ImageRecord } from "@db/models/image.model.js";
type Props = {
  user_id: string;
  file: NonNullable<Request["file"]>;
};
export class ImageUpload {
  file: Props["file"];
  user_id: Props["user_id"];
  id: string;

  image?: ImageObject["image"];
  bucketData?: Awaited<PutOneResult>;
  constructor({ user_id, file }: Props) {
    this.id = uuid();
    this.user_id = user_id;
    this.file = file;
  }
  async process() {
    const imageProcesor = await ImageProcessorFactory(this.file.buffer, {
      fileName: this.id,
    });
    const { image } = await imageProcesor.raw();
    this.image = image;
  }
  async uploadToBucket() {
    if (!this.image)
      throw new Error("Caling upload to bucket without processing");
    this.bucketData = await Bucket.putOne({
      id: this.id,
      body: this.image.file,
      format: this.image.format,
    });
    return this.bucketData;
  }
  async deleteFromBucket() {
    if (!this.bucketData?.data) throw new Error("Delete without creation");
    await Bucket.deleteOne({ key: this.bucketData.data.id });
  }
  async createRecord(param: { alt?: ImageRecord["alt"] } = {}) {
    if (!this.image || !this.bucketData)
      throw new Error("Image not uploaded to bucket");
    if (!this.bucketData.success)
      throw new Error("There was and error uploading to bucket");
    const { url, uploadedAt } = this.bucketData.data;
    const result = await ImageController.create({
      url,
      height: this.image.height,
      width: this.image.width,
      user_id: this.user_id,
      alt: param.alt ?? null,
      metadata: {
        createdAt: this.image.createdAt,
        originalFileName: this.file.filename,
        uploadedAt,
      },
    });
    return result;
  }
}
