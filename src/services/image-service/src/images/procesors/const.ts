import { config } from "@images/config.js";
import type { ImageDefault } from "@images/intefaces/image.js";
export const DEFAULT_IMAGE = {
  fileName: config.FALBACK_FILENAME,
  format: config.EXPORT_FORMAT,
} satisfies ImageDefault;
