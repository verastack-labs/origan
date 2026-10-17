import { afterEach, describe, expect, it, vi } from "vitest";
import { analytics } from "@/data/site";
import { WebAnalytics, beaconConfig } from "./web-analytics";

afterEach(() => vi.unstubAllEnvs());

describe("the analytics beacon", () => {
  it("is rendered in production with the token as JSON", () => {
    vi.stubEnv("NODE_ENV", "production");
    const element = WebAnalytics();
    expect(element).not.toBeNull();
    const props = element!.props as Record<string, string>;
    expect(props.src).toBe("https://static.cloudflareinsights.com/beacon.min.js");
    expect(props.type).toBe("module");
    expect(props.strategy).toBe("afterInteractive");
    expect(JSON.parse(props["data-cf-beacon"])).toEqual({ token: analytics.cloudflareToken });
  });

  it("is left out in development and test", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(WebAnalytics()).toBeNull();
    vi.stubEnv("NODE_ENV", "test");
    expect(WebAnalytics()).toBeNull();
  });

  it("keeps the token a 32 character hex string", () => {
    expect(analytics.cloudflareToken).toMatch(/^[0-9a-f]{32}$/);
    expect(beaconConfig()).toContain(analytics.cloudflareToken);
  });
});
