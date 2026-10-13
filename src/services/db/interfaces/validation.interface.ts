import type { ValidationRecord } from "../models/validation.model.ts";
import type { Result } from "@app/types";
import type { ErrorFormat } from "../../types/errors.js";

export interface ValidCompany extends ValidationRecord {
  rfc: string;
}

export type ValidCompanyInput = Omit<ValidCompany, "id">;

export type CompanyOperationResult = Promise<Result<string, ErrorFormat>>;
