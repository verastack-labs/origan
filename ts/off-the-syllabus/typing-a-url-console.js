// browser-only
// Article 11, "Try it yourself". Paste this into the Console of DevTools on any page.
// It needs a browser, so scripts/check-ts-snippets.mjs only checks that it parses.

// region: console
const [nav] = performance.getEntriesByType("navigation");
const secure = nav.secureConnectionStart > 0;

console.table({
  "DNS lookup": nav.domainLookupEnd - nav.domainLookupStart,
  "TCP connect": (secure ? nav.secureConnectionStart : nav.connectEnd) - nav.connectStart,
  "TLS handshake": secure ? nav.connectEnd - nav.secureConnectionStart : 0,
  "Waiting for the server": nav.responseStart - nav.requestStart,
  "Download": nav.responseEnd - nav.responseStart,
  "Building the page": nav.domInteractive - nav.responseEnd,
});
// endregion
