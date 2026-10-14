import type { CaregoriesRecord } from "@db/models/categories.model.js";
import type { products, ProductsRecord } from "@db/models/products.model.js";
import type { ImageRecord } from "@db/models/image.model.js";
import type { ErrorFormat } from "../../types/errors.js";
import type { Result } from "@app/types";
import type { CompaniesRecord } from "@db/models/companies.model.js";
import type { InferSelectModel } from "drizzle-orm";

type GetProductResult = Pick<
  ProductsRecord,
  "id" | "name" | "description" | "price"
> & {
  images: Pick<ImageRecord, "url" | "alt">[];
  categories: Pick<CaregoriesRecord, "name">[];
  company: Pick<CompaniesRecord, "name"> | null;
};

export type GetProductQuery = Promise<Result<GetProductResult[], ErrorFormat>>;
export type GetProductQueryOne = Promise<Result<GetProductResult, ErrorFormat>>;

export interface GetProductInput {
  page: number;
  sort: "asc" | "desc";
  category?: string[];
  company?: string[];
}

export type GetProductByIdInput = Pick<ProductsRecord, "id">;
export type ProductRecord = InferSelectModel<typeof products>;
