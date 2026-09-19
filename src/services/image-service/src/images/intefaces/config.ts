import type { SuportedFormats } from "./image";

export interface Config {
  MAX_IMAGE_SIZE: number;
  MIN_IMAGE_QUALITY: number;
  EXPORT_FORMAT: SuportedFormats;
  FALBACK_FILENAME: string;
}
