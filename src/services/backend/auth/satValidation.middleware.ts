import type { NextFunction, Request, Response } from "express";
import { SatValidator } from "@sat/validator.js";
import { ValidationController } from "@db/controllers/validation.controller.js";

export const satValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.files || Array.isArray(req.files)) {
    return res.status(400).json("Certificate and Key are required");
  }
  const cer = req.files?.cer?.[0];
  const key = req.files?.key?.[0];
  const password = req.body.password;
  if (!cer || !key || !password) {
    return res.status(400).json("Certificate, Key or password are required");
  }
  const validator = new SatValidator({
    cer: cer.buffer,
    key: key.buffer,
    password,
  });

  const { success, data, error } = validator.validate();

  if (!success) {
    return res.status(error.status).json(error);
  }

  const validation_id = await ValidationController.insertValidation(data);

  res.locals["validation"] = validation_id;

  next();
};
