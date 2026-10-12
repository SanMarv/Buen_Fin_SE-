import { Router } from "express";
import type { Response, Request } from "express";
import { getProduct } from "@backend/schemas/posts.schemas.js";
import { ProductsController } from "@db/controllers/products.controller.js";

const app = Router(); 

app.get("/products", async(req : Request, res : Response) => {
   const parsed_query = getProduct.safeParse(req.query); 

  if(!parsed_query.success){
    return res.status(400).json({status: 400, error: "Filter wasn't written correctly"});
  }
  
  const query_data = parsed_query.data; 

  const {success, data, error} = await ProductsController.getProducts(query_data); 

  if(!success){
    return res.status(error.status).json(error)
  }

  return res.status(200).json(data); 
})
