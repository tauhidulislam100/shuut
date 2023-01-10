/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    PORT:process.env.PORT,
  }
}

module.exports = nextConfig
