/** @type {import('next').NextConfig} */

const repoName = "niche";
const nextConfig = {
  images: {
    domains: ["www.nitch.com"],
    unoptimized: true, // Disable Image Optimization for static export
  },
  output: "export",
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
};

export default nextConfig;
