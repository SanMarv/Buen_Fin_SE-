import { fail, success } from "@app/types";
import { db } from "@db/conection.js";
import type {
  UserCreate,
  UserOperationResult,
  UserLogin,
} from "@db/interfaces/users.interfaces.js";
import { users } from "@db/schema.js";
import { eq, and } from "drizzle-orm";
import { v7 as genUUID } from "uuid";

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
    } catch (e: any) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexpected error when creating user",
      });
    }
  }

  static async deleteRegister(email: string): UserOperationResult {
    try {
      const [eliminatedUser] = await db
        .delete(users)
        .where(eq(users.email, email))
        .returning();
      if (!eliminatedUser) {
        return fail({ status: 500, error: "Could not find user to eliminate" });
      }
      return success(eliminatedUser);
    } catch (e: any) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexpected error when eliminating user",
      });
    }
  }

  static async returnRegister(user: UserLogin): UserOperationResult {
    try {
      const [record] = await db
        .select({ id: users.id })
        .from(users)
        .where(
          and(eq(users.email, user.email), eq(users.password, user.password)),
        );
      if (!record) {
        return fail({ status: 404, error: "User not found" });
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
}
