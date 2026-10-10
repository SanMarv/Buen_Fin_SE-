import { UploadProfile } from "@images-service";
import type { TaskProfile, WorkerProfile } from "../types.ts";
import { parentPort } from "node:worker_threads";
import { profileBucket } from "@images-service";
import { fail, success } from "@app/types";

async function process(task: TaskProfile): Promise<WorkerProfile> {
  const {
    success: isUploaded,
    data,
    error,
  } = await UploadProfile(task.newImage);
  if (!isUploaded)
    return fail({
      error: error.error,
      status: error.status,
      task,
    });
  if (data.url !== task.oldImage && task.oldImage) {
    const { success: isDeleted, error } = await profileBucket.deleteOne({
      key: task.oldImage.split("/").pop()!,
    });
    if (!isDeleted) console.error(error);
  }
  return success({ data: { newUrl: data.url } });
}
parentPort?.on("message", async (task: TaskProfile) => {
  parentPort?.postMessage(await process(task));
});
