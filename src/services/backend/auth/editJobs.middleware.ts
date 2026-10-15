import type { RequestHandlerWithOwner } from "@backend/types";
import z from "zod";
import { signJWT, verifyJWT } from "./jwt.middleware.ts";

import { COOKIES_OPTS } from "@config/app.const.js";
import { COMPANY_ID_KEY, JOB_ID_KEY } from "@backend/const.js";
import { checkRequestParameter } from "@backend/schemas/app.schema.js";

import { CompaniesController } from "@db/controllers/companies.controller.js";
import { JobsController } from "@db/controllers/jobs.controller.js";

const ttlCookieMinutes = 5;
const ttlCookieMilliseconds = ttlCookieMinutes * 60 * 1000;

export const editModeJobs: RequestHandlerWithOwner = async (req, res) => {
  const { success: isValidJob, data: jobId } = checkRequestParameter(
    JOB_ID_KEY,
    req.params,
  );
  if (!isValidJob)
    return res.status(404).json({ status: 404, error: "Route not found" });
  // check for the company
  const companyId = res.locals[COMPANY_ID_KEY];
  const { success: isOfCompany, data } = await JobsController.checkOwner({
    [COMPANY_ID_KEY]: companyId,
    [JOB_ID_KEY]: jobId,
  });
  if (!isOfCompany)
    return res.status(403).json({ status: 403, error: "Prohibited" });

  const payload = signJWT(
    { [JOB_ID_KEY]: data[JOB_ID_KEY] },
    { expiresIn: `${ttlCookieMinutes}m` },
  );
  res.cookie(JOB_ID_KEY, payload, {
    ...COOKIES_OPTS,
    maxAge: ttlCookieMilliseconds,
  });
  res.sendStatus(204);
};

export const refreshEditModeJobs: RequestHandlerWithOwner = async (
  req,
  res,
  next,
) => {
  const jwtToken = req.cookies[JOB_ID_KEY];
  if (!jwtToken)
    return res.status(403).json({ status: 403, error: "Prohibited" });
  try {
    const payload = verifyJWT(jwtToken);
    const jobId = z.object({ [JOB_ID_KEY]: z.uuid() }).parse(payload)[
      JOB_ID_KEY
    ];
    const { user_id } = res.locals.auth;
    const companyId = res.locals[COMPANY_ID_KEY];
    const { success: isOwner } = await CompaniesController.checkOwner(
      companyId,
      user_id,
    );
    if (!isOwner) {
      res.clearCookie(JOB_ID_KEY);
      throw new Error("User is not the Owner");
    }
    const { success: isOwnerPost, data } = await JobsController.checkOwner({
      companyId,
      [JOB_ID_KEY]: jobId,
    });
    if (!isOwnerPost) {
      res.clearCookie(JOB_ID_KEY);
      throw new Error("User is not the Owner");
    }
    const payloadJWT = signJWT(
      { [JOB_ID_KEY]: data[JOB_ID_KEY] },
      { expiresIn: "2h" },
    );
    res.cookie(JOB_ID_KEY, payloadJWT, {
      ...COOKIES_OPTS,
      maxAge: ttlCookieMilliseconds,
    });
    res.locals[JOB_ID_KEY] = data[JOB_ID_KEY];
    next();
  } catch (e) {
    console.error(e);
    return res.status(403).json({ status: 403, error: "Prohibited" });
  }
};
