import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const videoHeaders = [
      { key: "Accept-Ranges", value: "bytes" },
      { key: "Content-Type", value: "video/mp4" },
    ];
    return [
      { source: "/mobilebanner.mp4", headers: videoHeaders },
      { source: "/WISERBANNER.mp4", headers: videoHeaders },
    ];
  },
};

export default nextConfig;
