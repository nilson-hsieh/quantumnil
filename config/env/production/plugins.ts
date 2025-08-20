module.exports = ({ env }) => ({
  'import-export-entries': {
    enabled: true,
  },
  upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: env('BUCKET_NAME'),
        publicFiles: true, // Allow public access to uploaded files
        uniform: false, // Use legacy ACLs for granular control
        basePath: env('GCS_BASE_PATH', ''),
        baseUrl: env('GCS_BASE_URL') || `https://storage.googleapis.com/${env('BUCKET_NAME')}`,
        // For service account authentication (recommended for production)
        serviceAccount: env('GCP_SERVICE_ACCOUNT') ? JSON.parse(env('GCP_SERVICE_ACCOUNT')) : undefined,
        // Alternative: use keyFilename if you have a service account key file
        // keyFilename: env('GCP_KEY_FILE'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
