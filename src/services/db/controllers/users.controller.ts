import { fail, success } from "@app/types";
import { db } from "@db/conection.js";
import type {
  UserCreate,
  UserOperationResult,
  UserLogin,
  UserUpdate
} from "@db/interfaces/users.interfaces.js";
import { users } from "@db/schema.js";
import { eq } from "drizzle-orm";
import { v7 as genUUID } from "uuid";
import * as argon2 from "argon2"; 
export class UsersController {
  static async createRegister(newUser: UserCreate): UserOperationResult {
    const uuid = genUUID();

    try {
      const [user] = await db
        .insert(users)
        .values({ id: uuid, ...newUser })
        .returning();

      if (!user) {
        return fail({ status: 500, error: "User was not returned by drizzle" });
      }

      return success(user);
    } catch (e: unknown) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexpected error when creating user",
      });
    }
  }

  static async deleteRegister(id: string): Promise<boolean> {
    try {
      const [eliminatedUser] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
      if (!eliminatedUser) {
        return false;
      }
      return true;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  }
  static async returnRegister(user: UserLogin): UserOperationResult {
    try {
      const [record] = await db
        .select({ id: users.id, password : users.password })
        .from(users)
        .where(
         eq(users.email, user.email),
        );
      if (!record) {
        return fail({ status: 404, error: "User not found" });
      }

      const isValid = await argon2.verify(record.password, user.password); 
      if(!isValid){
        return fail({status: 401, error: "Incorrect credentials"}); 
      }
      return success(record);
    } catch (e: unknown) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexcpeted error when retrieving user",
      });
    }
  }

  static async validateUser(id: string): Promise<boolean> {
    try {
      const records = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, id));
      return records.length > 0;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  }

  static async updateUser(new_data: UserUpdate) : UserOperationResult{
    try{
      const [record] = await db
        .select({password : users.password })
        .from(users)
        .where(
         eq(users.id, new_data.id),
        );

      const isValid = await argon2.verify(record.password, new_data.old_password);

      if(!isValid){
        return fail({status: 401, error: "Incorrect credentials"}); 
      }

      const [updated_record] = await db.update(users).set({
        email: new_data.new_email, 
        password: new_data.new_password
      }).where(eq(users.id, new_data.id)).returning(); 

      return success(updated_record);

    }
    catch(e : unknown){
      console.error(e); 
      return fail({status: 500, error: "Unexpected error when updating user"})
    }
  }
}
