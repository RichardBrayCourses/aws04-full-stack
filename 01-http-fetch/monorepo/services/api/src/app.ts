import express from "express";
import type { Request, Response } from "express";

export const app = express();

app.use((_req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/health", (_req: Request, res: Response) => {
  res.send("Healthy!");
});
