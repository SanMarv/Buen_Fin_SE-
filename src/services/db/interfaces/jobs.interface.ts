import type { jobsRecord } from "@db/models/jobs.model.js";
import type { ErrorFormat } from "../../types/errors.js";
import type { Result } from "@app/types";
import type { CompaniesRecord } from "@db/models/companies.model.js";
import type { InferInsertModel } from "drizzle-orm";
import type { locations } from "@db/schema.js";

type GetJobResult = Pick<jobsRecord, "id" | "name" | "description"> & {
  company: Pick<CompaniesRecord, "name"> | null;
};

export type GetJobQuery = Promise<Result<GetJobResult[], ErrorFormat>>;
export type GetJobQueryOne = Promise<Result<GetJobResult, ErrorFormat>>;

export interface GetJobInput {
  page: number;
  sort: "asc" | "desc";
  company?: string;
}

export type GetJobByIdInput = Pick<jobsRecord, "id">;

export type LOCATION_ENTRY = InferInsertModel<typeof locations>;
