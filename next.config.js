/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  env: {
    API_HOST: process.env.API_HOST,
    FRONT_HOST: process.env.FRONT_HOST,
  },
};

module.exports = nextConfig;
