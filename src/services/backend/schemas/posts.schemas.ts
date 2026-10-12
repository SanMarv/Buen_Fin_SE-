import z from "zod"

export const getProduct = z.object({
  page: z.coerce.number().int().min(1).default(1), 
  sort: z.enum(["desc", "asc"]).default("desc"),
  category: z.string()
  .transform((s)=> s.split(",").map((x)=> x.trim()).filter(Boolean))
  .pipe(z.array(z.string()))
  .transform((a)=> [...new Set(a)].sort()).optional(),
  company: z.string()
  .transform((s)=> s.split(",").map((x)=> x.trim()).filter(Boolean))
  .pipe(z.array(z.string()))
  .transform((a)=> [...new Set(a)].sort()).optional(),

})

export const getJobs = z.object({
  page: z.coerce.number().int().min(1).default(1), 
  sort: z.enum(["desc", "asc"]).default("desc"),
  company: z.string()
})

export const gerPostIdSchema = z.object({
  id: z.uuid(),  
})
