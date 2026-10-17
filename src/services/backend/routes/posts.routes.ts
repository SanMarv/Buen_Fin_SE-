import { Router } from "express";
import type { Response, Request } from "express";
import { gerPostIdSchema, getProduct } from "@backend/schemas/posts.schemas.js";
import { ProductsController } from "@db/controllers/products.controller.js";
import { inputValidationMiddleware } from "@backend/middleware/inputValidation.middleware.js";
import { createProductSchema } from "@lib/schemas/produts.schema.js";
import { refreshEditMode } from "@auth/edit.middleware.js";
import { COMPANY_ID_KEY } from "@backend/const.js";
import type {
  RequestWithNewPost,
  RequestWithOwner,
  RequestWithUpdatePost,
} from "@backend/types.js";
import { protectRoute } from "@auth/jwt.middleware.js";
import {
  editModePost,
  refreshEditModePost,
} from "@auth/editPost.middleware.js";
import {
  checkRequestParameter,
  checkVisibility,
  type RequestWithVisibilty,
} from "@backend/schemas/app.schema.js";

export const postsRouter = Router();

postsRouter.get(
  "/product/edit/:postId",
  protectRoute,
  refreshEditMode,
  editModePost,
);

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

postsRouter.delete(
  "/product/:productId",
  protectRoute,
  refreshEditMode,
  async (req, res: RequestWithUpdatePost) => {
    const { success: isValidId, data: productId } = checkRequestParameter(
      "productId",
      req.params,
    );
    if (!isValidId)
      return res
        .status(400)
        .json({ error: "Error in request uuid", status: 400 });
    const companyId = res.locals[COMPANY_ID_KEY];
    const { success } = await ProductsController.checkOwner({
      companyId,
      productId,
    });
    if (!success)
      return res.status(403).json({ status: 403, error: "Prohibited" });
    const { status } = await ProductsController.deleteProduct({
      productId,
    });
    return res.sendStatus(status);
  },
);

postsRouter.put(
  "/product/visibility/:productId",
  protectRoute,
  refreshEditMode,
  refreshEditModePost,
  inputValidationMiddleware(checkVisibility, "newVisibility"),
  async (req, res: RequestWithVisibilty<"newVisibility", RequestWithOwner>) => {
    const { success: isValidId, data: productId } = checkRequestParameter(
      "productId",
      req.params,
    );
    if (!isValidId)
      return res.status(400).json({ error: "Bad format in id", status: 400 });
    const { visibility } = res.locals.newVisibility;
    const companyId = res.locals[COMPANY_ID_KEY];
    const { status, success, error } = await ProductsController.updateVisibilty(
      {
        companyId,
        productId,
        visibility,
      },
    );
    if (!success) console.error(error);
    return res.sendStatus(status);
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

export default postsRouter;
