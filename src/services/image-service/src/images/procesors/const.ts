import { config } from "@images/config";
import type { ImageDefault } from "@images/intefaces/image";
export const DEFAULT_IMAGE = {
  fileName: config.FALBACK_FILENAME,
  format: config.EXPORT_FORMAT,
} satisfies ImageDefault;
