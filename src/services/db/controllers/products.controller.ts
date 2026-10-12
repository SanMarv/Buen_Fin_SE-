import { db } from "@db/conection.js";
import { fail, success } from "@app/types";
import type { GetProductQuery, GetProductInput } from "@db/interfaces/products.interfaces.js";
import { ERROR_CODES } from "../../types/errors.js";

export class ProductsController{
  private static limit : number = 25; 
  static async getProducts(data: GetProductInput): GetProductQuery{
    try{
      const from = (data.page - 1) * this.limit;   
      const result = await db.query.products.findMany({columns:{id: true, name: true, description: true, price: true},
      where: {...(data.category && {categories: { name: { in: data.category}}}), ...(data.company && {company: {name: {in: data.company}}})}, 
      orderBy: {name: data.sort}, 
      limit: this.limit + 1, 
      offset: from, 
      with: {
          company: {columns: {name: true}}, 
          images: {columns: {url: true, alt: true}}, 
          categories: {columns: {name: true}}
        }
      })

      if(!result){
        return fail({status: ERROR_CODES.SERVER_ERROR.status, error: "Db is not working"})
      }

      return success(result) 
    }
    catch(e: unknown){
      console.error(e); 
      return fail(ERROR_CODES.SERVER_ERROR)
    }
  }
}
