import { Router, type RequestHandler } from "express";
import { SUPORTED_MIMETYPES } from "@images/intefaces/image.js";
import { config } from "@images/config.js";
import z from "zod";
import multer from "multer";

const PREVENT_OVERFLOW_IN_NAME = 1000;
const { MAX_IMAGE_SIZE } = config;
const fileSchema = z.object({
  mimetype: z.enum(SUPORTED_MIMETYPES),
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldNameSize: PREVENT_OVERFLOW_IN_NAME,
    fileSize: MAX_IMAGE_SIZE,
  },
  fileFilter(_, file, next) {
    const { success } = fileSchema.safeParse(file);
    return next(null, success);
  },
});

const validateFileInputExits: RequestHandler = (req, res, next) => {
  const file = req.file;
  if (!file)
    return res.status(500).json({
      status: 500,
      error: "Error processing file multer not extracted file",
    });
  next();
};

const app = Router();
app.use(upload.single("file"), validateFileInputExits);

export const validateInputFile = app;
