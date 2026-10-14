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
import { COMPANY_ID_KEY } from "@backend/const.js";
import type { NewJob } from "@db/interfaces/jobs.interface.js";
import { jobs, locations } from "@db/schema.js";
import { v7 as uuid } from "uuid";
import { and, eq } from "drizzle-orm";

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
}
