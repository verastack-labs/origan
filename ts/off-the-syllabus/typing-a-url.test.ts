import { describe, expect, it } from "vitest";
import { breakdown, urlParts } from "./typing-a-url";

describe("urlParts", () => {
  it("cuts MDN's example into its parts", () => {
    expect(urlParts("https://developer.mozilla.org/en-US/search?q=URL")).toEqual({
      scheme: "https",
      host: "developer.mozilla.org",
      port: "443",
      path: "/en-US/search",
      query: "q=URL",
      fragment: "",
      sentToServer: "/en-US/search?q=URL",
    });
  });

  it("uses the standard port for http, and a port that is written", () => {
    expect(urlParts("http://example.com/").port).toBe("80");
    expect(urlParts("http://localhost:4800/x").port).toBe("4800");
  });

  it("never sends the fragment to the server", () => {
    const parts = urlParts("https://example.com/guide?page=2#section-3");
    expect(parts.fragment).toBe("section-3");
    expect(parts.sentToServer).toBe("/guide?page=2");
    expect(parts.sentToServer).not.toContain("section-3");
  });

  it("has a path of / when there is none", () => {
    expect(urlParts("https://example.com").path).toBe("/");
    expect(urlParts("https://example.com").sentToServer).toBe("/");
  });

  it("lower-cases the host", () => {
    expect(urlParts("https://Example.COM/").host).toBe("example.com");
  });

  it("throws for something that is not a URL", () => {
    expect(() => urlParts("not a url")).toThrow();
  });
});

describe("breakdown", () => {
  // Numbers shaped like a real https visit, in milliseconds.
  const https = {
    domainLookupStart: 20,
    domainLookupEnd: 32,
    connectStart: 32,
    secureConnectionStart: 46,
    connectEnd: 99,
    requestStart: 100,
    responseStart: 120,
    responseEnd: 124,
    domInteractive: 175,
    loadEventEnd: 178,
  };

  it("splits the connection into TCP and TLS at the start of the secure handshake", () => {
    const b = breakdown(https);
    expect(b.dns).toBe(12);
    expect(b.tcp).toBe(14);
    expect(b.tls).toBe(53);
    expect(b.tcp + b.tls).toBe(https.connectEnd - https.connectStart);
  });

  it("measures the wait, the download and the page building", () => {
    const b = breakdown(https);
    expect(b.waitingForServer).toBe(20);
    expect(b.download).toBe(4);
    expect(b.buildingThePage).toBe(51);
  });

  it("has no TLS time on a plain http connection", () => {
    const b = breakdown({ ...https, secureConnectionStart: 0 });
    expect(b.tls).toBe(0);
    expect(b.tcp).toBe(https.connectEnd - https.connectStart);
  });

  it("has no DNS or connection time when the browser reused them", () => {
    const reused = { ...https, domainLookupStart: 5, domainLookupEnd: 5, connectStart: 5, connectEnd: 5, secureConnectionStart: 0 };
    const b = breakdown(reused);
    expect(b.dns).toBe(0);
    expect(b.tcp).toBe(0);
    expect(b.tls).toBe(0);
  });
});
