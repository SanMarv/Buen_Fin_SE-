import { refreshEditMode } from "@auth/edit.middleware.js";
import {
  editModeJobs,
  refreshEditModeJobs,
} from "@auth/editJobs.middleware.js";
import { protectRoute } from "@auth/jwt.middleware.js";
import { COMPANY_ID_KEY, JOB_ID_KEY } from "@backend/const.js";
import { inputValidationMiddleware } from "@backend/middleware/inputValidation.middleware.js";
import {
  checkRequestParameter,
  checkVisibility,
  type RequestWithVisibilty,
} from "@backend/schemas/app.schema.js";
import type { RequestWithNewJob, RequestWithOwner } from "@backend/types.js";
import { JobsController } from "@db/controllers/jobs.controller.js";
import { validateJobInput } from "@lib/schemas/job.schema.js";
import { Router } from "express";

const app = Router();

app.get(`/edit/:${JOB_ID_KEY}`, protectRoute, refreshEditMode, editModeJobs);

app.put(
  `/visibility/:${JOB_ID_KEY}`,
  protectRoute,
  refreshEditMode,
  refreshEditModeJobs,
  inputValidationMiddleware(checkVisibility, "newVisibility"),
  async (req, res: RequestWithVisibilty<"newVisibility", RequestWithOwner>) => {
    const { success: isValidId, data: jobId } = checkRequestParameter(
      JOB_ID_KEY,
      req.params,
    );
    if (!isValidId)
      return res.status(400).json({ error: "Bad format in id", status: 400 });
    const { visibility } = res.locals.newVisibility;
    const companyId = res.locals[COMPANY_ID_KEY];
    const { status, success, error } = await JobsController.updateVisibility({
      companyId,
      jobId,
      visibility,
    });
    if (!success) console.error(error);
    return res.sendStatus(status);
  },
);

app.post(
  "/",
  inputValidationMiddleware(validateJobInput, "newJob"),
  protectRoute,
  refreshEditMode,
  async (_, res: RequestWithNewJob) => {
    const { companyId, newJob } = res.locals;
    const { status, success, error } = await JobsController.newJob({
      companyId,
      name: newJob.name,
      description: newJob.description,
      location: newJob.location,
    });
    if (!success) console.error(error);
    return res.sendStatus(status);
  },
);

app.delete(
  `/:${JOB_ID_KEY}`,
  protectRoute,
  refreshEditMode,
  async (req, res: RequestWithOwner) => {
    const { success: isValidId, data: jobId } = checkRequestParameter(
      JOB_ID_KEY,
      req.params,
    );
    if (!isValidId) return res.sendStatus(403);
    const companyId = res.locals[COMPANY_ID_KEY];
    const { status, success, error } = await JobsController.deleteJob({
      companyId,
      jobId,
    });
    if (!success) console.error(error);
    return res.sendStatus(status);
  },
);
export default app;
