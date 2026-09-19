import { S3Client } from "@aws-sdk/client-s3";
import { S3_CLIENT_PARAMS } from "./config";

export const clientS3 = new S3Client(S3_CLIENT_PARAMS);

export const sendS3Comand = clientS3.send.bind(clientS3);
