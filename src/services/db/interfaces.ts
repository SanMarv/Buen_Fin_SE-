import type { SuportedFormats } from "@images/types";
export interface ImageStoreInput {
  fileName: string;
  user: string;
  file: Buffer;
  format: SuportedFormats;
  hash?: string;
}

export interface ImageDBMetadata {
  user_provided_id?: string;
}
