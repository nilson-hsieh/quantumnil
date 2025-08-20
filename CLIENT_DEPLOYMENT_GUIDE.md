# Strapi GCP Deployment Guide for Client

## Prerequisites

- Google Cloud Project with billing enabled
- Cloud SQL PostgreSQL instance created
- Google Cloud Storage bucket created
- gcloud CLI installed and authenticated
- Docker installed

## Step 1: Load the Docker Image

```bash
docker load -i strapi-gcp-clean-for-client.tar
```

## Step 2: Tag for Your GCP Project

```bash
# Replace YOUR_PROJECT_ID with your actual GCP project ID
docker tag strapi-gcp-clean:latest gcr.io/YOUR_PROJECT_ID/strapi:latest
```

## Step 3: Push to Google Container Registry

```bash
# Configure Docker for GCR
gcloud auth configure-docker

# Push the image
docker push gcr.io/YOUR_PROJECT_ID/strapi:latest
```

## Step 4: Grant Cloud SQL Permissions

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

# Grant Cloud SQL permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

## Step 5: Generate Security Keys

Generate new security keys for your deployment:

```bash
# Generate APP_KEYS (4 keys separated by commas)
node -e "console.log(Array(4).fill().map(() => require('crypto').randomBytes(32).toString('base64')).join(','))"

# Generate other secrets
node -e "console.log('API_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('ADMIN_JWT_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('TRANSFER_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('base64'))"
```

## Step 6: Deploy to Cloud Run

**IMPORTANT**: Replace ALL placeholder values (YOUR\_\*) with your actual values before running this command.

### Example with placeholder values:

```bash
gcloud run deploy strapi-backend \
  --image gcr.io/YOUR_PROJECT_ID/strapi:latest \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --port 1337 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 900 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,BUCKET_NAME=YOUR_BUCKET_NAME,DATABASE_CLIENT=postgres,DATABASE_HOST=/cloudsql/YOUR_PROJECT_ID:YOUR_REGION:YOUR_DB_INSTANCE,DATABASE_PORT=5432,DATABASE_NAME=YOUR_DB_NAME,DATABASE_USERNAME=YOUR_DB_USER,DATABASE_PASSWORD=YOUR_DB_PASSWORD,DATABASE_SSL=false,DATABASE_SCHEMA=public,API_TOKEN_SALT=YOUR_API_TOKEN_SALT,ADMIN_JWT_SECRET=YOUR_ADMIN_JWT_SECRET,TRANSFER_TOKEN_SALT=YOUR_TRANSFER_TOKEN_SALT,ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY \
  --set-env-vars APP_KEYS="YOUR_GENERATED_APP_KEYS" \
  --add-cloudsql-instances YOUR_PROJECT_ID:YOUR_REGION:YOUR_DB_INSTANCE \
  --project YOUR_PROJECT_ID
```

### Example with actual values (replace with your own):

```bash
gcloud run deploy strapi-backend \
  --image gcr.io/my-company-project/strapi:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 1337 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 900 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,BUCKET_NAME=my-company-strapi-bucket,DATABASE_CLIENT=postgres,DATABASE_HOST=/cloudsql/my-company-project:us-central1:my-strapi-db,DATABASE_PORT=5432,DATABASE_NAME=strapi_prod,DATABASE_USERNAME=strapi_user,DATABASE_PASSWORD=my_secure_password_123,DATABASE_SSL=false,DATABASE_SCHEMA=public,API_TOKEN_SALT=abc123def456...,ADMIN_JWT_SECRET=xyz789uvw012...,TRANSFER_TOKEN_SALT=mno345pqr678...,ENCRYPTION_KEY=stu901vwx234... \
  --set-env-vars APP_KEYS="key1==,key2==,key3==,key4==" \
  --add-cloudsql-instances my-company-project:us-central1:my-strapi-db \
  --project my-company-project
```

## Environment Variables to Replace:

- `YOUR_PROJECT_ID`: Your GCP project ID
- `YOUR_REGION`: Your preferred region (e.g., asia-east1)
- `YOUR_BUCKET_NAME`: Your Google Cloud Storage bucket name
- `YOUR_DB_INSTANCE`: Your Cloud SQL instance name
- `YOUR_DB_NAME`: Your database name
- `YOUR_DB_USER`: Your database username
- `YOUR_DB_PASSWORD`: Your database password
- `YOUR_GENERATED_APP_KEYS`: The 4 comma-separated keys from Step 5
- `YOUR_API_TOKEN_SALT`: Generated API token salt
- `YOUR_ADMIN_JWT_SECRET`: Generated admin JWT secret
- `YOUR_TRANSFER_TOKEN_SALT`: Generated transfer token salt
- `YOUR_ENCRYPTION_KEY`: Generated encryption key

## Security Notes:

- Never use the example keys in production
- Generate new keys for each environment
- Store sensitive environment variables securely
- Use Google Secret Manager for production deployments

## Troubleshooting:

- Check Cloud Run logs if deployment fails
- Ensure Cloud SQL instance is in the same region
- Verify all environment variables are set correctly
- Make sure service account has Cloud SQL permissions
