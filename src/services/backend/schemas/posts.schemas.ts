import z from "zod"

export const getProduct = z.object({
  page: z.coerce.number().int().min(1).default(1), 
  sort: z.enum(["desc", "asc"]).default("desc"),
  category: z.string()
  .transform((s)=> s.split(",").map((x)=> x.trim()).filter(Boolean))
  .pipe(z.array(z.string().regex(/^cmp_[0-9A-Za-z]{26}$/)))
  .transform((a)=> [...new Set(a)].sort()).optional(),
  company: z.string()
  .transform((s)=> s.split(",").map((x)=> x.trim()).filter(Boolean))
  .pipe(z.array(z.string().regex(/^cmp_[0-9A-Za-z]{26}$/)))
  .transform((a)=> [...new Set(a)].sort()).optional(),

})
