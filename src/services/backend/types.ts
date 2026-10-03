import type { Response, RequestHandler, Request, NextFunction } from "express";

export interface RequestWithUser extends Response {
  locals: Response["locals"] & {
    auth: {
      user_id: string;
    };
  };
}

export type RequestHandlerWithUser = (req: Request, res: RequestWithUser, next:NextFunction ) => ReturnType<RequestHandler>
