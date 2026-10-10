import { validateCompanyHeader } from "@auth/headers.middleware.js";
import { protectRoute } from "@auth/jwt.middleware.js";
import { protectWithValidation } from "@auth/validation.middleware.js";
import { companiesInputValidation } from "@backend/schemas/company.schema.js";
import type { RequestWithCompany } from "@backend/types.js";
import { CompaniesController } from "@db/controllers/companies.controller.js";
import { Router } from "express";

const app = Router();

app.post(
  "/",
  companiesInputValidation,
  protectRoute,
  protectWithValidation,
  async (_, res: RequestWithCompany) => {
    const { companie } = res.locals;
    const { success, data, error } = await CompaniesController.create(companie);
    if (!success) return res.status(error.status).json(error);
    return res.json(data);
  },
);

app.get("/profile-validate", protectRoute, validateCompanyHeader);

export default app;
