import { Router } from "express";
import { validateInputFile } from "./images.middleware.ts";
import { parseAuthHeader } from "@auth/headers.middleware.js";
import { ImageUpload } from "./ImageUpload.ts";
import { queue } from "../queue.ts";
import type { RequestWithUser } from "@backend/types.js";

const routes = Router();

routes.post(
  "/",
  parseAuthHeader,
  validateInputFile,
  async (req, res: RequestWithUser) => {
    const file = req.file!;
    const user_id = res.locals.auth.user_id;
    const imageUpload = new ImageUpload({ user_id, file });

    // Basic process before upload
    await imageUpload.process();

    // Upload to bucket
    const { success: isUploaded, error: bucketError } =
      await imageUpload.uploadToBucket();

    if (!isUploaded) return res.status(bucketError.status).json(bucketError);

    // Adding record
    const {
      success: wasCreated,
      error: dbError,
      data: recordData,
    } = await imageUpload.createRecord({ alt: req.body.alt });

    if (!wasCreated) return res.status(dbError.status).json(dbError);
    queue.enqueue({
      image: imageUpload.image!,
      source: { url: recordData.url },
    });
    return res.json({ url: recordData });
  },
);

export default routes;
