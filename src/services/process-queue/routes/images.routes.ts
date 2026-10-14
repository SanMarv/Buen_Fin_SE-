import { Router } from "express";
import { validateInputFile } from "../middleware/images.middleware.ts";
import { parseAuthHeader } from "@auth/headers.middleware.js";
import { imageRawQueue } from "../queues/ImageRawQueue.ts";
import type { RequestWithUser } from "@backend/types.js";

const routes = Router();

routes.post(
  "/",
  parseAuthHeader,
  validateInputFile,
  async (req, res: RequestWithUser) => {
    const file = req.file!;
    const { user_id } = res.locals.auth;
    const {
      success: isUploaded,
      data: record,
      error,
    } = await imageRawQueue.enqueue({
      file,
      user_id,
      alt: req.body.alt,
    });
    // TODO: Retry generic function with exponential delay
    if (!isUploaded)
      return res
        .status(error.status)
        .json({ status: error.status, error: error.error });
    return res.json(record.data);
  },
);

export default routes;
