#!/bin/bash

# GCP Deployment Script for Strapi
# Make sure you have gcloud CLI installed and authenticated

set -e

# Configuration
PROJECT_ID="strapi-gcp-docker"
REGION="asia-east1"
SERVICE_NAME="strapi-backend"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Starting GCP deployment..."

# Build and push Docker image to Google Container Registry
echo "📦 Building Docker image..."
docker build -f Dockerfile.prod -t ${IMAGE_NAME}:latest .

echo "🔄 Pushing image to GCR..."
docker push ${IMAGE_NAME}:latest

# Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production \
  --add-cloudsql-instances ${PROJECT_ID}:${REGION}:strapi \
  --project ${PROJECT_ID}

echo "✅ Deployment completed!"
echo "🌐 Your Strapi backend should be available at the Cloud Run URL"

# Optional: Get the service URL
echo "📋 Getting service URL..."
gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --format 'value(status.url)' \
  --project ${PROJECT_ID}
