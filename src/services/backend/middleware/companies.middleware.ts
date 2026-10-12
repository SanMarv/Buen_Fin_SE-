import type { RequestHandlerWithCompanyInfo } from "@backend/types";
import { CompaniesController } from "@db/controllers/companies.controller.js";

export const getUsersCompanies: RequestHandlerWithCompanyInfo = async (
  _,
  res,
  next,
) => {
  const { user_id } = res.locals.auth;
  const companies = await CompaniesController.getUserCompanies(user_id);
  res.locals.companies = companies;
  next();
};
