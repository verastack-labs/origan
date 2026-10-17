import Script from "next/script";
import { analytics } from "@/data/site";

/** The attribute Cloudflare's beacon reads its token from. */
export function beaconConfig(): string {
  return JSON.stringify({ token: analytics.cloudflareToken });
}

/**
 * Cloudflare Web Analytics, in production builds only, so a dev session never
 * counts as a visit. Loaded after the page is interactive, as a module script
 * the way Cloudflare's own snippet is.
 */
export function WebAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      type="module"
      strategy="afterInteractive"
      data-cf-beacon={beaconConfig()}
    />
  );
}
