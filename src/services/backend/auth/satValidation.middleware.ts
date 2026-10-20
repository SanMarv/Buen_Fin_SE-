import type { NextFunction, Request, Response } from "express";
import { SatValidator } from "@sat/validator.js";
import { ValidationController } from "@db/controllers/validation.controller.js";
import z from "zod";

export const satValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.files || Array.isArray(req.files)) {
    return res
      .status(400)
      .json({ status: 400, error: "Certificate and Key are required" });
  }
  const cer = req.files?.cer?.[0];
  const key = req.files?.key?.[0];
  const password = z.string().min(1).safeParse(req.body.password).data;
  if (!cer || !key || !password) {
    return res.status(400).json({
      status: 400,
      error: "Certificate, Key or password are required",
    });
  }
  try {
    const validator = new SatValidator({
      cer: cer.buffer,
      key: key.buffer,
      password,
    });

    const { success, data, error } = validator.validate();

    if (!success) {
      return res.status(error.status).json(error);
    }

    const {
      success: ok,
      data: validation,
      error: Dberror,
    } = await ValidationController.insertValidation(data);

    if (!ok) {
      return res.status(Dberror.status).json(Dberror);
    }

    res.locals.validation = { validation_id: validation };

    next();
  } catch {
    return res
      .status(500)
      .json({ status: 500, error: "Error inesperado validando e firma" });
  }
};
