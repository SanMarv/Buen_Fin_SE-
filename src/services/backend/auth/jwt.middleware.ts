import type { Request } from "express";
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
