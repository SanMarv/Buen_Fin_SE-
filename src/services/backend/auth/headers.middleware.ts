import type { RequestHandler } from "express";
import { env } from "@env";
import { createHmac } from "node:crypto";
import type { RequestHandlerWithUser } from "@backend/types.js";
import { HEADERS } from "@backend/const.js";

const getHmac = (mess: string) => {
  return createHmac("sha256", env.HMAC_KEY).update(mess).digest("base64");
};

export const parseAuthHeader: RequestHandler = (req, res, next) => {
  // getting user header
  const user_id = req.header(HEADERS["USER_ID"]);
  if (!user_id)
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

export const signHeader: RequestHandlerWithUser = (_, res) => {
  const { auth } = res.locals;
  if (!auth) throw new Error("Request tring to be signed while empty");
  const sign = getHmac(auth.user_id);
  res.setHeader(HEADERS["USER_ID"], auth.user_id);
  res.setHeader(HEADERS["SIGNATURE"], sign);
  res.sendStatus(204);
};
