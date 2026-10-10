import express from "express";
import imageRoutes from "./routes/images.routes.ts";
import profilesRoutes from "./routes/profile.routes.ts";
const app = express();

process.loadEnvFile();

const PORT = process.env.PORT || 4001;

app.get("/health", (_, res) => {
  return res.sendStatus(204);
});

app.use("/image", imageRoutes);

app.use("/profile", profilesRoutes);

app.all(/.*/, (_, res) => res.sendStatus(404));

app.listen(PORT, () => console.log(`Image service start in port ${PORT}`));
