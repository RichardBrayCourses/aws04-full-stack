import express from "express";
import type { Request, Response } from "express";
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

export const app = express();

const s3Client = new S3Client();

app.use((_req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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

    const response = await s3Client.send(
      new ListObjectsV2Command({ Bucket: bucketName }),
    );

    const photos = [];

    for (const s3File of response.Contents ?? []) {
      if (!s3File.Key) {
        continue;
      }

      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: s3File.Key,
        }),
        { expiresIn: 3600 },
      );

      photos.push({
        id: s3File.Key,
        title: s3File.Key,
        description: "",
        small: url,
        large: url,
      });
    }

    res.json({ photos });
  } catch {
    res.status(500).json({ error: "Could not list photos" });
  }
});

/*
===============================================================================
Advanced version: pagination + concurrent asynchronous I/O
===============================================================================
The beginner version lists one page of S3 objects and then creates each
pre-signed URL one at a time.
That is fine for a teaching example, but a production-style version should handle
two extra concerns:
1. Pagination
   S3's ListObjectsV2Command only returns one page of results at a time.
   If the bucket contains more objects than fit in one response, AWS returns a
   ContinuationToken. We must keep calling S3 until there are no more pages.
2. Concurrent asynchronous I/O
   Creating pre-signed URLs is an asynchronous operation. Rather than awaiting
   each URL one after another inside a loop, we can use Promise.all() so that all
   URL-generation operations for the current page are started together.
This is not quite the same as "parallel processing" in the CPU sense. We are not
doing heavy calculations on multiple CPU cores. Instead, we are allowing multiple
asynchronous I/O-style operations to be in progress at the same time.
===============================================================================
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
    const pagePhotos = await Promise.all(
      (response.Contents ?? [])
        .filter((s3File) => s3File.Key)
        .map(async (s3File) => {
          const key = s3File.Key!;
          const url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: bucketName,
              Key: key,
            }),
            { expiresIn: 3600 },
          );
          return {
            id: key,
            title: key,
            description: "",
            small: url,
            large: url,
          };
        }),
    );
    photos.push(...pagePhotos);
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  res.json({ photos });
} catch {
  res.status(500).json({ error: "Could not list photos" });
}
*/

app.delete("/photos", async (_req: Request, res: Response) => {
  try {
    const bucketName = process.env.IMAGES_BUCKET_NAME;

    if (!bucketName) {
      res.status(500).json({ error: "IMAGES_BUCKET_NAME is not configured" });
      return;
    }

    const response = await s3Client.send(
      new ListObjectsV2Command({ Bucket: bucketName }),
    );

    const photosToDelete = (response.Contents ?? []).flatMap((s3File) =>
      s3File.Key ? [{ Key: s3File.Key }] : [],
    );

    if (photosToDelete.length > 0) {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: { Objects: photosToDelete },
        }),
      );
    }

    res.json({ deleted: photosToDelete.length });
  } catch {
    res.status(500).json({ error: "Could not delete photos" });
  }
});

app.post("/photos/presigned-url", async (_req: Request, res: Response) => {
  try {
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
