import type { Result } from "@app/types";
import type { ValidCompany } from "@db/interfaces/validation.interface.js";

export interface ValidateSatSchema {
  cer: Buffer;
  key: Buffer;
  password: string;
}

interface ValidationError {
  status: 500 | 400 | 403;
  error: string;
}

export type ValidationResult = Result<ValidCompany, ValidationError>;
