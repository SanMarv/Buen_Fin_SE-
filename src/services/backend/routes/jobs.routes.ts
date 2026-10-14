import { refreshEditMode } from "@auth/edit.middleware.js";
import { protectRoute } from "@auth/jwt.middleware.js";
import { inputValidationMiddleware } from "@backend/middleware/inputValidation.middleware.js";
import type { RequestWithNewJob } from "@backend/types.js";
import { JobsController } from "@db/controllers/jobs.controller.js";
import { validateJobInput } from "@lib/schemas/job.schema.js";
import { Router } from "express";

const app = Router();

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
export default app;
