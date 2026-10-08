import type { RequestHandlerWithValidInfo } from "@backend/types.js";
import { UsersController } from "@db/controllers/users.controller.js";

export const protectWithValidation: RequestHandlerWithValidInfo = async (_, res, next) => {
  const { auth } = res.locals;
  if (!auth || typeof auth.validation_id === "undefined")
    return res.status(500).json({ status: 500, error: "No user found to validate" });

  const { validation_id, user_id } = auth;
  const record = await UsersController.isUserValidated({
    user_id,
    validation_id,
  });
  if (record === null)
    return res.status(401).json({ status: 401, error: "Account missing validation" });
  res.locals.validation = record;
  return next();
};
