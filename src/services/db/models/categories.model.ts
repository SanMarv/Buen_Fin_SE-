import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
});
