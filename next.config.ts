import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hieutn-server.s3.ap-southeast-2.amazonaws.com",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/devicons/devicon@latest/icons/**"
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "**"
      }
    ]
  }
};

export default nextConfig;
