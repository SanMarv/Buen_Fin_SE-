import type { Request, RequestHandler } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "@env";
import type { RequestWithUser } from "../types.ts";
import { COOKIES_OPTS } from "@config/app.const.js";

export const signJWT = (payload: object, options?: SignOptions) =>
  jwt.sign(payload, env.JWT_KEY, { algorithm: "HS256", ...options });

export const verifyJWT = (token: string) =>
  jwt.verify(token, env.JWT_KEY, { algorithms: ["HS256"] });

export const signResponseWithAuth = (req: Request, res: RequestWithUser) => {
  try {
    const { auth } = res.locals;
    if (!auth || !auth.user_id)
      res
        .status(500)
        .json({ status: 500, error: "No user id found for jwt signing" });

    const auth_token = signJWT(auth, { expiresIn: "7d" });
    res.cookie("token", auth_token, COOKIES_OPTS);

    res.sendStatus(204);
  } catch {
    return res.status(500).json({
      status: 500,
      error: "Unknown error while generating session",
    });
  }
};

export const protectRoute: RequestHandler = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res
      .status(401)
      .json({ error: "Bad request token not found", status: 401 });
  try {
    const user = verifyJWT(token);
    res.locals.auth = user;
  } catch {
    return res.status(403).json({ status: 403, error: "Unauthorized" });
  }
  next();
};
