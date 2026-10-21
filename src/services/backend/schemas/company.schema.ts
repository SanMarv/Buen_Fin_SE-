import { inputValidationMiddleware } from "@backend/middleware/inputValidation.middleware.js";
import { Rfc } from "@nodecfdi/rfc";
import z from "zod";

export const createCompanie = z.object({
  name: z.string().min(5).max(30),
  rfc: z
    .string()
    .trim()
    .toUpperCase()
    .min(12)
    .max(13)
    .refine((inp) => Rfc.isValid(inp)),
});

export const updateCompany = z.object({
  name: z.string(),
});

export type CompanieInput = z.infer<typeof createCompanie> & {
  user_id: string;
};
export const companiesInputValidation = inputValidationMiddleware(
  createCompanie,
  "companie",
);
