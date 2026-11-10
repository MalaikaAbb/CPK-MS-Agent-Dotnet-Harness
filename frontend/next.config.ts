import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Harness infrastructure, not doc code: bound Turbopack's persistent dev
  // cache so long sessions on this machine are not OOM-killed.
  experimental: {
    turbopackMemoryEviction: "full",
  },
};

export default nextConfig;
