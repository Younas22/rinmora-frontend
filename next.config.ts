import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The Laravel API this app talks to runs on localhost in dev, so its
    // upload URLs resolve to a loopback IP — allow that explicitly.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/rinmora/public/uploads/**",
      },
      {
        protocol: "https",
        hostname: "admin.rinmora.com",
        pathname: "/public/uploads/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
