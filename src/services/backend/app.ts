import express from "express";
import userRouter from "./routes/users.routes.ts";
import imagesAuth from "./routes/images.routes.ts";
import companieRouter from "./routes/companies.routes.ts";
import postRoutes from "./routes/posts.routes.ts";
import jobRoutes from "./routes/jobs.routes.ts";
import cookies from "cookie-parser";
import cors from "cors";
import { env } from "@env";
import { protectWithValidation } from "@auth/validation.middleware.js";
import { editModeCompany } from "@auth/edit.middleware.js";
import { protectRoute } from "@auth/jwt.middleware.js";

const app = express();
app.use(express.json());
app.use(cookies());
const PORT = env.BACKEND_PORT;
if (env.NODE_ENV === "development")
  app.use(cors({ origin: env.FRONTEND, credentials: true }));
if (env.NODE_ENV === "production")
  app.use(
    cors({ origin: ["localhost", "nicolas-amaya.dev"], credentials: true }),
  );
// Routers
app.get("/", (_, res) => res.send("Server up"));
app.use("/auth", userRouter);
app.get(
  "/auth/company/:companyId",
  protectRoute,
  protectWithValidation,
  editModeCompany,
);
app.use("/auth/images", imagesAuth);
app.use("/companies", companieRouter);
app.use("/", postRoutes);
app.use("/jobs", jobRoutes);
app.listen(PORT, (): void => console.log(` App listening on port ${PORT}...`));
