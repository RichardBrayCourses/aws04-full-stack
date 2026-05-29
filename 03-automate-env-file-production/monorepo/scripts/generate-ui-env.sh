#!/usr/bin/env bash

set -euo pipefail

# Note on MSYS_NO_PATHCONV=1
# In Git Bash on Windows, this disables automatic path conversion so CLI
# arguments such as SSM parameter paths and CloudFront paths are passed through unchanged.

API_BASE_URL_PARAMETER="/services/api/base-url"

OUTPUT_FILE="apps/ui/.env"

echo ""
echo "Reading deployment parameters from SSM Parameter Store..."
echo ""

API_BASE_URL=$(MSYS_NO_PATHCONV=1 aws ssm get-parameter \
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
