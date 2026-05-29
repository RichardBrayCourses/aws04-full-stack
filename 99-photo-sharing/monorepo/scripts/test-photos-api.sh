#!/bin/sh
API_BASE_URL="${API_BASE_URL:-http://localhost:3001}"
PHOTOS_DIR="../../photos-to-upload"
CONTENT_TYPE="image/jpeg"

for photo in "$PHOTOS_DIR"/*; do
  upload_url=$(curl -s -X POST "$API_BASE_URL/photos/presigned-url" \
    -H "Content-Type: application/json" \
    -d "{\"contentType\":\"$CONTENT_TYPE\"}")

  curl -s -X PUT "$upload_url" \
    -H "Content-Type: $CONTENT_TYPE" \
    --data-binary @"$photo"
done

curl -s "$API_BASE_URL/photos"
