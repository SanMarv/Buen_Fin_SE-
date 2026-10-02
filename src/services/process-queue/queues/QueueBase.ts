import type { WorkerResult } from "../types.ts";
import type { Worker } from "node:worker_threads";

// const WORKER_POOL_SIZE = Number(process.env.WORKER_POOL_SIZE ?? 10) || 10;
export class Queue<Task> {
  public readonly size: number;
  protected createWorker: () => Worker;
  private tasks: Task[] = [];
  private freeWorkers: Worker[] = [];
  private init() {
    for (let i = 0; i < this.size; i++) {
      const worker = this.createWorker();
      worker.on("message", ({ success, error }: WorkerResult<Task>) => {
        console.log(
          `image-worker-${worker.threadId} finish with status ${Number(!success)}`,
        );
        console.timeEnd(`image-worker-${worker.threadId}`);
        if (!success) {
          console.error(error.error);
          this.enqueue(error.task);
        }
        this.handleEnd(worker);
      });
      this.freeWorkers.push(worker);
    }
  }
  constructor({
    size,
    createWorker,
  }: {
    size: number;
    createWorker: () => Worker;
  }) {
    this.size = size;
    this.createWorker = createWorker;
    this.init();
  }
  enqueue(task: Task) {
    if (this.freeWorkers.length > 0) {
      this.runTask(this.freeWorkers.pop()!, task);
    } else {
      this.tasks.push(task);
    }
  }
  private runTask(worker: Worker, task: Task) {
    console.log(`image-worker-${worker.threadId} pick task`);
    console.time(`image-worker-${worker.threadId}`);
    worker.postMessage(task);
  }
  private handleEnd(worker: Worker) {
    if (this.tasks.length > 0) {
      this.runTask(worker, this.tasks.shift()!);
    } else {
      this.freeWorkers.push(worker);
    }
  }
}
