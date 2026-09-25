import express from "express";

const app = express();

const PORT = process.env.PORT || 4001;

app.get("/health", (_, res) => {
  return res.sendStatus(204);
});

app.all(/.*/, (_, res) => res.sendStatus(404));

app.listen(PORT, () => console.log(`Image service start in port ${PORT}`));
