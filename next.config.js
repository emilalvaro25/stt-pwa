/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev mode for faster reloads
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
