import type { RequestHandler } from "express";
import z, { type ZodType } from "zod";

export const inputValidationMiddleware: (schema: ZodType, key: string) => RequestHandler = (
  schema,
  key,
) => {
  type Data = z.infer<typeof schema>;
  return (req, res, next) => {
    const { success, data, error } = schema.safeParse(req.body);
    if (!success) {
      const issue = error.issues[0];
      return res.status(400).json({ status: 400, error: `${issue.path}: ${issue.message}` });
    }
    res.locals[key] = data as Data;
    next();
  };
};
