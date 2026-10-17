import { compressToEncodedURIComponent } from "lz-string";

/**
 * The link that opens a snippet in the TypeScript Playground, the official
 * in-browser editor at typescriptlang.org/play. The Playground keeps the
 * program in the URL fragment (the part after `#`), compressed with lz-string
 * and URL-safe encoded, so a link is the whole program and needs no server.
 *
 * Because it is a fragment, it is never sent to any server when the link is
 * followed. The Playground reads it in the browser.
 */
export const PLAYGROUND = "https://www.typescriptlang.org/play?#code/";

export function tsPlaygroundUrl(code: string): string {
  return `${PLAYGROUND}${compressToEncodedURIComponent(code)}`;
}
