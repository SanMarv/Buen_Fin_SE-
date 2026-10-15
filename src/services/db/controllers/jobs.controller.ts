import { db } from "@db/conection.js";
import {
  fail,
  noContentError,
  success,
  successNoContent,
  type NoContentResult,
} from "@app/types";
import { ERROR_CODES } from "../../types/errors.js";
import type {
  GetJobByIdInput,
  GetJobInput,
  GetJobQuery,
  GetJobQueryOne,
} from "@db/interfaces/jobs.interface.js";
import { COMPANY_ID_KEY, JOB_ID_KEY } from "@backend/const.js";
import type { NewJob } from "@db/interfaces/jobs.interface.js";
import { jobs, locations, type VisibilityValue } from "@db/schema.js";
import { v7 as uuid } from "uuid";
import { and, eq } from "drizzle-orm";
import type { Result } from "@lib/types/types.js";

export class JobsController {
  private static limit: number = 25;
  static async getJobs(data: GetJobInput): GetJobQuery {
    try {
      const from = (data.page - 1) * this.limit;
      const result = await db.query.jobs.findMany({
        columns: { id: true, name: true, description: true },
        where: { ...(data.company && { company: { name: data.company } }) },
        orderBy: { name: data.sort },
        limit: this.limit + 1,
        offset: from,
        with: {
          company: { columns: { name: true } },
        },
      });

      if (!result) {
        return fail({
          status: ERROR_CODES.NOT_FOUND.status,
          error: "No products with specified filters",
        });
      }

      return success(result);
    } catch (e: unknown) {
      console.error(e);
      return fail(ERROR_CODES.SERVER_ERROR);
    }
  }

  static async newJob(newJob: NewJob): Promise<NoContentResult> {
    try {
      const id = uuid();
      await db.transaction(async (tx) => {
        const { city, state } = newJob.location;
        const [record] = await tx
          .select({ id: locations.id })
          .from(locations)
          .where(and(eq(locations.city, city), eq(locations.state, state)));
        if (!record) throw new Error("No location found");
        const { id: location_id } = record;
        await tx.insert(jobs).values({
          id,
          company_id: newJob[COMPANY_ID_KEY],
          location_id,
          name: newJob.name,
          description: newJob.description,
        });
      });
      return successNoContent();
    } catch {
      return noContentError({ error: "Error inserting job", status: 500 });
    }
  }

  static async getJobByID(data: GetJobByIdInput): GetJobQueryOne {
    try {
      const result = await db.query.jobs.findFirst({
        columns: { id: true, name: true, description: true },
        where: { id: data.id },
        with: {
          company: { columns: { name: true } },
        },
      });

      if (!result) {
        return fail({
          status: ERROR_CODES.NOT_FOUND.status,
          error: "Job not found",
        });
      }

      return success(result);
    } catch (e: unknown) {
      console.error(e);
      return fail(ERROR_CODES.SERVER_ERROR);
    }
  }

  static async checkOwner(param: {
    [JOB_ID_KEY]: string;
    [COMPANY_ID_KEY]: string;
  }): Promise<
    Result<
      { [JOB_ID_KEY]: string; [COMPANY_ID_KEY]: string },
      { status: number; error: string }
    >
  > {
    const companyId = param[COMPANY_ID_KEY];
    const jobId = param[JOB_ID_KEY];
    try {
      const records = await db
        .select({ [JOB_ID_KEY]: jobs.id, [COMPANY_ID_KEY]: jobs.company_id })
        .from(jobs)
        .where(and(eq(jobs.company_id, companyId), eq(jobs.id, jobId)));
      if (records.length <= 0)
        return fail({ error: "User is not owner", status: 403 });
      return success(records[0]);
    } catch (e) {
      console.error(e);
      return fail({
        status: 500,
        error: "Unexpected error gettin data from jobs",
      });
    }
  }
  static async updateVisibility(update: {
    [COMPANY_ID_KEY]: string;
    [JOB_ID_KEY]: string;
    visibility: VisibilityValue;
  }) {
    const jobId = update[JOB_ID_KEY];
    const companyId = update[COMPANY_ID_KEY];
    const { visibility } = update;
    try {
      await db
        .update(jobs)
        .set({ visibility })
        .where(and(eq(jobs.id, jobId), eq(jobs.company_id, companyId)));
      return successNoContent();
    } catch {
      return noContentError({
        error: "Error trying to update product",
        status: 500,
      });
    }
  }
  static async deleteJob(deleting: {
    [COMPANY_ID_KEY]: string;
    [JOB_ID_KEY]: string;
  }): Promise<NoContentResult> {
    try {
      const records = await db
        .delete(jobs)
        .where(
          and(
            eq(jobs.id, deleting[JOB_ID_KEY]),
            eq(jobs.company_id, deleting[COMPANY_ID_KEY]),
          ),
        )
        .returning();
      if (records.length <= 0)
        return noContentError({ status: 403, error: "Prohibited" });
      return successNoContent();
    } catch (e) {
      console.error(e);
      return noContentError({ status: 500, error: "Error deleting job" });
    }
  }
}
