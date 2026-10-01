import type { Result } from "@app/types";
import type { UsersRecord } from "@db/models/users.model.js";
import type Request  from "express";

export type UserCreate = Omit<UsersRecord, "id">;
export interface UserLogin {
  email: string, 
  password: string,
};

export interface AuthenticationRequest extends Request {
  user: UserLogin, 
}; 

type CreateError = { status: 500 | 400 | 404; error: string };
export type UserOperationResult =  Promise<Result<UsersRecord, CreateError>>;
