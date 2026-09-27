import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { sendS3Comand } from "../../client.ts";
import { BUCKET_NAMES, type BucketName } from "@bucket/config.js";
import type {
  AvalibleOptionsStreamingOptions,
  DeleteOneObject,
  DeleteOneResult,
  GetOneResult,
  PutOneObjectBase,
  PutOneResult,
  S3Error,
} from "../types.ts";
import { fail, success, type Result } from "@app/types";
import {
  concatBucketPath,
  generatePathKey,
  sendCommandWithResult,
} from "../utils.ts";
import { BucketError } from "../error/BucketError.ts";
import { UnexpectedError } from "../error/UnextedError.ts";

export abstract class BucketBase {
  protected readonly bucket: string;
  public readonly bucket_name: BucketName;
  constructor(bucket_name: BucketName) {
    this.bucket_name = bucket_name;
    this.bucket = BUCKET_NAMES[this.bucket_name];
  }
  public abstract readonly file_type: string;
  protected mimeType(f: string) {
    return `${this.file_type}/${f}`;
  }

  async getOne<T extends AvalibleOptionsStreamingOptions>({
    key,
    format,
  }: {
    key: string;
    format: T;
  }): Promise<GetOneResult<T>> {
    const { success: isFound, error } = await this.isObjectSaved({ key });
    if (!isFound) return fail(error);
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    try {
      const { Body } = await sendS3Comand(command);
      if (!Body) {
        return fail({ error: `No Body return for key ${key}`, status: 404 });
      }
      const status = 200;
      if (format === "bit_array") {
        return success({
          key,
          status,
          data: await Body.transformToByteArray(),
        }) as GetOneResult<T>;
      }
      if (format === "string") {
        return success({
          data: await Body.transformToString(),
          key,
          status,
        }) as GetOneResult<T>;
      }
      return success({
        key,
        status: 200,
        data: Body.transformToWebStream() as ReadableStream,
      }) as GetOneResult<T>;
    } catch (e) {
      if (e instanceof S3ServiceException) {
        const errStatus = e.$metadata.httpStatusCode ?? 500;
        const { message, status } = new BucketError(errStatus);
        return fail({ error: message, status });
      }
      throw e;
    }
  }
  protected async putRaw({
    id,
    body,
    format,
    metatada: paramMetadata = {},
  }: PutOneObjectBase): PutOneResult {
    const metadata = this.getUploadMetadata({ format, id });
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Body: body,
        Key: `${id}.${format}`,
        ContentType: this.mimeType(format),
        Metadata: {
          ...paramMetadata,
          uploadedAt: metadata.uploadedAt.toISOString(),
        },
      });

      const { success: ok, error } = await sendCommandWithResult(command);

      if (!ok) {
        const { error: mss, status, requestId } = error;
        console.error(`Error trying to PutOneObect ${requestId}`);
        return fail({ error: mss, status });
      }

      return success({ id, ...metadata });
    } catch (error) {
      throw new UnexpectedError(`Unexpected Error in PutOne: error ${error}`);
    }
  }
  async deleteOne({ key }: DeleteOneObject): DeleteOneResult {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const { success: isSaved, error: no_found } = await this.isObjectSaved({
        key,
      });
      if (!isSaved) return fail({ ...no_found, key });
      const {
        success: isDeleted,
        data,
        error,
      } = await sendCommandWithResult(command);
      if (isDeleted) return success(data);

      console.error(`${error.requestId}: Error trying to DeleteOne`);
      return fail({ error: error.error, status: error.status, key });
    } catch (e) {
      throw new UnexpectedError(`Unexpected Error in DeleteOne ${e}`);
    }
  }
  async deleteMany(ids: { key: string }[]): Promise<S3Error[]> {
    const map = ids.map(async (key) =>
      this.deleteOne(key).catch(() =>
        fail({
          error: `Unexpected error in key ${key.key}`,
          status: 500,
        }),
      ),
    );
    const resutls = await Promise.all(map);

    const error = resutls.filter((data) => !data.success).map((d) => d.error);
    return error;
  }

  // Helpers
  private getUploadMetadata({ format, id }: { format: string; id: string }) {
    const path = generatePathKey({
      bucket: this.bucket_name,
      format: format,
      key: id,
    });
    const now = new Date();
    const url = concatBucketPath(path);
    return {
      uploadedAt: now,
      path,
      url,
    };
  }
  async isObjectSaved({
    key,
  }: {
    key: string;
  }): Promise<Result<{ status: 200 }, { error: string; status: number }>> {
    const command = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    try {
      await sendS3Comand(command);
      return success({ status: 200 });
    } catch (e) {
      if (e instanceof S3ServiceException) {
        const status = e?.$metadata?.httpStatusCode;
        if (!status)
          throw new UnexpectedError(
            `No status code after sending head command ${e}`,
          );
        if (status !== 200 && status !== 204) {
          const { status: code, message: error } = new BucketError(status);
          return fail({ error, status: code });
        }
      }
      throw new UnexpectedError(`${e}`);
    }
  }
}
