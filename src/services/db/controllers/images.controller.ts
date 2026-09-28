import { v7 as genUUID } from "uuid";
import { db } from "@db/conection.js";
import type {
  ImageCreate,
  ImageCreateResult,
  ImageMoveUrl,
} from "@db/interfaces/images.interfaces.js";
import { images } from "@db/schema.js";
import { eq } from "drizzle-orm";
import {
  noContentError,
  successNoContent,
  success,
  fail,
  type NoContentResult,
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
          alt: newImage.alt ?? null,
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
  static async move([
    source,
    destination,
  ]: ImageMoveUrl): Promise<NoContentResult> {
    const sourceUrl = source.url;
    const { url: newUrl, hash: newHash } = destination;
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
          metadata: { ...prevMetadata, ...(destination.metadata ?? {}) },
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
}
