import express from "express";
import userRouter from "./routes/users.routes.ts";
import imagesAuth from "./routes/images.routes.ts";
import companieRouter from "./routes/companies.routes.ts";
import cookies from "cookie-parser";
import cors from "cors";
import { env } from "@env";

const app = express();
app.use(express.json());
app.use(cookies());
const PORT = env.BACKEND_PORT;
if (env.NODE_ENV === "development")
  app.use(cors({ origin: env.FRONTEND, credentials: true }));
// Routers
app.get("/", (_, res) => res.send("Server up"));
app.use("/auth", userRouter);
app.use("/auth/images", imagesAuth);
app.use("/companies", companieRouter);
app.listen(PORT, (): void => console.log(` App listening on port ${PORT}...`));
