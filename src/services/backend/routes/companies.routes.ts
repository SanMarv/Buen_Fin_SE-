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
import { satValidation } from "@auth/satValidation.middleware.js";
import type { Request, Response } from "express";

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

app.put(
  "/validate",
  refreshEditMode,
  fielMiddlewareInputValidator,
  satValidation,
  async (req: Request, res: Response) => {
    const { companyId, validation } = res.locals;

    const { company_id } = companyId;
    const { validation_id } = validation;

    const { success, error } = await CompaniesController.updateValidation(
      company_id,
      validation_id,
    );

    if (!success) {
      return res.status(error.status).json(error);
    }

    return res.sendStatus(201);
  },
);

export default app;
