import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async headers() {
    const videoHeaders = [
      { key: "Accept-Ranges", value: "bytes" },
      { key: "Content-Type", value: "video/mp4" },
    ];
    return [
      { source: "/mobilebanner.mp4", headers: videoHeaders },
      { source: "/WISERBANNER.mp4", headers: videoHeaders },
      // Admin is a client-side, auth-gated area: keep it out of every search index.
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
