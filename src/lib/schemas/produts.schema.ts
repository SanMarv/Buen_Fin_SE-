import z from "zod";
import { CATEGORIES,type Category } from "../types/categories.js";

export const PRODUCT_CREATE_ERROS = {
  not_provided: "NOT_PROVIDED",
  new_price_bigger: "NEW_PRICE_BIGGER",
  metadata: "FORM_ERROR_METADATA"
}
const filterNonCategories = (str: string): str is Category => z.enum(CATEGORIES).safeParse(str).success
export const createProductSchema = z.object({
  name: z.string(PRODUCT_CREATE_ERROS.not_provided).min(1).max(200),
  description: z.string(PRODUCT_CREATE_ERROS.not_provided).min(1).max(280),
  price: z.number(PRODUCT_CREATE_ERROS.not_provided).min(1),
  newPrice: z.number(PRODUCT_CREATE_ERROS.not_provided).min(1),
  categories: z.string().array().transform<Category[]>(val => val.filter<Category>(filterNonCategories)).default([]),
  metadata: z.record(
    z.string(PRODUCT_CREATE_ERROS.not_provided),
    z.union([z.string().max(50), z.number().max(1_000_000_000)], PRODUCT_CREATE_ERROS.metadata), PRODUCT_CREATE_ERROS.metadata
  ).default({})
}).refine(({newPrice, price}) => newPrice <= price,PRODUCT_CREATE_ERROS.new_price_bigger)

export type NewProduct = z.infer<typeof createProductSchema>
