import type { ValidationRecord } from "../models/validation.model.ts";

export interface ValidCompany extends ValidationRecord {
  rfc: string;
}
