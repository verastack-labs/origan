"use client";

import { useState } from "react";
import { captionStyle, Choice } from "../stepper";
import { GLOSS, longDate, type Article } from "@/lib/demos/json-ld-lens";

/**
 * The same page two ways. As a reader sees it, the title, the author and the
 * dates are told apart by size and by words like "By", and a program has to
 * guess. As the JSON-LD behind it, each fact sits in a labelled box. The
 * toggle swaps one for the other with a short fade, which stops under reduced
 * motion. Without script, both are shown, one after the other.
 */
type View = "reader" | "labels";

function Reader({ data }: { data: Article }) {
  return (
    <div className="border border-line bg-ground px-4 py-5">
      <p className="notation">Technical article</p>
      <p className="mt-2 text-[clamp(20px,3vw,26px)] font-bold leading-[1.15] tracking-[-0.03em] text-fg">{data.headline}</p>
      <p className="mt-3 font-mono text-[12px] text-fg-2">By {data.author.name}</p>
      <p className="mt-1 font-mono text-[12px] text-fg-3">
        Published {longDate(data.datePublished)} · Last checked {longDate(data.dateModified)}
      </p>
      <p className="mt-4 text-[14px] leading-[1.6] text-fg-2">
        A person tells the title from the author by size and by the word &quot;By&quot;, and the two dates by what is written
        beside them. A program has to guess all of that.
      </p>
    </div>
  );
}

/** One line of pretty-printed JSON, with the names picked out. */
function Line({ text }: { text: string }) {
  const m = /^(\s*)("(?:[^"\\]|\\.)*")(:\s?)(.*)$/.exec(text);
  if (!m) return <span className="text-fg-3">{text}</span>;
  return (
    <>
      {m[1]}
      <span className="text-survey">{m[2]}</span>
      <span className="text-fg-3">{m[3]}</span>
      <span className="text-fg">{m[4]}</span>
    </>
  );
}

function Labels({ data }: { data: Article }) {
  const lines = JSON.stringify(data, null, 2).split("\n");
  return (
    <div className="grid gap-3">
      <pre className="m-0 overflow-x-auto border border-line bg-ground px-3 py-3 font-mono text-[12.5px] leading-[1.7]" tabIndex={0}>
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block whitespace-pre">
              <Line text={line} />
            </span>
          ))}
        </code>
      </pre>
      <dl className="m-0 grid gap-x-4 gap-y-1.5 text-[14px] leading-snug sm:grid-cols-[max-content_minmax(0,1fr)]">
        {Object.keys(data).map((key) => (
          <div key={key} className="contents">
            <dt className="font-mono text-[12px] text-survey">{key}</dt>
            <dd className="m-0 mb-1.5 text-fg-2 sm:mb-0">{GLOSS[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function JsonLdLensView({ data }: { data: Article }) {
  const [view, setView] = useState<View>("reader");

  return (
    <section aria-label="The same page, two ways" className="stepper my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line-2 px-3 py-2">
        <span className="notation">The same page, two ways</span>
      </div>

      <div className="js-only border-b border-line-2 px-3 py-3">
        <Choice
          label="Show"
          options={["reader", "labels"] as const}
          value={view}
          onChange={setView}
          format={(v) => (v === "reader" ? "What a reader sees" : "What a search engine reads")}
        />
      </div>

      <div className={`js-only px-3 py-4 ${captionStyle}`}>
        <div key={view} className="article-arrive">
          {view === "reader" ? <Reader data={data} /> : <Labels data={data} />}
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {view === "reader" ? "Showing the page as a reader sees it." : "Showing the JSON-LD behind the page."}
      </div>

      <div className="no-js-only grid gap-4 px-3 py-4">
        <Reader data={data} />
        <Labels data={data} />
      </div>
    </section>
  );
}
