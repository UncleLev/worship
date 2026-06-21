const crypto = require('crypto');

const buildId = crypto.randomBytes(8).toString('hex');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  output: 'export',

  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
};

module.exports = nextConfig;
