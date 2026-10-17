import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // `next.config.ts` sends the production build here instead of `.next`, so
    // it needs ignoring explicitly or lint walks the compiled bundle.
    ".next-build/**",
    // The Switch's snippets: lesson code that is checked by tsc and Vitest, and
    // programs that are meant to fail. They are teaching code, not site code.
    "ts/**",
  ]),
]);

export default eslintConfig;
