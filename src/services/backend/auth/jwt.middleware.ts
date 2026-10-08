import type { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "@env";
import type { RequestWithUser } from "../types.ts";
import { COOKIES_OPTS } from "@config/app.const.js";
export const signResponseWithAuth = (req: Request, res: RequestWithUser) => {
  try {
    const { auth } = res.locals;
    if (!auth || !auth.user_id)
      res
        .status(500)
        .json({ status: 500, error: "No user id found for jwt signing" });
    const auth_token = jwt.sign({ ...auth }, env.JWT_KEY, {
      expiresIn: "7d",
    });

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
    const user = jwt.verify(token, env.JWT_KEY);
    res.locals.auth = user;
  } catch {
    return res.status(403).json({ status: 403, error: "Unauthorized" });
  }
  next();
};
