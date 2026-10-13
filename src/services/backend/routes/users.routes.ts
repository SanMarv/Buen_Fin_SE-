import { Router, type NextFunction } from "express";
import { signResponseWithAuth, protectRoute } from "@auth/jwt.middleware.js";
import { type Request, type Response } from "express";
import { UsersController } from "@db/controllers/users.controller.js";
import type { Auth } from "../types.js";
import * as argon2 from "argon2";
import { inputValidationMiddleware } from "@backend/middleware/inputValidation.middleware.js";
import {
  userRegisterInput,
  userLoginSchema,
  type UserLoginInput,
  type UserRegisterInput,
} from "@lib/schemas/user.schema.js";
const userRouter = Router();

userRouter.post(
  "/login",
  inputValidationMiddleware(userLoginSchema, "user"),
  async (
    req: Request,
    res: Response<unknown, { user: UserLoginInput; auth: Auth }>,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = res.locals.user;
      if (!email || !password)
        return res
          .status(400)
          .json({ code: 400, error: "Email or password are not there" });

      const {
        success: isFound,
        data,
        error,
      } = await UsersController.returnRegister({ email, password });

      if (!isFound) {
        return res.status(error.status).json(error);
      }
      const { id, validation_id } = data;
      res.locals.auth = {
        user_id: id,
        validation_id,
      };
      next();
    } catch (e: unknown) {
      console.log(e);
      return res
        .status(500)
        .json({ code: 500, error: "Unexpected error when logging in" });
    }
  },
  signResponseWithAuth,
);

userRouter.post(
  "/register",
  inputValidationMiddleware(userRegisterInput, "newUser"),
  async (
    _: Request,
    res: Response<unknown, { newUser: UserRegisterInput }>,
  ) => {
    if (!res.locals.newUser) {
      return res
        .status(500)
        .json({ status: 500, error: "Unexpected error when creating user" });
    }
    const { email, lastname, name: firstName, password } = res.locals.newUser;

    const name = `${firstName.toLocaleLowerCase()} ${lastname.toLocaleLowerCase()}`;
    const passwordHash = await argon2.hash(password, { parallelism: 1 });

    const { success: created, error } = await UsersController.createRegister({
      name,
      email,
      password: passwordHash,
    });

    if (!created) {
      return res.status(error.status).json(error);
    }
    return res.sendStatus(201);
  },
);

userRouter.post("/logout", (_, res: Response) => {
  res.clearCookie("token");
  res.sendStatus(204);
});

userRouter.delete("/delete", protectRoute, async (_, res: Response) => {
  try {
    const { user_id } = res.locals.auth;

    const eliminated = await UsersController.deleteRegister(user_id);

    if (!eliminated) {
      return res
        .status(404)
        .json({ status: 404, error: "User does not exist" });
    }

    res.clearCookie("token");
    res.sendStatus(204);
  } catch (e: unknown) {
    console.error(e);
    return res
      .status(500)
      .json({ status: 500, error: "Unexpected error when eliminating user" });
  }
});

userRouter.put("/update", protectRoute, async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals.auth;

    if (!req.body.original_password) {
      return res.status(400).json({
        status: 400,
        error: "Can't update data without your current password",
      });
    }

    const { success, error } = await UsersController.updateUser({
      user_id,
      ...req.body,
    });

    if (!success) {
      return res.status(error.status).json(error);
    }

    res.sendStatus(200);
  } catch (e: unknown) {
    console.error(e);
    return res
      .status(500)
      .json({ status: 500, error: "Unexpected error updating user" });
  }
});

export default userRouter;
