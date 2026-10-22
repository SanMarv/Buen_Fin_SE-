import z from "zod";

const ERROR_COMPANY = {
  NOT_PROVIDED: "NOT_PROVIDED",
  NAME_SHORT: "SHORT_NAME",
  RFC: "RFC_ERROR",
  TOO_LARGE: "TOO_LARGE",
};

export const newCompany = z.object({
  name: z.string().min(5).max(30),
  rfc: z.string().trim().toUpperCase().min(12).max(13),
  description: z
    .string(ERROR_COMPANY.NOT_PROVIDED)
    .trim()
    .max(280)
    .optional()
    .default("Sin descripción"),
});
