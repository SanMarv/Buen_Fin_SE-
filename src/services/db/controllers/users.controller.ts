import { fail, success } from "@app/types";
import { db } from "@db/conection.js";
import type {
  UserCreate,
  UserOperationResult,
  UserLogin,
  UserUpdate,
} from "@db/interfaces/users.interfaces.js";
import { users, validation_table } from "@db/schema.js";
import { and, eq } from "drizzle-orm";
import { v7 as genUUID } from "uuid";
import * as argon2 from "argon2";
import type { ValidationInfo } from "@backend/types.js";
import { ERROR_CODES } from "../../types/errors.js";
import { manager } from "@backend/logger/manager.js";
export class UsersController {
  static async createRegister(newUser: UserCreate): UserOperationResult {
    if (await this.isEmailSaved(newUser.email))
      return fail({ status: 409, error: "User already exits" });
    const uuid = genUUID();
    try {
      const [user] = await db
        .insert(users)
        .values({ id: uuid, ...newUser })
        .returning();

      const res = await manager.addLog({
        type: "DB",
        id: uuid,
        table: "Users",
        action: "CREATE",
      });

      console.log(res);

      if (!user) {
        return fail(ERROR_CODES.NOT_FOUND);
      }

      return success(user);
    } catch (e: unknown) {
      console.error(e);
      return fail(ERROR_CODES.SERVER_ERROR);
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
        .select({
          id: users.id,
          password: users.password,
          validation_id: users.validation_id,
        })
        .from(users)
        .where(eq(users.email, user.email));
      if (!record) {
        return fail(ERROR_CODES.NOT_FOUND);
      }

      const isValid = await argon2.verify(record.password, user.password);
      if (!isValid) {
        return fail({ status: 401, error: "Incorrect credentials" });
      }
      const { id, validation_id } = record;
      return success({ id, validation_id });
    } catch (e: unknown) {
      console.error(e);
      return fail(ERROR_CODES.SERVER_ERROR);
    }
  }

  static async isUserSaved(id: string): Promise<boolean> {
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

  static async isEmailSaved(email: string): Promise<boolean> {
    try {
      const records = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));
      return records.length > 0;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  }

  static async isUserValidated({
    user_id,
    validation_id,
  }: {
    validation_id: string | null;
    user_id: string;
  }): Promise<ValidationInfo | null> {
    if (validation_id === null) return null;
    const [results] = await db
      .select({
        id: validation_table.id,
        valid_until: validation_table.valid_until,
        name: validation_table.name,
        rfc: validation_table.rfc,
        isMoral: validation_table.isMoral,
      })
      .from(validation_table)
      .innerJoin(users, eq(users.validation_id, validation_table.id))
      .where(
        and(eq(users.id, user_id), eq(validation_table.id, validation_id)),
      );
    return results ?? null;
  }

  static async updateUser(new_data: UserUpdate): UserOperationResult {
    try {
      const [record] = await db
        .select({ password: users.password })
        .from(users)
        .where(eq(users.id, new_data.id));

      const isValid = await argon2.verify(
        record.password,
        new_data.old_password,
      );

      if (!isValid) {
        return fail({ status: 401, error: "Incorrect credentials" });
      }

      const [updated_record] = await db
        .update(users)
        .set({
          email: new_data.new_email,
          password: new_data.new_password,
        })
        .where(eq(users.id, new_data.id))
        .returning();

      return success(updated_record);
    } catch (e: unknown) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexpected error when updating user",
      });
    }
  }
}
