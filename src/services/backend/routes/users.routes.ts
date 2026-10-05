import { Router, type NextFunction } from "express";
import { signResponseWithAuth, protectRoute } from "@auth/jwt.middleware.js";
import { type Request, type Response } from "express";
import { UsersController } from "@db/controllers/users.controller.js";
import type { RequestWithUser } from "../types.js";
import * as argon2 from "argon2"; 
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
    
    req.body.password = await argon2.hash(password); 

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

userRouter.delete("/delete", protectRoute, async (req : Request, res : Response) => {
  try{
    const { user_id } = res.locals.auth; 
    
    const eliminated = await UsersController.deleteRegister(user_id); 

    if(!eliminated){
      return res.status(404).json({status: 404, error: "User does not exist"}); 
    }

    res.clearCookie("token"); 
    res.sendStatus(204); 
  }
  catch(e : unknown){
    console.error(e); 
    return res.status(500).json({status : 500, error : "Unexpected error when eliminating user"}); 
  }
}); 


userRouter.put("/update", protectRoute, async(req: Request, res: Response) =>{
  try{
    const { user_id } = res.locals.auth; 
    const {email, new_password, original_password} = req.body; 

    if(!original_password){
      return res.status(400).json({status: 400, error: "Can't update data without your current password"});
    }
  }
  catch(e : unknown){

  }
})

export default userRouter;
