import type { RequestHandlerWithValidInfo } from "@backend/types";
import { CompaniesController } from "@db/controllers/companies.controller.js";
import { signJWT, verifyJWT } from "./jwt.middleware.ts";
import { COOKIES_OPTS } from "@config/app.const.js";
import z from "zod";

const ttlCookieHours = 2;
const ttlCookieMilliseconds = ttlCookieHours * 60 * 60 * 1000;
const COOKIE_ID = "companyId";

export const editModePost: RequestHandlerWithValidInfo = async (req, res) => {
  const { companyId } = req.params;
  if (companyId)
    return res.status(404).json({ status: 404, error: "Route not found" });
  const { user_id } = res.locals.auth;
  const { success: isOwner, data } = await CompaniesController.checkOwner(
    companyId,
    user_id,
  );
  if (!isOwner)
    return res.status(403).json({ status: 403, error: "Prohibited" });
  const payload = signJWT({ [COOKIE_ID]: data.id }, { expiresIn: "2h" });
  res.cookie(COOKIE_ID, payload, {
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
  const jwtToken = req.cookies[COOKIE_ID];
  if (!jwtToken)
    return res.status(403).json({ status: 403, error: "Prohibited" });
  try {
    const payload = verifyJWT(jwtToken);
    const { companyId } = z.object({ [COOKIE_ID]: z.string() }).parse(payload);
    const { user_id } = res.locals.auth;
    const { success: isOwner, data } = await CompaniesController.checkOwner(
      companyId,
      user_id,
    );
    if (!isOwner) {
      res.clearCookie(COOKIE_ID);
      throw new Error("User is not the Owner");
    }
    const payloadJWT = signJWT({ [COOKIE_ID]: data.id }, { expiresIn: "2h" });
    res.cookie(COOKIE_ID, payloadJWT, {
      ...COOKIES_OPTS,
      maxAge: ttlCookieMilliseconds,
    });
    res.locals[COOKIE_ID] = data.id;
    next();
  } catch {
    return res.status(403).json({ status: 403, error: "Prohibited" });
  }
};
