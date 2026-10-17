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
import { and, eq, type InferInsertModel } from "drizzle-orm";
import type { VisibilityValue } from "@db/enums.js";
import { imageProducts } from "@db/schema.js";

export class ProductsController {
  private static limit: number = 25;
  static async getProducts(data: GetProductInput): GetProductQuery {
    try {
      const from = (data.page - 1) * this.limit;
      const result = await db.query.products.findMany({
        columns: { id: true, name: true, description: true, price: true },
        where: {
          ...(data.category && { categories: { name: { in: data.category } } }),
          ...(data.company && { company: { name: data.company } }),
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

  static async updateVisibilty(update: {
    productId: string;
    [COMPANY_ID_KEY]: string;
    visibility: VisibilityValue;
  }): Promise<NoContentResult> {
    const { productId, visibility } = update;
    const companyId = update[COMPANY_ID_KEY];
    try {
      await db
        .update(products)
        .set({ visibility })
        .where(
          and(eq(products.id, productId), eq(products.company_id, companyId)),
        );
      return successNoContent();
    } catch {
      return noContentError({
        error: "Error trying to update product",
        status: 500,
      });
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
  static async checkOwner(id: {
    [COMPANY_ID_KEY]: string;
    productId: string;
  }): PromiseResult<
    { status: 200; id: string },
    { error: string; status: 500 | 404 }
  > {
    const companyId = id[COMPANY_ID_KEY];
    try {
      const records = await db
        .select({ id: products.id })
        .from(products)
        .where(
          and(
            eq(products.company_id, companyId),
            eq(products.id, id.productId),
          ),
        );
      console.log(id, companyId);
      if (records.length <= 0)
        return fail({ error: "Not found the product", status: 404 });
      return success({ status: 200, id: records[0].id });
    } catch {
      return fail({
        status: 500,
        error: "Unexpected error getting post from database",
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

  static async appendImage(data: {
    product_id: string;
    image_id: string;
  }): Promise<NoContentResult> {
    try {
      await db.insert(imageProducts).values(data);
      return successNoContent();
    } catch {
      return noContentError({
        status: 500,
        error: "Unexpeted error linking images and products",
      });
    }
  }
}
