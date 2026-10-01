import type { NextFunction, RequestHandler, Response} from "express";
import { type AuthenticationRequest, type UserLogin } from "@db/interfaces/users.interfaces.js";
import { UsersController } from "@db/controllers/users.controller.js";
import jwt from "jsonwebtoken"; 

process.loadEnvFile(); 

export const assignAuthHeader  = async (req : AuthenticationRequest, res: Response, next : NextFunction) => {
  try{
    const email = req.user.email;
    const password = req.user.password; 

    const user = await UsersController.returnRegister({email, password}); 

    if(!user.success){
      return res.status(404).json({
        status: 404, 
        error: "User not found"
      })
    }
     
    const auth_token = jwt.sign(user.data, process.env.JWT_KEY || "", {
      expiresIn: "7d"
    }); 

    res.cookie("x-user-id", auth_token, {
      httpOnly: true, 
      path: '/', 
    })

    next(); 

    
  }
  catch(e : unknown){
    return res.status(500).json({
      status: 500, 
      error: "Unknown error while generating session"
    }); 
  }
}
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
