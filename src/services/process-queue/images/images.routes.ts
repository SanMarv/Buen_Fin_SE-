import { Router } from "express";
import { validateInputFile } from "./images.middleware.ts";
import { parseAuthHeader } from "@auth/headers.middleware.js";
import { imageRawQueue } from "../queues/ImageRawQueue.js";
import type { RequestWithUser } from "@backend/types.js";

const routes = Router();

routes.post(
  "/",
  parseAuthHeader,
  validateInputFile,
  async (req, res: RequestWithUser) => {
    const file = req.file!;
    const user_id = res.locals.auth.user_id;
    const {
      success: isUploaded,
      data: record,
      error,
    } = await imageRawQueue.enqueue({
      file,
      user_id,
    });
    if (!isUploaded) return res.status(error.status).json(error);
    return res.json(record);
  },
);

export default routes;
