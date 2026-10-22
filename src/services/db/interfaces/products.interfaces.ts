import type { products, ProductsRecord } from "@db/models/products.model.js";
import type { ErrorFormat } from "../../types/errors.js";
import type { Result } from "@app/types";
import type { InferSelectModel } from "drizzle-orm";
import type { ProductPageItem } from "@lib/types/index.js";

export type ProductRecord = InferSelectModel<typeof products>;

export type GetProductQuery = Promise<Result<ProductPageItem[], ErrorFormat>>;
export type GetProductQueryOne = Promise<
  Result<ProductPageItem & Pick<ProductsRecord, "visibility">, ErrorFormat>
>;

export interface GetProductInput {
  page: number;
  sort: "asc" | "desc";
  category?: string[];
  company?: string;
}

export type GetProductByIdInput = Pick<ProductsRecord, "id">;
