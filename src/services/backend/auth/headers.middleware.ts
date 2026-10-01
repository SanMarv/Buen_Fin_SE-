import type { RequestHandler, Response } from "express";

export const parseAuthHeader: RequestHandler = (req, res, next) => {
  const user_id = req.header("x-user-id");
  if (!user_id)
    return res.status(401).json({
      status: 401,
      error: "Request dosen't contains the correct headers",
    });

  res.locals.auth = {
    user_id,
  };
  next();
};
export interface RequestWithUser extends Response {
  locals: Response["locals"] & {
    auth: {
      user_id: string;
    };
  };
}
