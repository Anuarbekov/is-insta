/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
};

module.exports = nextConfig;
