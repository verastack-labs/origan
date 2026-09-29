import type { NextConfig } from "next";

/**
 * Built as a static export for GitHub Pages.
 *
 * The site is served from a project path, `verastack-labs.github.io/origan`,
 * not from a domain root, so `basePath` has to be set or every internal link
 * and asset URL resolves one level too high. It is read from an env var so a
 * local `next dev` still runs at `/`, and so pointing a real domain at this
 * later is a config change rather than a find and replace.
 *
 * `images.unoptimized` is required: the Next image optimiser needs a server,
 * and a static export has none.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  // `next build` and `next dev` share `.next` by default, and a build run
  // while dev is up leaves the dev server serving chunks that no longer
  // exist. Giving the build its own directory makes the two impossible to
  // collide.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  basePath,
  // Without this, GitHub Pages serves /origan/about as a 404 rather than
  // finding /origan/about/index.html.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
