import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: process.env.GRAPHQL_URL || 'http://localhost:8080/v1/graphql',
      },
    ];
  },
};

export default nextConfig;
