import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
const BACKEND_URL =
  process.env.INTERNAL_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  (isProd ? "https://atolyeweb.onrender.com" : "http://127.0.0.1:8000");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "font-src 'self'; " +
              "connect-src 'self' https://atolyeweb.onrender.com http://localhost:8000 http://127.0.0.1:8000 ws://localhost:3000 ws://127.0.0.1:3000; " +
              "object-src 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
