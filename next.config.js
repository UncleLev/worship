const withPWA = require("next-pwa")({
    dest: "public",
    cacheOnFrontEndNav: true,
    dynamicStartUrl: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // output: "export",
};

module.exports = withPWA(nextConfig);
