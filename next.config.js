module.exports = {
    output: "standalone",
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
    images: {
      domains: ['minio.saksiam.co.th', 'smartcard-dev.saksiam.co.th', 'smartcard-uat.saksiam.co.th'],
    },
  };