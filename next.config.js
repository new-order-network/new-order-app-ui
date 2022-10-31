/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const withSvgr = require('next-svgr')

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'cdn-images-1.medium.com', //medium images
      'images.ctfassets.net', //frogs anonymous images
    ],
  },
}

module.exports = withSvgr(nextConfig)
