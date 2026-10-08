import type { PromiseResult } from "@app/types";
import type { companies } from "@db/schema.js";
import type { InferSelectModel } from "drizzle-orm";

type CompanieRecord = InferSelectModel<typeof companies>;

export type CreateCompanieResult = PromiseResult<
  CompanieRecord,
  { error: string; status: number }
>;
