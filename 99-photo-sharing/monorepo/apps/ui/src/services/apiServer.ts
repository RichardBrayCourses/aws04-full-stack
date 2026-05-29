import { config } from "../config";
import { PhotoData } from "@/data/photos";

export const checkApiServerHealth = async () => {
  const response = await fetch(`${config.apiBaseUrl}/health`);

  if (!response.ok) {
    return false;
  }

  const body = await response.text();
  return body.trim() === "Healthy!";
};

const getPhotoUploadUrl = async (contentType: string) => {
  const response = await fetch(`${config.apiBaseUrl}/photos/presigned-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contentType }),
  });

  if (!response.ok) {
    throw new Error("Could not start the upload");
  }

  return response.text();
};

export const uploadPhoto = async (file: File) => {
  const contentType = file.type || "image/jpeg";
  const uploadUrl = await getPhotoUploadUrl(contentType);

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Could not upload the photo");
  }

  return;
};

export const listPhotos = async () => {
  const response = await fetch(`${config.apiBaseUrl}/photos`);

  if (!response.ok) {
    return [];
  }

  const body = (await response.json()) as { photos: PhotoData[] };
  return body.photos;
};
