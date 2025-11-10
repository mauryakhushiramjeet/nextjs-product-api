import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    domains: ['res.cloudinary.com'], // ✅ allow Cloudinary images
  },
};

export default nextConfig;
