// browser-only
// Article 5, "Try it yourself". Paste this into the Console of DevTools on any page.
// It needs a browser, so scripts/check-ts-snippets.mjs only checks that it parses.

// region: console
const blocks = document.querySelectorAll('script[type="application/ld+json"]');

console.log(`${blocks.length} JSON-LD block(s) on this page`);
for (const block of blocks) {
  console.log(JSON.parse(block.textContent));
}
// endregion
