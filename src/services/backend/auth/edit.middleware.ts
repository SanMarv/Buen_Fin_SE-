import type { RequestHandlerWithValidInfo } from "@backend/types";
import { CompaniesController } from "@db/controllers/companies.controller.js";
import { signJWT, verifyJWT } from "./jwt.middleware.ts";
import { COOKIES_OPTS } from "@config/app.const.js";
import z from "zod";
import { COMPANY_ID_KEY } from "@backend/const.js";

const ttlCookieHours = 2;
const ttlCookieMilliseconds = ttlCookieHours * 60 * 60 * 1000;

export const editModeCompany: RequestHandlerWithValidInfo = async (
  req,
  res,
) => {
  const { companyId: companyIdParam } = req.params;
  if (!companyIdParam)
    return res.status(404).json({ status: 404, error: "Route not found" });
  const { data: companyId, success: isValidUUID } = z
    .uuidv4()
    .safeParse(companyIdParam);
  if (!isValidUUID)
    return res
      .status(400)
      .json({ status: 400, error: "Error processing companyId" });
  const { user_id } = res.locals.auth;
  const { success: isOwner, data } = await CompaniesController.checkOwner(
    companyId,
    user_id,
  );
  if (!isOwner)
    return res.status(403).json({ status: 403, error: "Prohibited" });
  const payload = signJWT({ [COMPANY_ID_KEY]: data.id }, { expiresIn: "2h" });
  res.cookie(COMPANY_ID_KEY, payload, {
    ...COOKIES_OPTS,
    maxAge: ttlCookieMilliseconds,
  });
  res.sendStatus(204);
};

export const refreshEditMode: RequestHandlerWithValidInfo = async (
  req,
  res,
  next,
) => {
  const jwtToken = req.cookies[COMPANY_ID_KEY];
  if (!jwtToken)
    return res.status(403).json({ status: 403, error: "Prohibited" });
  try {
    const payload = verifyJWT(jwtToken);
    const { companyId } = z
      .object({ [COMPANY_ID_KEY]: z.uuid() })
      .parse(payload);
    const { user_id } = res.locals.auth;
    const { success: isOwner, data } = await CompaniesController.checkOwner(
      companyId,
      user_id,
    );
    if (!isOwner) {
      res.clearCookie(COMPANY_ID_KEY);
      throw new Error("User is not the Owner");
    }
    const payloadJWT = signJWT(
      { [COMPANY_ID_KEY]: data.id },
      { expiresIn: "2h" },
    );
    res.cookie(COMPANY_ID_KEY, payloadJWT, {
      ...COOKIES_OPTS,
      maxAge: ttlCookieMilliseconds,
    });
    res.locals[COMPANY_ID_KEY] = data.id;
    next();
  } catch (e) {
    console.error(e);
    return res.status(403).json({ status: 403, error: "Prohibited" });
  }
};
