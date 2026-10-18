// browser-only
// Article 1. The library Google publishes for measuring the vitals in the field.
// It needs the web-vitals package and a browser, so this file is only parsed.

// region: library
import { onCLS, onINP, onLCP } from "web-vitals";

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
// endregion
