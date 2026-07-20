#!/bin/bash
set -e

# Load .env if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Validate required variables
if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ] || [ -z "$DEPLOY_PATH" ]; then
  echo "Error: Missing required env variables (DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH)" >&2
  exit 1
fi

# Build
echo "Building static export..."
npm run build
if [ $? -ne 0 ]; then
  echo "Error: Build failed" >&2
  exit 1
fi

# Deploy via rsync
echo "Deploying to $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH..."
rsync -avz --delete -e "ssh -i ~/.ssh/oracle_vm.key" out/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH"

echo "Deployment complete!"
