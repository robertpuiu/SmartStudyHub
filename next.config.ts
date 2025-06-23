import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable automatic bundling of all external packages in Pages Router:
  bundlePagesRouterDependencies: true,
  // Opt-out specific packages from bundling in both App and Pages Routers:
  serverExternalPackages: ["pdf-parse"],
  // (Optional) If you need to transpile certain modules instead of bundling:
  transpilePackages: ["some-esm-only-package"],
};

export default nextConfig;
