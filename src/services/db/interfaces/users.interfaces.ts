import type { Result } from "@app/types";
import type { UsersRecord } from "@db/models/users.model.js";

export type UserCreate = Omit<UsersRecord, "id">;

type CreateError = { status: 500 | 400; error: string };
export type UserOperationResult =  Promise<Result<UsersRecord, CreateError>>;
