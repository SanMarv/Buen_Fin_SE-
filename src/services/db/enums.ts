import { CATEGORIES } from "@lib/types/categories.js";
import { pgEnum } from "drizzle-orm/pg-core";
import { visibilityValues } from "@lib/types/products.js";

export const VISIBILITY = {
  public: visibilityValues[0],
  private: visibilityValues[1],
  suspended: visibilityValues[2],
} as const;

export const visibilityEnum = pgEnum("visibility", visibilityValues);
export const categoryEnum = pgEnum("category", CATEGORIES);
