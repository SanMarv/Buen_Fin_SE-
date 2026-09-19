import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { sendCommandWithResult } from "./Bucket/utils";
import { BUCKET_NAMES } from "./config";
import { BucketError } from "./Bucket/error/BucketError";

async function validateBucket(bucket: string) {
  const command = new HeadBucketCommand({ Bucket: bucket });
  const { success: isFound, error } = await sendCommandWithResult(command);
  if (!isFound) {
    console.error(`Error validation the bucket ${bucket} does it exits?`);
    throw new BucketError(error.status);
  }
}

const BUCKETS = Object.values(BUCKET_NAMES).map((bucket) =>
  validateBucket(bucket),
);

export const validateBuckets = async () => await Promise.all(BUCKETS);
