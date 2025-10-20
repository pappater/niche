/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["www.nitch.com"],
    unoptimized: true, // Disable Image Optimization for static export
  },
  output: "export",
};

export default nextConfig;
