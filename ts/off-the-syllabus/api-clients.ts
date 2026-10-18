// Article 8: API clients compared. The page text is
// src/content/learn/off-the-syllabus/api-clients.mdx.
//
// Every tool in the article, from Postman to curl, does the same job: it
// builds an HTTP request, sends it, and shows you the reply. This is that
// first step written out, so you can see what the forms and flags become.

// region: request
export type ApiRequest = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
};

// An HTTP/1.1 request is a start line, some headers, an empty line, and an
// optional body. Lines end in a carriage return and a line feed.
export function rawRequest(request: ApiRequest): string {
  const url = new URL(request.url);
  const headers: Record<string, string> = { Host: url.host, ...request.headers };
  if (request.body !== undefined) {
    // The length is in bytes, which is not always the number of characters.
    headers["Content-Length"] = String(new TextEncoder().encode(request.body).length);
  }

  const head = [
    `${request.method.toUpperCase()} ${url.pathname}${url.search} HTTP/1.1`,
    ...Object.entries(headers).map(([name, value]) => `${name}: ${value}`),
  ];
  return `${head.join("\r\n")}\r\n\r\n${request.body ?? ""}`;
}
// endregion

// region: example
// The request a client builds for the second curl command in the article.
export const example: ApiRequest = {
  method: "POST",
  url: "https://jsonplaceholder.typicode.com/posts",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: '{"title":"chai","body":"two sugars","userId":1}',
};
// endregion
