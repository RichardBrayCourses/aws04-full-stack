import express from "express";
import type { Request, Response } from "express";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

export const app = express();

const s3Client = new S3Client();

app.use(express.json());

app.use((req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get("/health", (_req: Request, res: Response) => {
  res.send("Healthy!");
});

app.get("/photos", async (_req: Request, res: Response) => {
  try {
    const bucketName = process.env.IMAGES_BUCKET_NAME;

    if (!bucketName) {
      res.status(500).json({ error: "IMAGES_BUCKET_NAME is not configured" });
      return;
    }

    const photos = [];
    let continuationToken: string | undefined;

    do {
      const response = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          ContinuationToken: continuationToken,
        }),
      );

      for (const object of response.Contents ?? []) {
        if (!object.Key) {
          continue;
        }

        const url = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: bucketName,
            Key: object.Key,
          }),
          { expiresIn: 3600 },
        );

        photos.push({
          id: object.Key,
          title: object.Key,
          description: "",
          small: url,
          large: url,
        });
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    res.json({ photos });
  } catch {
    res.status(500).json({ error: "Could not list photos" });
  }
});

app.post("/photos/presigned-url", async (req: Request, res: Response) => {
  try {
    const bucketName = process.env.IMAGES_BUCKET_NAME;

    if (!bucketName) {
      res.status(500).json({ error: "IMAGES_BUCKET_NAME is not configured" });
      return;
    }

    const contentType =
      typeof req.body?.contentType === "string" && req.body.contentType
        ? req.body.contentType
        : "image/jpeg";

    const uploadUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: bucketName,
        Key: randomUUID(),
        ContentType: contentType,
      }),
      { expiresIn: 900 },
    );

    res.type("text/plain").send(uploadUrl);
  } catch {
    res.status(500).json({ error: "Could not create upload URL" });
  }
});
