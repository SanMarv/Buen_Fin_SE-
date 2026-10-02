import { Router, type NextFunction } from "express";
import { signResponseWithAuth } from "@auth/jwt.middleware.js";
import { type Request, type Response } from "express";
import { UsersController } from "@db/controllers/users.controller.js";
import type { RequestWithUser } from "../types.js";
const userRouter = Router();

userRouter.post(
  "/login",
  async (req: Request, res: RequestWithUser, next: NextFunction) => {
    try {
      const { email, password } = req.body;
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
      const { id } = data;
      res.locals.auth = {
        user_id: id,
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

userRouter.post("/register", async (req : Request, res : Response) => {
  try {
    const {name, email, password} = req.body; 

    if(!name || !email || !password){
      return res.status(400).json({code : 400, error: "Missing a mandatory field"}); 
    }

    const { success : created, error} = await UsersController.createRegister(req.body);

    if(!created){
      return res.status(error.status).json(error); 
    }

    res.sendStatus(201); 

  } catch (e: unknown) {
      console.error(e); 
      return res.status(500).json({status : 500, error: "Unexpected error when creating user"}); 
  }
});

userRouter.post("/logout", (_, res: Response) => {
  res.clearCookie("token");
  res.sendStatus(204);
});

export default userRouter;
