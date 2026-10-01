import type { Response } from "express";

export interface RequestWithUser extends Response {
  locals: Response["locals"] & {
    auth: {
      user_id: string;
    };
  };
}
