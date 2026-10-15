import { inputValidationMiddleware } from "@backend/middleware/inputValidation.middleware.js";
import { Rfc } from "@nodecfdi/rfc";
import z from "zod";

export const createCompanie = z.object({
  name: z.string().min(5).max(30),
  user_id: z.uuidv7(),
  rfc: z
    .string()
    .min(12)
    .max(13)
    .refine((inp) => Rfc.isValid(inp)),
  validation_id: z.uuidv4().optional(),
});

export type CompanieInput = z.infer<typeof createCompanie>;
export const companiesInputValidation = inputValidationMiddleware(
  createCompanie,
  "companie",
);
