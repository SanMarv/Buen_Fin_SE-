import express from "express";
import userRouter from "./routes/users.routes.ts";
import imagesAuth from "./routes/images.routes.ts";
import cookies from "cookie-parser";
import { env } from "@env";

const app = express();
app.use(express.json());
app.use(cookies());
const PORT = env.BACKEND_PORT;

// Routers
app.get("/", (_, res) => res.send("Server up"));
app.use("/auth", userRouter);
app.use("/auth/images", imagesAuth);

app.listen(PORT, (): void => console.log(` App listening on port ${PORT}...`));
