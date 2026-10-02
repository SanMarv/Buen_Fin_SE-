import { fail, success } from "@app/types";
import type {
  TaskImageUpload,
  ImageRecordSuccess,
  WorkerResultForRequest,
} from "../types.js";
import { ImageUpload } from "../images/ImageUpload.js";
import { imageProcessQueue } from "../queues/ImageProcessQueue.ts";
import { parentPort } from "node:worker_threads";

async function processing(
  task: TaskImageUpload,
): Promise<WorkerResultForRequest<TaskImageUpload, ImageRecordSuccess>> {
  const imageUploader = new ImageUpload(task);
  await imageUploader.process();

  const { success: isUploaded, error: errorUpload } =
    await imageUploader.uploadToBucket();

  if (!isUploaded)
    return fail({ error: errorUpload.error, status: errorUpload.status, task });

  const {
    success: isCreated,
    data: record,
    error: errorRecord,
  } = await imageUploader.createRecord();

  if (!isCreated) {
    await imageUploader.deleteFromBucket();
    return fail({ error: errorRecord.error, status: errorRecord.status, task });
  }
  imageProcessQueue.enqueue({
    image: imageUploader.image!,
    source: { url: record.url },
  });
  return success({ data: record });
}

parentPort?.on("message", async (task: TaskImageUpload) => {
  const result = await processing(task);
  parentPort?.postMessage(result);
});
