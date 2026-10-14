import { db } from "@db/conection.js";
import {
  fail,
  noContentError,
  successNoContent,
  success,
  type NoContentResult,
  type PromiseResult,
} from "@app/types";
import type {
  GetProductQuery,
  GetProductInput,
  GetProductByIdInput,
  GetProductQueryOne,
} from "@db/interfaces/products.interfaces.js";
import { ERROR_CODES } from "../../types/errors.js";
import {
  category_product,
  products,
  categories as categories_table,
} from "@db/schema.js";
import type { NewProduct } from "@lib/schemas/produts.schema.js";
import { COMPANY_ID_KEY } from "@backend/const.js";
import { v7 as uuid } from "uuid";
import type { ProductsRecord } from "@db/models/products.model.js";
import { eq, type InferInsertModel } from "drizzle-orm";

export class ProductsController {
  private static limit: number = 25;
  static async getProducts(data: GetProductInput): GetProductQuery {
    try {
      const from = (data.page - 1) * this.limit;
      const result = await db.query.products.findMany({
        columns: { id: true, name: true, description: true, price: true },
        where: {
          ...(data.category && { categories: { name: { in: data.category } } }),
          ...(data.company && { company: { name: { in: data.company } } }),
        },
        orderBy: { name: data.sort },
        limit: this.limit + 1,
        offset: from,
        with: {
          company: { columns: { name: true } },
          images: { columns: { url: true, alt: true }, limit: 1 },
          categories: { columns: { name: true } },
        },
      });

      if (!result) {
        return fail({
          status: ERROR_CODES.SERVER_ERROR.status,
          error: "Db is not working",
        });
      }

      return success(result);
    } catch (e: unknown) {
      console.error(e);
      return fail(ERROR_CODES.SERVER_ERROR);
    }
  }

  static async getProductByID(data: GetProductByIdInput): GetProductQueryOne {
    try {
      const result = await db.query.products.findFirst({
        columns: { id: true, name: true, description: true, price: true },
        where: { id: data.id },
        with: {
          company: { columns: { name: true } },
          images: { columns: { url: true, alt: true } },
          categories: { columns: { name: true } },
        },
      });

      if (!result) {
        return fail({
          status: ERROR_CODES.NOT_FOUND.status,
          error: "Product not found",
        });
      }

      return success(result);
    } catch (e: unknown) {
      console.error(e);
      return fail(ERROR_CODES.SERVER_ERROR);
    }
  }

  static async createProduct(
    newProduct: NewProduct & { [COMPANY_ID_KEY]: string },
  ): PromiseResult<ProductsRecord, { status: number; error: string }> {
    const id = uuid();
    try {
      const record = await db.transaction(async (tx) => {
        const [res] = await tx
          .insert(products)
          .values({
            id,
            name: newProduct.name,
            description: newProduct.description,
            company_id: newProduct[COMPANY_ID_KEY],
            price: newProduct.price,
            newPrice: newProduct.newPrice,
            metadata: { ...newProduct.metadata },
          })
          .returning();

        const CATEGORIES_ID = Object.fromEntries(
          (await tx.select().from(categories_table)).map((curr) => [
            curr.name,
            curr.id,
          ]),
        );
        if (newProduct.categories.length <= 0) return res;
        const categories = newProduct.categories.map<
          InferInsertModel<typeof category_product>
        >((cat) => ({
          id: uuid(),
          category_id: CATEGORIES_ID[cat],
          product_id: res.id,
        }));
        await tx.insert(category_product).values(categories);
        return res;
      });
      if (!record)
        return fail({ error: "No product was inserted", status: 500 });
      return success(record);
    } catch (e) {
      console.error(e);
      return fail({
        error: "Error in the database trying to create Product",
        status: 500,
      });
    }
  }
  static async deleteProduct({
    productId,
  }: {
    productId: string;
  }): Promise<NoContentResult> {
    try {
      await db.delete(products).where(eq(products.id, productId));
      return successNoContent();
    } catch {
      return noContentError({
        status: 500,
        error: "Error deleting value from db",
      });
    }
  }
}
