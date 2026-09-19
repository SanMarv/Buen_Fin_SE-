import type { ImageObject, ImageWithHash } from "@images/outputs/index.js";

export type OptimeResult = Promise<ImageWithHash>;
export type OptimeNoHashResult = Promise<ImageObject>;
export interface ImageProcesor {
  optimize(): OptimeResult;
  raw(): OptimeNoHashResult;
  optimizeNoHash(): OptimeNoHashResult;
}
