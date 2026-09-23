import { pgTable, varchar, integer, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.model.ts";

export const companies = pgTable("company", {
  id: uuid("id").primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  RFC: integer().notNull(),
});
