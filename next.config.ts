import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "recharts"],
  },
  turbopack: {},
  images: {
    formats: ["image/webp"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // HSTS: force HTTPS for 2 years, including subdomains
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        // Disable features not used by the app
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        // CSP: restrict resource origins; unsafe-inline needed for Next.js inline styles/scripts
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob:",
            "connect-src 'self' https://bsstoxcggkdzvgleqmdv.supabase.co wss://bsstoxcggkdzvgleqmdv.supabase.co",
            "worker-src 'self'",
            "manifest-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
  ],
};

export default nextConfig;
