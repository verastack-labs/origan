/**
 * The stages of the "What happens when you type a URL" stepper. They are the
 * article's own steps, in the article's order, with the same three groups the
 * diagram above them draws ("setting up the road", "waiting for the server",
 * "the browser"). The article's diagram has six stations; two of them hold two
 * stages here (Connect is TCP then TLS, and Render is parsing then drawing), so
 * each stage also says which station of that diagram it belongs to.
 *
 * `url-journey.test.ts` holds these to the article: every stage is named in its
 * text, the order matches, and the stations line up with the diagram.
 */
export type Stage = {
  id: "dns" | "tcp" | "tls" | "request" | "response" | "parse" | "render";
  /** Short name on the strip. */
  name: string;
  /** A few words under it. */
  sub: string;
  group: "road" | "server" | "browser";
  /** The station of the article's diagram this stage sits in: 1 DNS, 2 Connect, 3 Request, 4 Response, 5 Render. */
  station: 1 | 2 | 3 | 4 | 5;
  /** What happens, in plain words. */
  caption: string;
};

export const GROUPS = {
  road: "Setting up the road",
  server: "Waiting for the server",
  browser: "The browser",
} as const;

export const STAGES: readonly Stage[] = [
  {
    id: "dns",
    name: "DNS",
    sub: "name to number",
    group: "road",
    station: 1,
    caption:
      "The browser has a name, but computers find each other by number. DNS is the address book: it turns the name into an IP address. Nothing has been fetched yet.",
  },
  {
    id: "tcp",
    name: "TCP",
    sub: "open the line",
    group: "road",
    station: 2,
    caption:
      "Now the browser opens a line to that address. The TCP handshake is three short messages: hello, hello back, good. TCP makes sure what is sent arrives complete and in order.",
  },
  {
    id: "tls",
    name: "TLS",
    sub: "make it private",
    group: "road",
    station: 2,
    caption:
      "The address began with https, so the two sides now make the line private. They agree on a version and a secret key, and the server proves who it is with a certificate. From here, everything is encrypted.",
  },
  {
    id: "request",
    name: "Request",
    sub: "ask for the page",
    group: "server",
    station: 3,
    caption: "At last the browser asks for the page. A request is a few lines of text: GET, the path, and a Host header.",
  },
  {
    id: "response",
    name: "Response",
    sub: "HTML comes back",
    group: "server",
    station: 4,
    caption:
      "The server answers in the same shape: 200 OK, some headers, and then the page's HTML. The wait until the first piece arrives is called Time to First Byte.",
  },
  {
    id: "parse",
    name: "Parse",
    sub: "HTML to trees",
    group: "browser",
    station: 5,
    caption:
      "The browser starts reading the HTML as it arrives. It builds the DOM, a tree of the tags, and the CSSOM, a tree of the style rules. Together they make the render tree: only what will be drawn.",
  },
  {
    id: "render",
    name: "Render",
    sub: "layout and paint",
    group: "browser",
    station: 5,
    caption:
      "Layout works out the size and place of every box. Paint draws them as pixels. That is the second you waited for. If the browser had held a fresh copy of the page, the first five stages would have been skipped.",
  },
];
