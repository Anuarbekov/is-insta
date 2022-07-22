/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "media.geeksforgeeks.org"
    ],
  },
  basePath: ''
};

module.exports = nextConfig;
