import express from "express";
import type { Request, Response } from "express";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
export const app = express();

app.use((_req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/health", (_req: Request, res: Response) => {
  res.send("Healthy!");
});

app.post("/photos/presigned-url", async (_req: Request, res: Response) => {
  try {
    const s3Client = new S3Client();

    const bucketName = process.env.IMAGES_BUCKET_NAME;

    if (!bucketName) {
      res.status(500).json({ error: "IMAGES_BUCKET_NAME is not configured" });
      return;
    }

    const uploadUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: bucketName,
        Key: randomUUID(),
        ContentType: "image/jpeg",
      }),
      { expiresIn: 900 },
    );

    res.type("text/plain").send(uploadUrl);
  } catch {
    res.status(500).json({ error: "Could not create upload URL" });
  }
});
