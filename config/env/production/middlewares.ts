module.exports = ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            env('GCS_BASE_URL') || `https://storage.googleapis.com/${env('BUCKET_NAME')}/`,
            env('CDN_URL'),
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            env('GCS_BASE_URL') || `https://storage.googleapis.com/${env('BUCKET_NAME')}/`,
            env('CDN_URL'),
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
