import type { ValidationRecord } from "@db/models/validation.model.js";
import type {
  Response,
  RequestHandler as ExpressRequestHandler,
  Request,
  NextFunction,
} from "express";
import type { CompanieInput as ValidatedCompanieInput } from "./schemas/company.schema.ts";

export interface ResponseLocals<P> extends Response {
  locals: P & Response["locals"];
}
export type ValidationInfo = Omit<ValidationRecord, "hash" | "signature">;

// locals
interface Auth {
  user_id: string;
  validation_id: string | null;
}
interface AuthValidated extends Auth {
  validation_id: string;
}
interface ValidationData {
  auth: AuthValidated;
  validation: ValidationInfo;
}
interface Company extends ValidationData {
  companie: ValidatedCompanieInput;
}

export type RequestHandler<T> = (
  req: Request,
  res: ResponseLocals<T>,
  next: NextFunction,
) => ReturnType<ExpressRequestHandler>;

export interface AuthWithCompany {
  auth: {
    companyId: string;
  };
}
// Request
export type RequestWithUser = ResponseLocals<{ auth: Auth }>;
export type RequestWithValidation = ResponseLocals<{ auth: AuthValidated }>;
export type RequestWithCompany = ResponseLocals<Company>;
export type RequestWithCompanyId = ResponseLocals<AuthWithCompany>;

// Handlers
export type RequestHandlerWithValidInfo = RequestHandler<ValidationData>;
export type RequestHandlerWithUser = RequestHandler<{ auth: Auth }>;
export type RequestHadlerWithCompany = RequestHandler<Company>;
