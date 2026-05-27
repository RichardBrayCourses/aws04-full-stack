import express from "express";
import type { Request, Response } from "express";

export const app = express();

app.get("/health", (_req: Request, res: Response) => {
  res.send("Healthy!");
});
