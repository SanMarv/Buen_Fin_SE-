import {
  CER_MIMETYPES,
  fielConfig,
  KEY_MIMETYPES,
} from "@backend/configs/fielConfig.js";
import multer from "multer";
import z from "zod";
import path from "node:path";
import { type RequestHandler } from "express";

const hasExt = (ext: string) => (name: string) =>
  path.extname(name).toLowerCase() === ext;

const satFileSchema = z.discriminatedUnion("fieldname", [
  z.object({
    fieldname: z.literal("cer"),
    originalname: z
      .string()
      .refine(hasExt(fielConfig.CER_EXTENSION), "Expected .cer extension"),
    mimetype: z.enum(CER_MIMETYPES),
  }),
  z.object({
    fieldname: z.literal("key"),
    originalname: z
      .string()
      .refine(hasExt(fielConfig.KEY_EXTENSION), "Expected .key extension"),
    mimetype: z.enum(KEY_MIMETYPES),
  }),
]);
const fielMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: fielConfig.MAX_SIZE_KB,
    files: 2,
  },
  fileFilter(_, file, callback) {
    const { success } = satFileSchema.safeParse(file);
    if (success) return callback(null, success);
    return callback(
      new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname),
    );
  },
});

export const fielUpload = fielMulter.fields([
  { name: "cer", maxCount: 1 },
  { name: "key", maxCount: 1 },
]);

export const fielMiddlewareInputValidator: RequestHandler = (
  req,
  res,
  next,
) => {
  fielUpload(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ status: 400, error: err.code });
    if (err)
      return res
        .status(500)
        .json({ status: 500, error: "Error processing files" });
    next();
  });
};
