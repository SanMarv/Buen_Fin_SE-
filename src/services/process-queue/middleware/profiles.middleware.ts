import { Router, type RequestHandler } from "express";
import { fileMiddleware } from "./multer.middleware.ts";

const validateFileInputFile: RequestHandler = (req, res, next) => {
  const file = req.file;
  const image = file?.buffer ?? null;
  res.locals.image = image;
  next();
};

const app = Router();
app.use(fileMiddleware, validateFileInputFile);

export const validateInputFile = app;
