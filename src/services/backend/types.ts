import type { ValidationRecord } from "@db/models/validation.model.js";
import type {
  Response,
  RequestHandler as ExpressRequestHandler,
  Request,
  NextFunction,
} from "express";
import type { CompanieInput as ValidatedCompanieInput } from "./schemas/company.schema.ts";
import type { COMPANY_ID_KEY } from "./const.ts";

export interface ResponseLocals<P> extends Response {
  locals: P & Response["locals"];
}
export type ValidationInfo = Omit<ValidationRecord, "hash" | "signature">;

// locals
interface Auth {
  user_id: string;
  validation_id: string | null;
}
interface ImageOwnerGet {
  auth: Auth;
  imageOwner: string;
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
interface OwnerRequest extends ValidationData {
  [COMPANY_ID_KEY]: string;
}
export interface CompaniesSelectUser {
  [COMPANY_ID_KEY]: string;
  name: string;
  profile_picture: string;
  certification: {
    rfc: string;
    legal_name: string;
    valid_until: Date;
  } | null;
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
export type RequestWithImageOwner = ResponseLocals<ImageOwnerGet>;
export type RequestWithValidation = ResponseLocals<{ auth: AuthValidated }>;
export type RequestWithCompany = ResponseLocals<Company>;
export type RequestWithCompanyId = ResponseLocals<AuthWithCompany>;
export type RequestWithCompaniesInfo = ResponseLocals<{
  companies: CompaniesSelectUser[];
}>;

// Handlers
export type RequestHandlerWithValidInfo = RequestHandler<ValidationData>;
export type RequestHandlerWithUser = RequestHandler<{ auth: Auth }>;
export type RequestHandlerWithCompanyInfo = RequestHandler<{
  auth: Auth;
  companies: CompaniesSelectUser[];
}>;
export type RequestHandlerWithCompany = RequestHandler<Company>;
export type RequestHandlerWithOwner = RequestHandler<OwnerRequest>;
