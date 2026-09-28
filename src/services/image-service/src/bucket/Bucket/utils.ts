import { S3ServiceException } from "@aws-sdk/client-s3";
import { sendS3Comand } from "../client.ts";
import { BUCKET_NAMES, BUCKET_OPTIONS, type BucketName } from "../config.ts";
import { fail, success, type Result } from "@app/types";
import { BucketError } from "./error/BucketError.ts";
import { UnexpectedError } from "./error/UnextedError.ts";
type PropsGenerateUrl = {
  bucket: BucketName;
  key: string;
};
export const generatePathKey = ({ bucket, key }: PropsGenerateUrl) =>
  `/${BUCKET_NAMES[bucket]}/${key}`;

export const generateBucketUrl = (param: PropsGenerateUrl) =>
  `${BUCKET_OPTIONS.S3_URL}/${generatePathKey(param)}`;

export const concatBucketPath = (path: string) =>
  `${BUCKET_OPTIONS.S3_URL}/${path}`;

type NormalErrorRequest = {
  error: string;
  status: number;
  requestId?: string;
};
type Command = Parameters<typeof sendS3Comand>[0];
export async function sendCommandWithResult(
  command: unknown,
): Promise<Result<{ status: number }, NormalErrorRequest>> {
  try {
    const res = await sendS3Comand(command as Command);
    return success({ status: res.$metadata.httpStatusCode ?? 200 });
  } catch (e) {
    if (e instanceof S3ServiceException) {
      const errStatus = e?.$metadata?.httpStatusCode ?? 500;
      const { message, status } = new BucketError(errStatus);
      return fail({
        error: message,
        status,
        requestId: e.$metadata.requestId,
      });
    }
    throw new UnexpectedError(`Unexpeted Error ${e}`);
  }
}
