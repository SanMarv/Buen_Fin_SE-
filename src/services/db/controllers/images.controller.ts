import { v7 as genUUID } from "uuid";
import { db } from "@db/conection.js";
import type {
  ImageCreate,
  ImageCreateResult,
  ImageMoveUrl,
  ImageVisibilityResult,
} from "@db/interfaces/images.interfaces.js";
import { images, type VisibilityValue } from "@db/schema.js";
import { and, eq } from "drizzle-orm";
import {
  noContentError,
  successNoContent,
  success,
  fail,
  type NoContentResult,
  type PromiseResult,
} from "@app/types";

export class ImageController {
  static async create(newImage: ImageCreate): ImageCreateResult {
    const uuid = genUUID();
    try {
      const [image] = await db
        .insert(images)
        .values({
          id: uuid,
          ...newImage,
          alt: newImage.alt,
          hash: newImage.hash ?? null,
        })
        .returning();
      if (!image)
        return fail({
          status: 500,
          error: "Image was not returned by drizzle",
        });
      return success(image);
    } catch (e) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexpeted error trying to create image",
      });
    }
  }
  static async checkVisibility({
    bucket,
    key,
  }: {
    bucket: string;
    key: string;
  }): ImageVisibilityResult {
    const path = `/${bucket}/${key}`;
    try {
      const [record] = await db
        .select({ visibility: images.visibility, user_id: images.user_id })
        .from(images)
        .where(eq(images.path, path));
      if (!record) return fail({ status: 404 });
      return success({ ...record, status: 200 });
    } catch {
      return fail({ status: 404 });
    }
  }
  static async updateVisibility({
    bucket,
    key,
    user_id,
    visibility,
  }: {
    bucket: string;
    key: string;
    user_id: string;
    visibility: VisibilityValue;
  }): PromiseResult<
    { status: 200; affected: number },
    { status: 403 | 500; error: string }
  > {
    const path = `/${bucket}/${key}`;
    try {
      const records = await db
        .update(images)
        .set({ visibility })
        .where(and(eq(images.path, path), eq(images.user_id, user_id)))
        .returning();
      if (records.length <= 0)
        return fail({
          status: 403,
          error: "No images where affected, are you the owner?",
        });
      return success({ status: 200, affected: records.length });
    } catch {
      return fail({ status: 500, error: "Error in the database" });
    }
  }
  static async move([
    source,
    destination,
  ]: ImageMoveUrl): Promise<NoContentResult> {
    const sourceUrl = source.url;
    const { url: newUrl, hash: newHash, path: newPath } = destination;
    if (newUrl === sourceUrl)
      return noContentError({
        status: 409,
        error: `Trying to move same url moving ${sourceUrl} to ${newUrl}`,
      });
    try {
      const [prevMetadata] = await db
        .select({ metadata: images.metadata })
        .from(images)
        .where(eq(images.url, sourceUrl));
      if (!prevMetadata)
        return noContentError({
          status: 404,
          error: "Element trying to move not found in db",
        });
      await db
        .update(images)
        .set({
          url: newUrl,
          hash: newHash,
          path: newPath,
          metadata: { ...prevMetadata, ...destination.metadata },
        })
        .where(eq(images.url, sourceUrl));
      return successNoContent();
    } catch {
      return noContentError({
        status: 500,
        error: "Internal server error trying to update value",
      });
    }
  }
  static async deleteImage({
    bucket,
    key,
    user_id,
  }: {
    bucket: string;
    key: string;
    user_id: string;
  }): PromiseResult<{ status: 204 }, { status: number; error: string }> {
    const path = `/${bucket}/${key}`;
    try {
      await db
        .delete(images)
        .where(and(eq(images.user_id, user_id), eq(images.path, path)))
        .returning();
      return success({ status: 204 });
    } catch {
      return fail({
        error: "Error in DB deleting value of images",
        status: 500,
      });
    }
  }
}
