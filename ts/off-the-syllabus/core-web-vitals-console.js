// browser-only
// Article 1, "Try it yourself". Paste this into the Console of DevTools on any page.
// It needs a browser, so scripts/check-ts-snippets.mjs only checks that it parses.

// region: console
new PerformanceObserver((list) => {
  const last = list.getEntries().at(-1);
  console.log("LCP so far:", Math.round(last.startTime), "ms", last.element);
}).observe({ type: "largest-contentful-paint", buffered: true });

new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    // Skip shifts after a tap, and shifts too small to see.
    if (!entry.hadRecentInput && entry.value > 0.0001) console.log("layout shift:", entry.value.toFixed(4));
  }
}).observe({ type: "layout-shift", buffered: true });
// endregion
