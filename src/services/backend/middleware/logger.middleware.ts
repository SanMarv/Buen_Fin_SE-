import { manager } from "@backend/logger/manager.js";
import type { RequestActions } from "@backend/logger/types.js";
import type { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, res, next) => {
  res.on("finish", () => {
    manager.addLog({
      type: "Request",
      action: req.method as RequestActions,
      status: res.statusCode,
      endpoint: req.route.path,
      id: res.locals.auth?.user_id ?? "Anonymus",
    });
  });
  next();
};
