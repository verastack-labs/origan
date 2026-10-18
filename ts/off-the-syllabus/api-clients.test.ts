import { describe, expect, it } from "vitest";
import { example, rawRequest } from "./api-clients";

describe("rawRequest", () => {
  it("writes a GET as a start line, a Host header, and an empty line", () => {
    expect(rawRequest({ method: "get", url: "https://api.github.com/zen" })).toBe(
      "GET /zen HTTP/1.1\r\nHost: api.github.com\r\n\r\n",
    );
  });

  it("keeps the query string in the request target", () => {
    const text = rawRequest({ method: "GET", url: "https://example.com/search?q=chai&page=2" });
    expect(text.split("\r\n")[0]).toBe("GET /search?q=chai&page=2 HTTP/1.1");
  });

  it("adds the headers it was given, and a Content-Length for a body", () => {
    expect(rawRequest(example)).toBe(
      [
        "POST /posts HTTP/1.1",
        "Host: jsonplaceholder.typicode.com",
        "Content-Type: application/json",
        "Accept: application/json",
        "Content-Length: 47",
        "",
        '{"title":"chai","body":"two sugars","userId":1}',
      ].join("\r\n"),
    );
  });

  it("counts the length of a body in bytes, not characters", () => {
    const text = rawRequest({ method: "POST", url: "https://example.com/", body: "chai ☕" });
    // "chai " is 5 bytes and the cup is 3.
    expect(text).toContain("Content-Length: 8\r\n");
  });

  it("keeps a port in the Host header", () => {
    expect(rawRequest({ method: "GET", url: "http://localhost:4800/x" })).toContain("Host: localhost:4800\r\n");
  });

  it("has the empty line that ends the headers even with no body", () => {
    expect(rawRequest({ method: "GET", url: "https://example.com/" }).endsWith("\r\n\r\n")).toBe(true);
  });
});
