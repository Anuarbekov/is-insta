/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  env: {
    API_HOST: process.env.API_HOST,
  },
};

module.exports = nextConfig;
