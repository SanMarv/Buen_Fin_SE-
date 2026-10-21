import { editModeCompany, refreshEditMode } from "@auth/edit.middleware.js";
import { validateCompanyHeader } from "@auth/headers.middleware.js";
import { protectRoute } from "@auth/jwt.middleware.js";
import { protectWithValidation } from "@auth/validation.middleware.js";
import { getUsersCompanies } from "@backend/middleware/companies.middleware.js";
import { fielMiddlewareInputValidator } from "@backend/middleware/fielMulter.middleware.js";
import {
  companiesInputValidation,
  updateCompany,
} from "@backend/schemas/company.schema.js";
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
  const companie_data = { ...companie, user_id: res.locals.auth.user_id };
  const { success, data, error } =
    await CompaniesController.create(companie_data);
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
    const { validation_id, rfc } = validation;

    const { success, error } = await CompaniesController.updateValidation(
      companyId,
      validation_id,
      rfc,
    );

    if (!success) {
      return res.status(error.status).json(error);
    }

    return res.sendStatus(201);
  },
);

app.get("edit/:companyId", protectRoute, editModeCompany);

app.put(
  "edit/:companyId",
  protectRoute,
  refreshEditMode,
  async (req: Request, res: Response) => {
    const { data, success: safe } = updateCompany.safeParse(req.body);
    if (!safe) {
      return res
        .status(400)
        .json({ status: 400, error: "No company fields edited" });
    }

    const { companyId } = res.locals;

    const { success, error } = await CompaniesController.updateCompany(
      data.name,
      companyId,
    );

    if (!success) {
      return res.status(error.status).json(error);
    }

    res.sendStatus(201);
  },
);

app.delete(
  "delete/:companyId",
  protectRoute,
  refreshEditMode,
  async (req: Request, res: Response) => {
    const { companyId } = res.locals;

    const { success, error } =
      await CompaniesController.deleteCompany(companyId);
    if (!success) {
      return res.status(error.status).json(error);
    }

    res.sendStatus(204);
  },
);

export default app;
