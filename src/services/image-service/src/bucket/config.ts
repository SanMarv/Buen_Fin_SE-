import { z } from "zod";
import type { S3ClientConfig } from "@aws-sdk/client-s3";

const DEFAULT_RUSTFS_REGION = "us-east-1";
const DEFAULT_BUCKET_NAME = "buen-fin-images";
const DEFAULT_BUCKET_PROFILES = "buen-fin-profiles";

const BucketConfigSchema = z.object({
  S3_REGION: z.string().default(DEFAULT_RUSTFS_REGION),
  S3_URL: process.env.NODE_ENV === "production" ? z.httpUrl() : z.url(),
  S3_ACCESS_KEY: z.string(),
  S3_PRIVATE_KEY: z.string(),
  isPathStyle: z.stringbool().default(true),
  BUCKET_IMAGES: z.string().optional().default(DEFAULT_BUCKET_NAME),
  BUCKET_PROFILES: z.string().optional().default(DEFAULT_BUCKET_PROFILES),
});

export const BUCKET_OPTIONS = BucketConfigSchema.parse(process.env);
export const S3_CLIENT_PARAMS: S3ClientConfig = {
  region: BUCKET_OPTIONS.S3_REGION,
  endpoint: BUCKET_OPTIONS.S3_URL,
  credentials: {
    accessKeyId: BUCKET_OPTIONS.S3_ACCESS_KEY,
    secretAccessKey: BUCKET_OPTIONS.S3_PRIVATE_KEY,
  },
  forcePathStyle: BUCKET_OPTIONS.isPathStyle,
};

export const BUCKET_NAMES = {
  IMAGES: BUCKET_OPTIONS["BUCKET_IMAGES"],
  PROFILES: BUCKET_OPTIONS["BUCKET_PROFILES"],
} as const;
type BucketNames = typeof BUCKET_NAMES;
export type BucketName = keyof BucketNames;

export const BUCKET_ENDPOINT = z
  .url()
  .optional()
  .default(BUCKET_OPTIONS.S3_URL)
  .parse(process.env.BUCKET_ENDPOINT);
