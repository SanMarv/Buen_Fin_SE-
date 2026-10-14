import { Router } from "express";
import type { Response, Request } from "express";
import {
  gerPostIdSchema,
  getJobs,
  getProduct,
} from "@backend/schemas/posts.schemas.js";
import { ProductsController } from "@db/controllers/products.controller.js";
import { JobsController } from "@db/controllers/jobs.controller.js";
import { inputValidationMiddleware } from "@backend/middleware/inputValidation.middleware.js";
import { createProductSchema } from "@lib/schemas/produts.schema.js";
import { refreshEditMode } from "@auth/edit.middleware.js";
import { COMPANY_ID_KEY } from "@backend/const.js";
import type { RequestWithNewPost } from "@backend/types.js";
import { protectRoute } from "@auth/jwt.middleware.js";

export const postsRouter = Router();

postsRouter.post(
  "/product",
  protectRoute,
  refreshEditMode,
  inputValidationMiddleware(createProductSchema, "newCompany"),
  async (_, res: RequestWithNewPost) => {
    const companyId = res.locals[COMPANY_ID_KEY];
    const { success, data, error } = await ProductsController.createProduct({
      ...res.locals.newCompany,
      companyId,
    });
    if (!success) return res.status(error.status).json(error);
    return res.json(data);
  },
);
postsRouter.get("/products", async (req: Request, res: Response) => {
  const parsed_query = getProduct.safeParse(req.query);

  if (!parsed_query.success) {
    return res
      .status(400)
      .json({ status: 400, error: "Invalid search parameters" });
  }

  const query_data = parsed_query.data;

  const {
    success,
    data: products,
    error,
  } = await ProductsController.getProducts(query_data);

  if (!success) {
    return res.status(error.status).json(error);
  }

  return res.status(200).json(products);
});

postsRouter.get("products/:id", async (req: Request, res: Response) => {
  const parsed_product_id = gerPostIdSchema.safeParse(req.params.id);
  if (!parsed_product_id.success) {
    return res.status(400).json({
      status: 400,
      error: "Product id not written in the correct form",
    });
  }

  const product_id = parsed_product_id.data;

  const {
    success,
    data: product,
    error,
  } = await ProductsController.getProductByID(product_id);

  if (!success) {
    return res.status(error.status).json(error);
  }

  return res.status(200).json(product);
});

postsRouter.get("jobs", async (req: Request, res: Response) => {
  const parsed_query = getJobs.safeParse(req.query);

  if (!parsed_query.success) {
    return res
      .status(400)
      .json({ status: 400, error: "Invalid search parameters" });
  }

  const query_data = parsed_query.data;

  const {
    success,
    data: jobs,
    error,
  } = await JobsController.getJobs(query_data);

  if (!success) {
    return res.status(error.status).json(error);
  }

  return res.status(200).json(jobs);
});

postsRouter.get("jobs/:id", async (req: Request, res: Response) => {
  const parsed_job_id = gerPostIdSchema.safeParse(req.params.id);
  if (!parsed_job_id.success) {
    return res.status(400).json({
      status: 400,
      error: "Product id not written in the correct form",
    });
  }

  const job_id = parsed_job_id.data;

  const {
    success,
    data: product,
    error,
  } = await JobsController.getJobByID(job_id);

  if (!success) {
    return res.status(error.status).json(error);
  }

  return res.status(200).json(product);
});

export default postsRouter;
