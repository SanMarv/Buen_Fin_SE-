import { signHeader } from "@auth/headers.middleware.js";
import { protectRoute } from "@auth/jwt.middleware.js";
import { Router } from "express";

const app = Router();
app.get("/upload", protectRoute, signHeader);
export default app;
