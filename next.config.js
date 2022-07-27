/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins')
const withSvgr = require('next-svgr')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

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

module.exports = withPlugins([withBundleAnalyzer, withSvgr], nextConfig)
