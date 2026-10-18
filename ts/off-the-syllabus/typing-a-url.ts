// Article 11: What happens when you type a URL. The page text is
// src/content/learn/off-the-syllabus/typing-a-url.mdx.
//
// Two small pieces: cutting a URL into the parts MDN names, and turning the
// browser's own stopwatch for a page load into the steps the article walks through.

// region: parts
export type UrlParts = {
  scheme: string;
  host: string;
  port: string;
  path: string;
  query: string;
  fragment: string;
  /** What the browser really puts in the request: the path and the query, and never the fragment. */
  sentToServer: string;
};

const defaultPorts: Record<string, string> = { "https:": "443", "http:": "80" };

export function urlParts(raw: string): UrlParts {
  const url = new URL(raw);
  return {
    scheme: url.protocol.slice(0, -1),
    host: url.hostname,
    // The port is left out of a URL when it is the standard one for the scheme.
    port: url.port || defaultPorts[url.protocol] || "",
    path: url.pathname,
    query: url.search.slice(1),
    fragment: url.hash.slice(1),
    sentToServer: `${url.pathname}${url.search}`,
  };
}
// endregion

// region: timing
// The numbers the browser keeps about a page load, in milliseconds from the
// moment the visit began. The real object is a PerformanceNavigationTiming.
export type NavigationTimes = {
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  secureConnectionStart: number; // 0 when the connection is not secure
  connectEnd: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  domInteractive: number;
  loadEventEnd: number;
};

export type Breakdown = {
  dns: number;
  tcp: number;
  tls: number;
  waitingForServer: number;
  download: number;
  buildingThePage: number;
};

// connectEnd comes after the secure handshake, so the connect interval holds
// both the TCP part and the TLS part. They are split at secureConnectionStart.
export function breakdown(t: NavigationTimes): Breakdown {
  const secure = t.secureConnectionStart > 0;
  return {
    dns: t.domainLookupEnd - t.domainLookupStart,
    tcp: (secure ? t.secureConnectionStart : t.connectEnd) - t.connectStart,
    tls: secure ? t.connectEnd - t.secureConnectionStart : 0,
    waitingForServer: t.responseStart - t.requestStart,
    download: t.responseEnd - t.responseStart,
    buildingThePage: t.domInteractive - t.responseEnd,
  };
}
// endregion
