import { db } from "@db/conection.js";
import { fail, success } from "@app/types";
import { ERROR_CODES } from "../../types/errors.js";
import type { GetJobByIdInput, GetJobInput, GetJobQuery, GetJobQueryOne } from "@db/interfaces/jobs.interface.js";

export class JobsController{
  private static limit : number = 25; 
  static async getJobs(data: GetJobInput): GetJobQuery{
    try{
      const from = (data.page - 1) * this.limit;
      const result = await db.query.jobs.findMany({columns:{id: true, name: true, description: true},
      where: {...(data.company && {company: {name: data.company}})}, 
      orderBy: {name: data.sort}, 
      limit: this.limit + 1, 
      offset: from, 
      with: {
          company: {columns: {name: true}}, 
        }
      })

      if(!result){
        return fail({status: ERROR_CODES.NOT_FOUND.status, error: "No products with specified filters"})
      }

      return success(result)
    }
    catch(e: unknown){
      console.error(e); 
      return fail(ERROR_CODES.SERVER_ERROR)
    }
  }

  static async getJobByID(data: GetJobByIdInput): GetJobQueryOne{
    try{
      const result = await db.query.jobs.findFirst({columns:{id: true, name: true, description: true},
      where: {id: data.id}, 
      with: {
          company: {columns: {name: true}}, 
        }
      })

      if(!result){
        return fail({status: ERROR_CODES.NOT_FOUND.status, error: "Job not found"})
      }

      return success(result) 
    }
    catch(e: unknown){
      console.error(e); 
      return fail(ERROR_CODES.SERVER_ERROR)
    }
  }
}
