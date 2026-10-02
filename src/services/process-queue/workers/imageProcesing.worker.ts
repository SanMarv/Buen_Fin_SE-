import { fail, type PromiseResult, success } from "@app/types";
import { Bucket } from "../bucket.ts";
import { ImageController } from "@db/controllers/images.controller.js";
import { parentPort } from "node:worker_threads";
import type { TaskImageProcessing, WorkerResult } from "../types.ts";
import { ImageProcessorFactory } from "@images-service";

type SuccessMove = {
  url: string;
};
type ErrorMove = {
  cleanup: () => Promise<void>;
  task: TaskImageProcessing;
  error: string;
};
async function imageDelete(key: string) {
  // Delete prev async
  return Bucket.deleteOne({ key })
    .then(({ success, error }) => !success && console.error(error))
    .catch((e) => console.error(e));
}
async function processImage(
  task: TaskImageProcessing,
): PromiseResult<SuccessMove, ErrorMove> {
  const {
    image: imageSource,
    source: { url },
  } = task;
  const imageProcessor = await ImageProcessorFactory(imageSource.file, {
    fileName: imageSource.id,
  });
  const { image } = await imageProcessor.optimize();
  // Uploading image
  const {
    success: isUploaded,
    data: bucketData,
    error: bucketError,
  } = await Bucket.putOne({
    body: image.file,
    format: image.format,
    id: image.id,
  });

  if (!isUploaded) {
    return fail({ error: bucketError.error, cleanup: async () => {}, task });
  }

  const { path, uploadedAt } = bucketData;

  const { success: isSavedDB, error } = await ImageController.move([
    { url },
    { url: path, hash: image.hash, metadata: { uploadedAt } },
  ]);
  if (isSavedDB) {
    imageDelete(imageSource.fileName).catch((e) => console.error(e));
    return success({
      url: path,
    });
  }
  return fail({
    error,
    task,
    cleanup: async () => {
      await imageDelete(image.fileName);
    },
  });
}

parentPort?.on("message", async (param: TaskImageProcessing) => {
  if (!parentPort || parentPort === null)
    throw new Error("Worker Current comuncate with parrent");
  const { success: processSuccess, error } = await processImage(param);
  if (processSuccess) {
    parentPort.postMessage(success(null));
    return;
  }
  const { cleanup, ...mess } = error;
  await cleanup();
  parentPort.postMessage(
    fail<NonNullable<WorkerResult<TaskImageProcessing>["error"]>>(mess),
  );
});
