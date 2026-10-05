import { type PromiseResult, success, fail } from "@app/types";
import { profileBucket } from "@images-service";
import { ProfileImage } from "./Image.ts";

type Success = {
  url: string;
};
type Error = {
  error: string;
  status: number;
};
export async function UploadProfile(
  ...args: ConstructorParameters<typeof ProfileImage>
): PromiseResult<Success, Error> {
  const processor = new ProfileImage(...args);
  const { file: body, filename, format } = await processor.process();
  const {
    success: isUploaded,
    data,
    error,
  } = await profileBucket.putOne({
    body,
    formatId: false,
    id: filename,
    format,
  });
  if (!isUploaded) return fail(error);
  return success({ url: data.url });
}
