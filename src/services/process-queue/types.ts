import type { ImageObject } from "@images/types.js";
import type { Result } from "@app/types";
import type { Request } from "express";
import type { ImageUpload } from "./images/ImageUpload.js";

export interface TaskImageProcessing {
  image: ImageObject["image"];
  source: {
    url: string;
  };
}
type Resolver<Task, Data> = (
  result: WorkerResultForRequest<Task, Data>,
) => void;
export type TaskWrapper<Task, Data> = {
  task: Task;
  resolver: Resolver<Task, Data>;
};
export type ImageRecordSuccess = NonNullable<
  Awaited<ReturnType<ImageUpload["createRecord"]>>["data"]
>;
export interface TaskImageUpload {
  file: NonNullable<Request["file"]>;
  user_id: string;
}
export type WorkerResult<Task> = Result<null, { error: string; task: Task }>;

export type WorkerResultForRequest<Task, Data> = Result<
  { data: Data },
  { error: string; status: number; task: Task }
>;
