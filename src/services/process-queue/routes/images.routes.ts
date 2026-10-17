import { Router } from "express";
import { validateInputFile } from "../middleware/images.middleware.ts";
import { parseAuthHeader } from "@auth/headers.middleware.js";
import { imageRawQueue } from "../queues/ImageRawQueue.ts";
import type { RequestWithUser } from "@backend/types.js";
import { checkRequestParameter } from "@backend/schemas/app.schema.js";
import { ProductsController } from "@db/controllers/products.controller.js";

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

routes.post(
  "/:postId",
  parseAuthHeader,
  validateInputFile,
  async (req, res) => {
    const { success: isValidId, data: postId } = checkRequestParameter(
      "postId",
      req.params,
    );
    if (!isValidId) return res.sendStatus(401);
    const file = req.file!;
    const { user_id } = res.locals.auth;
    const {
      success: isUploaded,
      data: record,
      error: errorUploadingImage,
    } = await imageRawQueue.enqueue({
      file,
      user_id,
      alt: req.body.alt,
    });
    if (!isUploaded)
      return res.status(errorUploadingImage.status).json({
        status: errorUploadingImage.status,
        error: errorUploadingImage.error,
      });
    const { success } = await ProductsController.getProductByID({ id: postId });
    if (!success) return res.status(202).json({ imageUploaded: record.data });
    const { status, error } = await ProductsController.appendImage({
      image_id: record.data.id,
      product_id: postId,
    });
    return res.status(status).json({ imageUploaded: record.data, error });
  },
);

export default routes;
