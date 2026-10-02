import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { TABLE_NAMES } from "@db/const.js";
import type { InferInsertModel } from "drizzle-orm";

export const users = pgTable(TABLE_NAMES.USERS, {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 200 }).notNull().unique(),
  password: varchar({ length: 200 }).notNull(),
});


export type UsersRecord = InferInsertModel<typeof users>;
