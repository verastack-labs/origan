import { defineConfig } from "@playwright/test";

/**
 * Browser checks for behaviour that only exists in a browser: the chapters
 * shell staying mounted, scroll, focus, and the interactive blocks. Start the
 * site (`pnpm dev -p 4900`, or a static server over `out/`), then run
 * `E2E_BASE_URL=http://localhost:4900 pnpm e2e`.
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:4900",
    reducedMotion: "no-preference",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
