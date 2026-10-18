import { describe, expect, it } from "vitest";
import { example } from "../../../ts/off-the-syllabus/api-clients";
import { curlCommand, hasBody, parseUrl, quote, requestOf, START, wireText, type Draft } from "./curl";

const draft = (over: Partial<Draft>): Draft => ({ ...START, ...over });

describe("the build-a-request block", () => {
  it("starts as the request the article builds for its second curl command", () => {
    const request = requestOf(START);
    expect(request).toEqual({ ...example, headers: { "Content-Type": "application/json" } });
    expect(request?.body).toBe(example.body);
    expect(request?.url).toBe(example.url);
  });

  it("writes a plain GET as curl and the address, the way the article's first command does", () => {
    const request = requestOf(draft({ method: "GET", url: "https://api.github.com/zen", header: "none" }));
    expect(request && curlCommand(request)).toBe("curl https://api.github.com/zen");
  });

  it("lets a body stand for POST, and names the methods curl would not guess", () => {
    expect(curlCommand(requestOf(START)!)).toBe(
      `curl -H 'Content-Type: application/json' -d '{"title":"chai","body":"two sugars","userId":1}' https://jsonplaceholder.typicode.com/posts`,
    );
    expect(curlCommand(requestOf(draft({ method: "POST", body: "", header: "none" }))!)).toBe(
      "curl -X POST https://jsonplaceholder.typicode.com/posts",
    );
    expect(curlCommand(requestOf(draft({ method: "DELETE", header: "none" }))!)).toBe(
      "curl -X DELETE https://jsonplaceholder.typicode.com/posts",
    );
    expect(curlCommand(requestOf(draft({ method: "PUT", header: "none", body: "x" }))!)).toBe(
      "curl -X PUT -d 'x' https://jsonplaceholder.typicode.com/posts",
    );
  });

  it("only sends a body with POST and PUT", () => {
    expect(hasBody("POST") && hasBody("PUT")).toBe(true);
    expect(hasBody("GET") || hasBody("DELETE")).toBe(false);
    expect(requestOf(draft({ method: "GET" }))?.body).toBeUndefined();
  });

  it("quotes for a shell, including a single quote inside the text", () => {
    expect(quote("it's")).toBe(`'it'\\''s'`);
    const request = requestOf(draft({ method: "GET", url: "https://example.com/search?q=chai&page=2", header: "none" }));
    expect(request && curlCommand(request)).toBe("curl 'https://example.com/search?q=chai&page=2'");
  });

  it("is null until the address is a complete web address", () => {
    expect(parseUrl("example.com")).toBeNull();
    expect(parseUrl("ftp://example.com/")).toBeNull();
    expect(parseUrl("  https://example.com/x ")?.pathname).toBe("/x");
    expect(requestOf(draft({ url: "not a url" }))).toBeNull();
  });

  it("shows the wire text with a Host header, the chosen header and a Content-Length", () => {
    const text = wireText(requestOf(START)!);
    expect(text).toBe(
      [
        "POST /posts HTTP/1.1",
        "Host: jsonplaceholder.typicode.com",
        "Content-Type: application/json",
        "Content-Length: 47",
        "",
        '{"title":"chai","body":"two sugars","userId":1}',
      ].join("\n"),
    );
  });

  it("adds the Content-Type curl adds itself when a body is sent without one", () => {
    const text = wireText(requestOf(draft({ header: "none", body: "a=1" }))!);
    expect(text).toContain("Content-Type: application/x-www-form-urlencoded\n");
    expect(text).toContain("Content-Length: 3\n");
  });

  it("ignores a header whose value is empty", () => {
    expect(requestOf(draft({ headerValue: "  " }))?.headers).toEqual({});
  });
});
