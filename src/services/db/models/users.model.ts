import { pgTable, uuid } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/singlestore-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 200 }).notNull(),
  password: varchar({ length: 200 }).notNull(),
});
