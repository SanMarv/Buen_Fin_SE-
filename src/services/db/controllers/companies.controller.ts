import { db } from "@db/conection.js";
import {
  companies,
  jobs as jobs_table,
  products as products_table,
  imageProducts,
  users,
  validation_table,
  locations,
  images,
  categories,
  category_product,
} from "@db/schema.js";
import { v4 as uuid } from "uuid";
import { UploadProfile as getProfilePicture } from "@images-service";
import type {
  CompanyBasicInfo,
  CompanyResultById,
  CreateCompanyResult,
} from "@db/interfaces/companies.interface.js";
import {
  success,
  fail,
  type PromiseResult,
  type NoContentResult,
  noContentError,
  successNoContent,
  type Result,
} from "@app/types";
import { and, eq } from "drizzle-orm";
import type { CompanieInput } from "@backend/schemas/company.schema.js";
import type { CompaniesSelectUser } from "@backend/types";
import { COMPANY_ID_KEY } from "@backend/const.js";
import type { ErrorFormat } from "../../types/errors.ts";
import { manager } from "@backend/logger/manager.js";
import type { CompanyPageItem } from "@lib/types/company.js";
import type { ProductPageItem } from "@lib/types/products.js";
import type { Category } from "@lib/types/categories.js";

class DataNotFound extends Error {
  status: number = 404;
  error: string = "Element to found in database";
  table: string;
  constructor(table: string) {
    super(`Element not found in database ${table}`);
    this.table = table;
  }
}
export class CompaniesController {
  static async isRfcPresent(rfc: string) {
    const results = await db
      .select()
      .from(companies)
      .where(eq(companies.rfc, rfc));
    return results.length > 0;
  }
  static async create(companie: CompanieInput): CreateCompanyResult {
    const id = uuid();
    const { name, rfc, user_id, validation_id } = companie;
    const {
      success: isInBucket,
      error,
      data,
    } = await getProfilePicture({ user: { id, name } });
    if (!isInBucket) return fail(error);
    const { url } = data;
    try {
      const [record] = await db
        .insert(companies)
        .values({
          id,
          name,
          profile_picture: url,
          rfc,
          user_id,
          validation_id,
        })
        .returning();

      manager.addLog({
        type: "DB",
        action: "CREATE",
        table: "companies",
        id: user_id,
      });

      return success(record);
    } catch (e) {
      console.error(e);
      return fail({ status: 500, error: "Error adding record" });
    }
  }
  static async checkOwner(
    companyId: string,
    user_id: string,
  ): PromiseResult<{ id: string }, { status: 404 | 500; error: string }> {
    try {
      const records = await db
        .select({ id: companies.id })
        .from(companies)
        .innerJoin(
          users,
          and(eq(companies.user_id, users.id), eq(users.id, user_id)),
        )
        .where(eq(companies.id, companyId));
      if (records.length <= 0) return fail({ status: 404, error: "No found" });

      manager.addLog({
        type: "DB",
        action: "READ",
        table: "companies",
        id: user_id,
      });

      return success(records[0]);
    } catch (e) {
      console.error(e);
      return fail({ status: 500, error: "Error while tring to querry" });
    }
  }
  static async getCompanyData(id: string): CompanyResultById {
    try {
      const res = await db.transaction(async (tx) => {
        const [company] = await tx
          .select({
            name: companies.name,
            profile_picture: companies.profile_picture,
            description: companies.description,
          })
          .from(companies)
          .where(eq(companies.id, id));
        if (!company) throw new DataNotFound("Companies");
        const jobs = await tx
          .select({
            id: jobs_table.id,
            name: jobs_table.name,
            description: jobs_table.description,
            location: {
              state: locations.state,
              city: locations.city,
            },
          })
          .from(jobs_table)
          .innerJoin(locations, eq(locations.id, jobs_table.location_id))
          .where(eq(jobs_table.company_id, id));
        const products = await tx.query.products.findMany({
          columns: {
            id: true,
            name: true,
            description: true,
            newPrice: true,
            price: true,
            link: true,
          },
          where: {
            company_id: id,
          },
          with: {
            images: {
              columns: {
                url: true,
                alt: true,
              },
            },
            categories: {
              columns: {
                name: true,
              },
            },
          },
        });
        const values: CompanyPageItem = {
          name: company.name,
          description: company.description,
          profile_picture: company.profile_picture,
          jobs,
          products: products.map<Omit<ProductPageItem, "company">>((v) => ({
            id: v.id,
            categories: v.categories.map((c) => c.name as Category),
            description: v.description ?? "",
            name: v.name,
            images: v.images,
            link: v.link,
            newPrice: v.newPrice,
            price: v.price,
          })),
        };
        return values;
      });
      return success(res);
    } catch (e) {
      if (e instanceof DataNotFound)
        return fail({
          error: "Company not found",
          status: 404,
        });
      return fail({
        error: "Error getting data from database",
        status: 500,
      });
    }
  }
  static async getBasicData(
    id: string,
  ): PromiseResult<CompanyBasicInfo, { status: 500 | 404; error: string }> {
    try {
      const [record] = await db
        .select({
          id: companies.id,
          name: companies.name,
          profile_picture: companies.profile_picture,
          rfc: companies.rfc,
        })
        .from(companies)
        .where(eq(companies.id, id));
      if (!record) return fail({ status: 404, error: "Not found record" });

      return success(record);
    } catch (e) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexpected error while querring companies",
      });
    }
  }
  static async updateProfile({
    companyId,
    url,
  }: {
    companyId: string;
    url: string;
  }): Promise<NoContentResult> {
    try {
      const record = await db
        .update(companies)
        .set({ profile_picture: url })
        .where(eq(companies.id, companyId))
        .returning();
      if (record.length <= 0)
        return noContentError({ status: 404, error: "No updated record" });
      return successNoContent();
    } catch (e) {
      console.error(e);
      return noContentError({ status: 500, error: "Unexpeted error" });
    }
  }
  static async getUserCompanies(
    userId: string,
  ): Promise<CompaniesSelectUser[]> {
    try {
      manager.addLog({
        type: "DB",
        action: "READ",
        table: "companies",
        id: userId,
      });

      return await db
        .select({
          [COMPANY_ID_KEY]: companies.id,
          name: companies.name,
          profile_picture: companies.profile_picture,
          certification: {
            rfc: validation_table.rfc,
            legal_name: validation_table.name,
            valid_until: validation_table.valid_until,
          },
        })
        .from(companies)
        .where(eq(companies.user_id, userId))
        .leftJoin(
          validation_table,
          eq(companies.validation_id, validation_table.id),
        );
    } catch {
      return [];
    }
  }

  static async updateValidation(
    company_id: string,
    validation: string,
  ): Promise<Result<boolean, ErrorFormat>> {
    try {
      const validation_ready = await db
        .update(companies)
        .set({ validation_id: validation })
        .where(eq(companies.id, company_id))
        .returning();

      if (!validation_ready) {
        return fail({ status: 404, error: "Record to update not found" });
      }

      return success(true);
    } catch (e: unknown) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexpected error when updating company validation",
      });
    }
  }

  static async updateCompany(
    name: string,
    company_id: string,
  ): Promise<Result<boolean, ErrorFormat>> {
    try {
      const updated = await db
        .update(companies)
        .set({ name: name })
        .where(eq(companies.id, company_id))
        .returning();
      if (!updated) {
        return fail({ status: 404, error: "Company not found" });
      }

      return success(true);
    } catch (e: unknown) {
      console.log(e);
      return fail({
        status: 500,
        error: "Could not update company correctly ",
      });
    }
  }

  static async deleteCompany(
    company_id: string,
  ): Promise<Result<boolean, ErrorFormat>> {
    try {
      const updated = await db
        .delete(companies)
        .where(eq(companies.id, company_id))
        .returning();
      if (!updated) {
        return fail({ status: 404, error: "Company not found" });
      }

      return success(true);
    } catch (e: unknown) {
      console.log(e);
      return fail({
        status: 500,
        error: "Could not delete company correctly ",
      });
    }
  }
}
