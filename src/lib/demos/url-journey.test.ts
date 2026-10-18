import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { GROUPS, STAGES } from "./url-journey";

const article = readFileSync(
  join(process.cwd(), "src", "content", "learn", "off-the-syllabus", "typing-a-url.mdx"),
  "utf8",
);
const dash = String.fromCharCode(0x2014);

describe("the URL journey stages", () => {
  it("are the seven the article walks through, in its order", () => {
    expect(STAGES.map((s) => s.id)).toEqual(["dns", "tcp", "tls", "request", "response", "parse", "render"]);
  });

  it("follow the article's own headings in the same order", () => {
    const at = (text: string) => article.indexOf(text);
    const marks = ["## Step 1: DNS", "## Step 2: connecting", "## Step 3: the request and the reply", "## Step 4: from HTML to pixels"];
    const found = marks.map(at);
    expect(found.every((i) => i > 0)).toBe(true);
    expect([...found].sort((a, b) => a - b)).toEqual(found);
    // And what each stage is about is named in the article.
    for (const word of ["DNS", "TCP", "TLS", "request", "TTFB", "DOM", "CSSOM", "render tree", "layout", "paint"]) {
      expect(article, word).toContain(word);
    }
  });

  it("line up with the stations of the diagram: DNS, Connect, Request, Response, Render", () => {
    expect(STAGES.map((s) => s.station)).toEqual([1, 2, 2, 3, 4, 5, 5]);
    // Walking the stages never goes back a station.
    for (let i = 1; i < STAGES.length; i++) expect(STAGES[i].station).toBeGreaterThanOrEqual(STAGES[i - 1].station);
  });

  it("group the way the diagram does: three to set up the road, two with the server, two in the browser", () => {
    const count = (g: string) => STAGES.filter((s) => s.group === g).length;
    expect([count("road"), count("server"), count("browser")]).toEqual([3, 2, 2]);
    expect(Object.keys(GROUPS)).toEqual(["road", "server", "browser"]);
  });

  it("describe the TCP handshake as three messages, as the article does", () => {
    expect(STAGES.find((s) => s.id === "tcp")?.caption).toContain("three short messages");
    expect(article).toContain("SYN-ACK");
  });

  it("use no em dash", () => {
    for (const s of STAGES) expect(JSON.stringify(s)).not.toContain(dash);
  });
});
