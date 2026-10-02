import type { NextFunction, Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "@env";
import type { RequestWithUser } from "../types.ts";
export const signResponseWithAuth = (req: Request, res: RequestWithUser) => {
  try {
    const { auth } = res.locals;
    if (!auth || !auth.user_id)
      res
        .status(500)
        .json({ status: 500, error: "No user id found for for jwt" });
    const { user_id } = auth;
    const auth_token = jwt.sign({ user_id }, env.JWT_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", auth_token, {
      httpOnly: true,
      path: "/",
    });

    res.sendStatus(204);
  } catch {
    return res.status(500).json({
      status: 500,
      error: "Unknown error while generating session",
    });
  }
};

export const protectRoute: RequestHandler = (req, res) => {
  const { token } = req.cookies;
  if (!token)
    return res
      .status(400)
      .json({ error: "Bad request token not found", status: 400 });
  try {
    const user = jwt.verify(token, env.JWT_KEY);
    res.locals.auth = user;
  } catch {
    return res.status(403).json({ status: 403, error: "Unauthorized" });
  }
};
