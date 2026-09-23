import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { TABLE_NAMES } from "@db/const.js";

export const users = pgTable(TABLE_NAMES.USERS, {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 200 }).notNull(),
  password: varchar({ length: 200 }).notNull(),
});
