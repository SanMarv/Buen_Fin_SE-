import { refreshEditMode } from "@auth/edit.middleware.js";
import { validateCompanyHeader } from "@auth/headers.middleware.js";
import { protectRoute } from "@auth/jwt.middleware.js";
import { protectWithValidation } from "@auth/validation.middleware.js";
import { getUsersCompanies } from "@backend/middleware/companies.middleware.js";
import { fielMiddlewareInputValidator } from "@backend/middleware/fielMulter.middleware.js";
import { companiesInputValidation } from "@backend/schemas/company.schema.js";
import type {
  RequestWithCompaniesInfo,
  RequestWithCompany,
} from "@backend/types";
import { CompaniesController } from "@db/controllers/companies.controller.js";
import { Router } from "express";

const app = Router();

app.use(protectRoute, protectWithValidation);
app.post("/", companiesInputValidation, async (_, res: RequestWithCompany) => {
  const { companie } = res.locals;
  const { success, data, error } = await CompaniesController.create(companie);
  if (!success) return res.status(error.status).json(error);
  return res.json(data);
});

app.get("/user", getUsersCompanies, (_, res: RequestWithCompaniesInfo) => {
  const { companies } = res.locals;
  if (companies.length <= 0) return res.sendStatus(204);
  return res.json(companies);
});

app.get(
  "/profile-validate",
  protectRoute,
  refreshEditMode,
  validateCompanyHeader,
);
app.post(
  "/",
  fielMiddlewareInputValidator,
  companiesInputValidation,
  protectRoute,
  refreshEditMode,
  validateCompanyHeader,
);

export default app;
