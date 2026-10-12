import { Router } from "express";
import type { Response, Request } from "express";
import { gerProductIdSchema, getProduct } from "@backend/schemas/posts.schemas.js";
import { ProductsController } from "@db/controllers/products.controller.js";

export const postsRouter = Router(); 

postsRouter.get("/products", async(req : Request, res : Response) => {
   const parsed_query = getProduct.safeParse(req.query); 

  if(!parsed_query.success){
    return res.status(400).json({status: 400, error: "Filter wasn't written correctly"});
  }
  
  const query_data = parsed_query.data; 

  const {success, data : products, error} = await ProductsController.getProducts(query_data); 

  if(!success){
    return res.status(error.status).json(error)
  }
  
  return res.status(200).json(products); 
})

postsRouter.get("products/:id", async(req: Request, res: Response) => {
  const parsed_product_id = gerProductIdSchema.safeParse(req.params.id); 
  if(!parsed_product_id.success){
    return res.status(400).json({status: 400, error: "Product id not written in the correct form"})
  }

  const product_id = parsed_product_id.data; 

  const {success, data: product, error} = await ProductsController.getProductByID(product_id); 

  if(!success){
    return res.status(error.status).json(error); 
  }

  return res.status(200).json(product); 
})
