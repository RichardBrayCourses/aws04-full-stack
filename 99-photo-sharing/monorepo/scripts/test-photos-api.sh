#!/bin/sh
API_BASE_URL="${API_BASE_URL:-http://localhost:3001}"
PHOTOS_DIR="../../photos-to-upload"

for photo in "$PHOTOS_DIR"/*; do
  upload_url=$(curl -s -X POST "$API_BASE_URL/photos/presigned-url")

  curl -s -X PUT "$upload_url" \
    -H "Content-Type: image/jpeg" \
    --data-binary @"$photo"
done

curl -s "$API_BASE_URL/photos"
