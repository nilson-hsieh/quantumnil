module.exports = ({ env }) => ({
  'import-export-entries': {
    enabled: true,
  },
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 50 * 1024 * 1024, // 10MB，可調整
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
