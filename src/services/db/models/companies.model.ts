import { pgTable, varchar, uuid, date, integer } from "drizzle-orm/pg-core";
import { users } from "./users.model.ts";
import { validation_table } from "./validation.model.ts";

export const companies = pgTable("company", {
  id: uuid("id").primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  RFC: varchar({ length: 13 }).notNull(),
  validation_id: integer().references(() => validation_table.id),
});
