import { Router } from "express";
import { validateInputFile } from "../middleware/profiles.middleware.ts";
import { parseProfileHeader } from "@auth/headers.middleware.js";
import { CompaniesController } from "@db/controllers/companies.controller.js";
import type { RequestWithCompanyId } from "@backend/types.js";
import { profilesQueue } from "../queues/ProfilesProcessing.ts";
import type { TaskProfile } from "../types.ts";
import { profileBucket, UploadProfile } from "@images-service";

const router = Router();

router.put(
  "/",
  parseProfileHeader,
  validateInputFile,
  async (_, res: RequestWithCompanyId) => {
    const image = res.locals.image as Buffer | null;
    // we check in middleware for valid company
    const { companyId } = res.locals.auth;
    const {
      success: isInDb,
      data: companyDB,
      error: dbQuerryError,
    } = await CompaniesController.getBasicData(companyId);
    if (!isInDb) {
      console.error(dbQuerryError);
      return res
        .status(500)
        .json({ status: 500, error: "Unexpeted error in request" });
    }
    const newImage: TaskProfile["newImage"] = {
      user: {
        id: companyDB.id,
        name: companyDB.name,
      },
      image,
    };
    const {
      success: isCreated,
      data,
      error: errorInQueue,
    } = await profilesQueue.enqueue({
      newImage,
      oldImage: companyDB.profile_picture,
    });
    if (!isCreated) return res.status(errorInQueue.status).json(errorInQueue);
    const {
      data: { newUrl: url },
    } = data;
    const {
      status,
      success: isChanged,
      error,
    } = await CompaniesController.updateProfile({
      companyId,
      url,
    });
    if (isChanged) return res.json({ url });
    console.error(error);
    res.status(status).json({ status, error: "Something unexpected happend" });
  },
);
router.delete(
  "/",
  parseProfileHeader,
  validateInputFile,
  async (_, res: RequestWithCompanyId) => {
    const { companyId } = res.locals.auth;
    const {
      success: isInDb,
      data: companyDB,
      error: dbQuerryError,
    } = await CompaniesController.getBasicData(companyId);
    if (!isInDb) {
      console.error(dbQuerryError);
      return res
        .status(500)
        .json({ status: 500, error: "Unexpeted error in request" });
    }
    const {
      success: isUploaded,
      data,
      error: errorUpload,
    } = await UploadProfile({
      user: { id: companyDB.id, name: companyDB.name },
    });
    if (!isUploaded) return res.status(errorUpload.status).json(errorUpload);
    if (data.url !== companyDB.profile_picture)
      await profileBucket.deleteOne({
        key: companyDB.profile_picture.split("/").pop()!,
      });
    const { status, success, error } = await CompaniesController.updateProfile({
      companyId,
      url: data.url,
    });
    if (!success) return res.status(status).json(error);
    return res.sendStatus(status);
  },
);
export default router;
