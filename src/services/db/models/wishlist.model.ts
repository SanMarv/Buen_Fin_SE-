import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.model.ts";

export const wishlists = pgTable("wishlists", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 200 }).notNull(),
  userId: uuid()
    .references(() => users.id)
    .notNull(),
});
