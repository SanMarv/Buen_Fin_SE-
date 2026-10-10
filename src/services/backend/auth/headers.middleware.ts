import type { NextFunction, Request, RequestHandler } from "express";
import { env } from "@env";
import { createHmac } from "node:crypto";
import type {
  RequestHandlerWithUser,
  RequestWithCompanyId,
} from "@backend/types.js";
import { HEADERS } from "@backend/const.js";
import { CompaniesController } from "@db/controllers/companies.controller.js";
import z from "zod";

const getHmac = (mess: string) => {
  return createHmac("sha256", env.HMAC_KEY).update(mess).digest("base64");
};

export const parseAuthHeader: RequestHandler = (req, res, next) => {
  // getting user header
  const { success: isValidHeader, data: user_id } = z
    .uuidv7()
    .safeParse(req.header(HEADERS["USER_ID"]));
  if (!isValidHeader)
    return res.status(401).json({
      status: 401,
      error: "Request dosen't contains the correct headers",
    });
  // Getting signature
  const signHeader = req.header(HEADERS["SIGNATURE"]);
  if (!signHeader)
    return res.status(403).json({
      status: 403,
      error: "Missing correct authentification",
    });
  // Check if valid
  const isValid = signHeader === getHmac(user_id);
  if (!isValid)
    return res.status(403).json({ status: 403, error: "Unouthorized request" });

  res.locals.auth = {
    user_id,
  };
  next();
};

export const parseProfileHeader = (
  req: Request,
  res: RequestWithCompanyId,
  next: NextFunction,
) => {
  // getting user header
  const { success: isValidHeader, data: company } = z
    .uuidv4()
    .safeParse(req.header(HEADERS["COMPANY_ID"]));
  if (!isValidHeader)
    return res.status(401).json({
      status: 401,
      error: "Request dosen't contains the correct headers",
    });
  // Getting signature
  const signHeader = req.header(HEADERS["SIGNATURE"]);
  if (!signHeader)
    return res.status(403).json({
      status: 403,
      error: "Missing correct authentification",
    });
  // Check if valid
  const isValid = signHeader === getHmac(company);
  if (!isValid)
    return res.status(403).json({ status: 403, error: "Unouthorized request" });

  res.locals.auth = {
    companyId: company,
  };
  next();
};

export const validateCompanyHeader: RequestHandlerWithUser = async (
  req,
  res,
) => {
  const { success: isValidHeader, data: companieId } = z
    .uuidv4()
    .safeParse(req.header(HEADERS["COMPANY_ID"]));
  if (!isValidHeader)
    return res.status(401).json({ status: 401, error: "error in company" });
  const user_id = res.locals.auth.user_id;
  const { success: isOwner } = await CompaniesController.checkOwner(
    companieId,
    user_id,
  );
  if (!isOwner)
    return res.status(403).json({ status: 403, error: "Unouthorized" });
  res.setHeader(HEADERS["SIGNATURE"], getHmac(companieId));
  res.setHeader(HEADERS["COMPANY_ID"], companieId);
  res.sendStatus(204);
};

export const signHeader: RequestHandlerWithUser = (_, res) => {
  const { auth } = res.locals;
  if (!auth) throw new Error("Request tring to be signed while empty");
  const sign = getHmac(auth.user_id);
  res.setHeader(HEADERS["USER_ID"], auth.user_id);
  res.setHeader(HEADERS["SIGNATURE"], sign);
  res.sendStatus(204);
};
