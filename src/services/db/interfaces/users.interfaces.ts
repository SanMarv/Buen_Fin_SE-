import type { Result } from "@app/types";
import type { UsersRecord } from "@db/models/users.model.js";

export type UserCreate = Omit<UsersRecord, "id">;
export interface UserLogin {
  email: string;
  password: string;
}
type CreateError = { status: 500 | 400 | 404 | 401; error: string };
export type UserOperationResult = Promise<
  Result<{ id: string; validation_id: null | string }, CreateError>
>;

export interface UserUpdate {
  id: string;
  new_email: string;
  new_password: string;
  old_password: string;
}
