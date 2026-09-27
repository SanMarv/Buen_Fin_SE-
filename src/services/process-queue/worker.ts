import { Bucket } from "./bucket.ts";
import type { ImageProcesor } from "@images/types";
interface Props {
  imageProcesor: ImageProcesor;
}

async function processImage({ imageProcesor }: Props) {
  const { image } = await imageProcesor.optimize();

  // Uploading image
  const { success, data, error } = await Bucket.putOne({
    body: image.file,
    format: image.format,
    id: image.fileName,
  });

  if (!success) {
    console.error(error);
    return;
  }
  const { url, uploadedAt } = data;
}
