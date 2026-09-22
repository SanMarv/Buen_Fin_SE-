import type { Config } from "@images/intefaces/config.js";

export const config = {
  MAX_IMAGE_SIZE: 5e6, // Bytes
  MIN_IMAGE_QUALITY: 1e6, // Bytes
  EXPORT_FORMAT: "webp",
  FALBACK_FILENAME: "no_name",
} satisfies Config;
