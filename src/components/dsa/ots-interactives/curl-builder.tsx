"use client";

import { useId, useState } from "react";
import { Choice } from "../stepper";
import { CopyButton } from "../copy-button";
import {
  curlCommand,
  HEADER_DEFAULTS,
  HEADER_NAMES,
  hasBody,
  METHODS,
  requestOf,
  START,
  wireText,
  type Draft,
  type HeaderName,
} from "@/lib/demos/curl";

/**
 * "Build a request": a method, an address, one header and a body, shown as the
 * curl command that sends it and as the text that goes over the wire. It
 * sends nothing, and says so on the block. The wire text is written by the
 * article's own `rawRequest`.
 */
const field =
  "w-full min-w-0 rounded-control border border-line bg-ground px-3 py-2 font-mono text-[13px] text-fg placeholder:text-fg-3 focus-visible:border-survey";

function Output({ title, text, hint }: { title: string; text: string; hint: string }) {
  return (
    <div className="min-w-0 border border-line bg-ground">
      <div className="flex items-center justify-between gap-2 border-b border-line-2 px-3 py-1.5">
        <span className="notation">{title}</span>
        <CopyButton code={text} hint={hint} />
      </div>
      <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-all px-3 py-3 font-mono text-[12.5px] leading-[1.6] text-fg" tabIndex={0}>
        {text}
      </pre>
    </div>
  );
}

export function CurlBuilder() {
  const [draft, setDraft] = useState<Draft>(START);
  const ids = { url: useId(), name: useId(), value: useId(), body: useId() };
  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  const request = requestOf(draft);

  return (
    <section aria-label="Build a request" className="stepper my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line-2 px-3 py-2">
        <span className="notation">Build a request</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">Nothing is sent</span>
      </div>

      <div className="js-only grid gap-4 px-3 py-4">
        <Choice label="Method" options={METHODS} value={draft.method} onChange={(method) => set({ method })} />

        <div className="grid gap-1.5">
          <label htmlFor={ids.url} className="notation">
            Address
          </label>
          <input
            id={ids.url}
            type="url"
            inputMode="url"
            spellCheck={false}
            autoCapitalize="off"
            value={draft.url}
            onChange={(e) => set({ url: e.target.value })}
            className={field}
          />
        </div>

        <div className="grid gap-1.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-x-3">
          <div className="grid gap-1.5">
            <label htmlFor={ids.name} className="notation">
              One header
            </label>
            <select
              id={ids.name}
              value={draft.header}
              onChange={(e) => {
                const header = e.target.value as HeaderName;
                set({ header, headerValue: HEADER_DEFAULTS[header] });
              }}
              className={field}
            >
              {HEADER_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name === "none" ? "None" : name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={ids.value} className="notation">
              Its value
            </label>
            <input
              id={ids.value}
              type="text"
              spellCheck={false}
              disabled={draft.header === "none"}
              value={draft.headerValue}
              onChange={(e) => set({ headerValue: e.target.value })}
              className={`${field} disabled:opacity-45`}
            />
          </div>
        </div>

        {hasBody(draft.method) && (
          <div className="grid gap-1.5">
            <label htmlFor={ids.body} className="notation">
              Body
            </label>
            <textarea
              id={ids.body}
              rows={2}
              spellCheck={false}
              value={draft.body}
              onChange={(e) => set({ body: e.target.value })}
              className={`${field} resize-y`}
            />
          </div>
        )}
      </div>

      <div className="border-t border-line-2 bg-ground-2 px-3 py-3">
        {request ? (
          <div className="grid gap-3">
            <Output title="The curl command" text={curlCommand(request)} hint="curl command" />
            <Output title="What goes over the wire" text={wireText(request)} hint="request text" />
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
              Simplified: curl also adds its own Accept and User-Agent headers. This is not a real network call.
            </p>
          </div>
        ) : (
          <p className="text-[14.5px] leading-[1.6] text-fg-2">
            Type a complete address, starting with <code className="rounded-control bg-panel-2 px-1 font-mono text-[0.9em] text-fg">https://</code>,
            and the command appears here.
          </p>
        )}
      </div>
    </section>
  );
}
