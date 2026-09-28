import { fail, success } from "@app/types";
import { db } from "@db/conection.js"
import type { UserCreate, UserOperationResult } from "@db/interfaces/users.interfaces.js"
import { users } from "@db/schema.js";
import { eq } from "drizzle-orm";
import { v7 as genUUID } from "uuid";

export class UsersController{
  
  static async createRegister(newUser : UserCreate) : UserOperationResult{
    const uuid = genUUID(); 

    try{
      const [user] = await db.insert(users).values({id: uuid, ...newUser}).returning();

      if(!user){
        return fail({status : 500,  error: "User was not returned by drizzle"}); 
      }

      return success(user); 
    }
    catch(e : any){
      console.log(e); 
      return fail({status : 500, error: "Unexpected error when creating user"})
    }
  }

  static async deleteRegister(email : string): UserOperationResult{
    try{
      const [eliminatedUser] = await db.delete(users).where(eq(users.email, email)).returning(); 
      if(!eliminatedUser){
        return fail({status : 500, error : "Could not find user to eliminate"})
      }
      return success(eliminatedUser); 
    }
    catch(e : any){
      console.log(e); 
      return fail({status: 500, error: "Unexpected error when eliminating user"})
    }

  }
}

