import { Router, type RequestHandler } from "express";
import { fileMiddleware } from "./multer.middleware.ts";

const validateFileInputExits: RequestHandler = (req, res, next) => {
  const file = req.file;
  if (!file)
    return res.status(400).json({
      status: 400,
      error: "File was no found in request",
    });
  next();
};

const app = Router();
app.use(fileMiddleware, validateFileInputExits);

export const validateInputFile = app;
