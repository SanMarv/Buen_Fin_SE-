import type { RequestHandlerWithOwner } from "@backend/types";
import { CompaniesController } from "@db/controllers/companies.controller.js";
import { signJWT, verifyJWT } from "./jwt.middleware.ts";
import { COOKIES_OPTS } from "@config/app.const.js";
import z from "zod";
import { COMPANY_ID_KEY, POST_ID_KEY } from "@backend/const.js";
import { ProductsController } from "@db/controllers/products.controller.js";

const ttlCookieMinutes = 5;
const ttlCookieMilliseconds = ttlCookieMinutes * 60 * 1000;

export const editModePost: RequestHandlerWithOwner = async (req, res) => {
  const { postId } = req.params;
  if (!postId)
    return res.status(404).json({ status: 404, error: "Route not found" });
  const { data: postIdParsed, success: isValidUUID } = z
    .uuidv4()
    .safeParse(postId);
  if (!isValidUUID)
    return res
      .status(400)
      .json({ status: 400, error: "Error processing post id" });
  const { user_id } = res.locals.auth;
  const companyId = res.locals[COMPANY_ID_KEY];
  const { success: isOwner } = await CompaniesController.checkOwner(
    companyId,
    user_id,
  );
  if (!isOwner)
    return res.status(403).json({ status: 403, error: "Prohibited" });
  const { success: isOfCompany, data } = await ProductsController.checkOwner({
    companyId,
    productId: postIdParsed,
  });
  if (!isOfCompany)
    return res.status(403).json({ status: 403, error: "Prohibited" });

  const payload = signJWT(
    { [POST_ID_KEY]: data.id },
    { expiresIn: `${ttlCookieMinutes}m` },
  );
  res.cookie(POST_ID_KEY, payload, {
    ...COOKIES_OPTS,
    maxAge: ttlCookieMilliseconds,
  });
  res.sendStatus(204);
};

export const refreshEditModePost: RequestHandlerWithOwner = async (
  req,
  res,
  next,
) => {
  const jwtToken = req.cookies[POST_ID_KEY];
  if (!jwtToken)
    return res.status(403).json({ status: 403, error: "Prohibited" });
  try {
    const payload = verifyJWT(jwtToken);
    const { postId } = z.object({ [POST_ID_KEY]: z.uuid() }).parse(payload);
    const { user_id } = res.locals.auth;
    const companyId = res.locals[COMPANY_ID_KEY];
    const { success: isOwner } = await CompaniesController.checkOwner(
      companyId,
      user_id,
    );
    if (!isOwner) {
      res.clearCookie(POST_ID_KEY);
      throw new Error("User is not the Owner");
    }
    const { success: isOwnerPost, data } = await ProductsController.checkOwner({
      companyId,
      productId: postId,
    });
    if (!isOwnerPost) {
      res.clearCookie(POST_ID_KEY);
      throw new Error("User is not the Owner");
    }
    const payloadJWT = signJWT({ [POST_ID_KEY]: data.id }, { expiresIn: "2h" });
    res.cookie(POST_ID_KEY, payloadJWT, {
      ...COOKIES_OPTS,
      maxAge: ttlCookieMilliseconds,
    });
    res.locals[POST_ID_KEY] = data.id;
    next();
  } catch (e) {
    console.error(e);
    return res.status(403).json({ status: 403, error: "Prohibited" });
  }
};
