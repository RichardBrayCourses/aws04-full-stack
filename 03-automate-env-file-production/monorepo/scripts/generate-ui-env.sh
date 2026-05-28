#!/usr/bin/env bash

set -euo pipefail

API_BASE_URL_PARAMETER="/services/api/base-url"

OUTPUT_FILE="apps/ui/.env"

echo ""
echo "Reading deployment parameters from SSM Parameter Store..."
echo ""

API_BASE_URL=$(aws ssm get-parameter \
  --name "$API_BASE_URL_PARAMETER" \
  --query "Parameter.Value" \
  --output text)


echo "Generating $OUTPUT_FILE"

cat > "$OUTPUT_FILE" <<EOF
VITE_API_BASE_URL=$API_BASE_URL
EOF

echo ""
echo "Generated:"
echo "$OUTPUT_FILE"
echo ""
cat "$OUTPUT_FILE"
echo ""