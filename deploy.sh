#!/bin/bash
set -e

PROJECT_ID="sarkarisahayak-466910"
REGION="us-central1"
REPO_NAME="react-apps"
IMAGE_NAME="yoddhas-app"

# Build and push image (ensure amd64 for GKE)
docker buildx build --platform linux/amd64 -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:latest . --push

cd terraform

terraform init
terraform apply -auto-approve \
  -var="project_id=$PROJECT_ID" \
  -var="region=$REGION" \
  -var="image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:latest"

