import { rawRequest, type ApiRequest } from "../../../ts/off-the-syllabus/api-clients";

/**
 * The "build a request" block in the API clients article: a method, an address,
 * one header and a body, shown two ways at once. As the curl command that sends
 * it, and as the text that goes over the wire, written by the article's own
 * `rawRequest`. Nothing is sent anywhere.
 */
export const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;
export type Method = (typeof METHODS)[number];

/** Only these methods carry a body in the demo. */
export const hasBody = (method: Method) => method === "POST" || method === "PUT";

export const HEADER_NAMES = ["none", "Content-Type", "Accept", "Cache-Control"] as const;
export type HeaderName = (typeof HEADER_NAMES)[number];

/** A sensible value to start with when a header is chosen. */
export const HEADER_DEFAULTS: Record<HeaderName, string> = {
  none: "",
  "Content-Type": "application/json",
  Accept: "application/json",
  "Cache-Control": "no-cache",
};

export type Draft = {
  method: Method;
  url: string;
  header: HeaderName;
  headerValue: string;
  body: string;
};

/** The request the article builds for its second curl command. */
export const START: Draft = {
  method: "POST",
  url: "https://jsonplaceholder.typicode.com/posts",
  header: "Content-Type",
  headerValue: "application/json",
  body: '{"title":"chai","body":"two sugars","userId":1}',
};

/** The address as a URL, if it is a complete web address. */
export function parseUrl(text: string): URL | null {
  try {
    const url = new URL(text.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

/** Wraps text for a shell in single quotes, which stop the shell reading anything inside. */
export const quote = (text: string) => `'${text.replace(/'/g, `'\\''`)}'`;

const plain = /^[A-Za-z0-9:/._~%@+=-]+$/;
const arg = (text: string) => (plain.test(text) ? text : quote(text));

/** The request as the draft describes it, or `null` while the address is not a real one. */
export function requestOf(draft: Draft): ApiRequest | null {
  const url = parseUrl(draft.url);
  if (!url) return null;
  const headers: Record<string, string> = {};
  if (draft.header !== "none" && draft.headerValue.trim() !== "") headers[draft.header] = draft.headerValue.trim();
  const body = hasBody(draft.method) && draft.body !== "" ? draft.body : undefined;
  return { method: draft.method, url: url.href, headers, ...(body === undefined ? {} : { body }) };
}

/** The curl command that sends it. */
export function curlCommand(request: ApiRequest): string {
  const parts = ["curl"];
  const body = request.body;
  // -d on its own already means POST, so the flag is only for the methods curl would not guess.
  if (request.method !== "GET" && !(request.method === "POST" && body !== undefined)) parts.push("-X", request.method);
  for (const [name, value] of Object.entries(request.headers ?? {})) parts.push("-H", quote(`${name}: ${value}`));
  if (body !== undefined) parts.push("-d", quote(body));
  parts.push(arg(request.url));
  return parts.join(" ");
}

/**
 * What goes over the wire, in the article's own `rawRequest`. curl adds a
 * Content-Type of its own when it sends a body and none was given, so that is
 * shown too. It also adds Accept and User-Agent headers, which are left out
 * here to keep the picture short.
 */
export function wireText(request: ApiRequest): string {
  const hasType = Object.keys(request.headers ?? {}).some((name) => name.toLowerCase() === "content-type");
  const headers = { ...request.headers };
  if (request.body !== undefined && !hasType) headers["Content-Type"] = "application/x-www-form-urlencoded";
  return rawRequest({ ...request, headers }).replace(/\r\n/g, "\n");
}
