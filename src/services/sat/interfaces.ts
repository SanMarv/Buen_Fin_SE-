import type { Result } from "@app/types";

export interface ValidateSatSchema {
  cer: string;
  key: string;
  password: string;
}

interface ValidationError {
  status: 500 | 400 | 403;
  error: string;
}

export interface SuccessSign {
  rfc: string;
  signed: string;
  hash: string;
  valid_until: Date;
}
export type PartialSuccessSign = Partial<SuccessSign>;
export type ValidationResult = Result<SuccessSign, ValidationError>;
