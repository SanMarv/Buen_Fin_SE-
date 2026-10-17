import z from "zod";
import { Router, type Request } from "express";

import { signHeader } from "@auth/headers.middleware.js";
import { protectRoute } from "@auth/jwt.middleware.js";
import type { RequestWithImageOwner } from "@backend/types.js";
import { ImageController } from "@db/controllers/images.controller.js";

import { success, fail, type Result } from "@app/types";
import { VISIBILITY } from "@db/enums.js";
import { BUCKET_NAMES } from "@bucket/config.js";
const BUCKET_NAME = BUCKET_NAMES["IMAGES"];

const app = Router();
const parseRequestPathBucket = (
  req: Request,
): Result<{ key: string; bucket: string }, null> => {
  const result = z
    .object({
      bucket: z.string().min(1).max(100),
      key: z.string().min(1).max(100),
    })
    .safeParse(req.params);
  if (!result.success) return fail(null);
  return success({ key: result.data.key, bucket: result.data.bucket });
};

app.get("/upload", protectRoute, signHeader);

app.get(
  "/:bucket/:key",
  async (req, res, next) => {
    const { success: isValid, data } = parseRequestPathBucket(req);
    if (!isValid) return res.sendStatus(401);
    const { key, bucket } = data;
    // Check if is profile picture
    if (bucket === BUCKET_NAMES["PROFILES"]) return res.sendStatus(200);
    const {
      success: querryDB,
      data: record,
      error,
    } = await ImageController.checkVisibility({ bucket, key });
    if (!querryDB) return res.status(401).json(error);
    const { visibility, user_id } = record;
    if (visibility === "PUBLIC") return res.sendStatus(200);
    res.locals.imageOwner = user_id;
    next();
  },
  protectRoute,
  (_, res: RequestWithImageOwner) => {
    const { user_id } = res.locals.auth;
    const { imageOwner } = res.locals;
    return res.sendStatus(user_id === imageOwner ? 200 : 403);
  },
);

app.put("/:bucket/:key", protectRoute, async (req, res) => {
  const { success: isValid, data: path } = parseRequestPathBucket(req);
  if (!isValid) return res.sendStatus(401);
  const { success: isValidChange, data } = z
    .object({ visibility: z.enum([VISIBILITY.private, VISIBILITY.public]) })
    .safeParse(req.body);
  if (!isValidChange) return res.sendStatus(401);
  const { key, bucket } = path;
  const { user_id } = res.locals.auth;
  const {
    success: isUpdated,
    data: changes,
    error,
  } = await ImageController.updateVisibility({
    bucket,
    key,
    user_id,
    visibility: data.visibility,
  });
  if (isUpdated) return res.json(changes);
  return res.status(error.status).json(error);
});

app.delete("/:bucket/:key", protectRoute, async (req, res) => {
  // check for valid bucket format
  const { success: isValid, data: path } = parseRequestPathBucket(req);
  if (!isValid) return res.sendStatus(401);
  // value path in db
  const { key, bucket } = path;
  const {
    success: isFound,
    error,
    data: record,
  } = await ImageController.checkVisibility({ bucket: BUCKET_NAME, key });
  if (!isFound) return res.status(404).json(error);
  // check owner
  const { user_id } = record;
  if (res.locals.auth.user_id !== user_id) return res.sendStatus(403);

  // deleting value
  const { success: isDeleted } = await ImageController.deleteImage({
    bucket,
    key,
    user_id,
  });
  return res.sendStatus(isDeleted ? 204 : 500);
});
export default app;
