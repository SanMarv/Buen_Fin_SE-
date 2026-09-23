import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 200 }).notNull(),
  password: varchar({ length: 200 }).notNull(),
});
