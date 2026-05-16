import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    name: "GlowLogic API",
    version: "1",
    docs: "REST base path is /api/v1",
    health: "/api/v1/health",
  });
});

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
