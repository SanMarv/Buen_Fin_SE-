import z from "zod";
import { LOCATION_ERRORS, validateInputLocation } from "./locations.schema.js";

export const ERROS_JOB_INPUT = {
  ...LOCATION_ERRORS,
  NOT_PROVIDED: "NOT_PROVIDED",
  MAX_LENGTH: "MAX_LENGTH",
  LINK: "ERROR_LINK",
};

export const validateJobInput = z.object({
  name: z
    .string(ERROS_JOB_INPUT.NOT_PROVIDED)
    .max(40, ERROS_JOB_INPUT.MAX_LENGTH)
    .min(1, ERROS_JOB_INPUT.NOT_PROVIDED),
  description: z
    .string(ERROS_JOB_INPUT.NOT_PROVIDED)
    .min(1, ERROS_JOB_INPUT.NOT_PROVIDED)
    .max(400, ERROS_JOB_INPUT.MAX_LENGTH),
  link: z.url(ERROS_JOB_INPUT.LINK),
  location: validateInputLocation,
});

export type NewJob = z.infer<typeof validateJobInput>;
