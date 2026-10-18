"use client";

import { useState } from "react";
import { captionStyle, Choice } from "../stepper";
import { fit, lvh, PHONE, svh, units, type Bar } from "@/lib/demos/viewport-demo";

/**
 * A phone with an address bar that can be shown or slid away, and two boxes
 * inside its page: one `100vh` and one `100svh`. With the bar showing, the
 * `100vh` box is as tall as the screen would be without it, so its bottom,
 * and the button there, hang off the screen. The `100svh` box always fits, and
 * leaves a little room when the bar is gone. The sizes are made up, in CSS
 * pixels, and only have to agree with each other.
 */
const S = 0.45;
const px = (n: number) => Math.round(n * S);

function Phone({ bar }: { bar: Bar }) {
  const shown = bar === "shown";
  const cut = fit(units(bar).vh, bar).overflow;

  const column = (label: string, height: number, tone: "warn" | "ok") => (
    <div
      className={`relative border ${tone === "warn" ? "border-warn" : "border-survey-2"} bg-panel`}
      style={{ height: px(height), width: "calc(50% - 3px)" }}
    >
      <span className={`absolute left-1 top-1 font-mono text-[10px] font-semibold ${tone === "warn" ? "text-warn" : "text-survey"}`}>
        {label}
      </span>
      <span className="absolute inset-x-1.5 bottom-1.5 flex h-5 items-center justify-center bg-survey font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-survey-ink">
        Buy
      </span>
    </div>
  );

  return (
    <div className="relative mx-auto" style={{ width: px(PHONE.width), paddingBottom: px(PHONE.bar) }}>
      <div
        aria-hidden="true"
        className="relative overflow-hidden border-2 border-fg-3 bg-ground"
        style={{ width: px(PHONE.width), height: px(PHONE.large) }}
      >
        <div
          className="st-move absolute inset-x-0 top-0 z-10 flex items-center justify-center border-b border-survey bg-panel-2 font-mono text-[10px] text-survey"
          style={{ height: px(PHONE.bar), transform: shown ? "none" : "translateY(-100%)" }}
        >
          address bar
        </div>
        <div
          className="st-move absolute inset-x-0 flex justify-between px-1"
          style={{ top: shown ? px(PHONE.bar) : 0 }}
        >
          {column("100vh", units(bar).vh, "warn")}
          {column("100svh", units(bar).svh, "ok")}
        </div>
      </div>

      {/* The part of the 100vh box that does not fit, drawn below the screen. */}
      <div
        aria-hidden="true"
        className="st-move absolute left-1 border border-dashed border-warn"
        style={{
          top: px(PHONE.large),
          width: `calc(50% - 8px)`,
          height: shown ? px(cut) : 0,
          opacity: shown ? 1 : 0,
          borderTopWidth: 0,
        }}
      >
        <span className="absolute inset-x-0 top-1 text-center font-mono text-[9px] uppercase tracking-[0.06em] text-warn">cut off</span>
      </div>
    </div>
  );
}

export function ViewportDemo() {
  const [bar, setBar] = useState<Bar>("shown");
  const u = units(bar);
  const big = fit(u.vh, bar);
  const small = fit(u.svh, bar);

  return (
    <section aria-label="Phone viewport demo" className="stepper my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line-2 px-3 py-2">
        <span className="notation">One phone, two heights</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">Made-up sizes, in CSS pixels</span>
      </div>

      <div className="js-only border-b border-line-2 px-3 py-3">
        <Choice
          label="Address bar"
          options={["shown", "hidden"] as const}
          value={bar}
          onChange={setBar}
          format={(b) => (b === "shown" ? "Shown" : "Hidden")}
        />
      </div>

      <div className="js-only grid items-center gap-5 px-3 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Phone bar={bar} />

        <div>
          <dl className="m-0 grid gap-3 font-mono text-[12px]">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.1em] text-fg-3">What you can see</dt>
              <dd className="m-0 tabular-nums text-fg">{bar === "shown" ? svh : lvh}px tall</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.1em] text-fg-3">100vh box is {u.vh}px</dt>
              <dd className={`m-0 ${big.overflow > 0 ? "text-warn" : "text-survey"}`}>
                {big.overflow > 0 ? `${big.overflow}px too tall: its bottom is cut off` : "fits exactly"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.1em] text-fg-3">100svh box is {u.svh}px</dt>
              <dd className="m-0 text-survey">
                {small.spare > 0 ? `fits, with ${small.spare}px of room spare` : "fits exactly"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={`js-only border-t border-line-2 bg-ground-2 px-3 py-3 text-[14.5px] leading-[1.6] text-fg-2 ${captionStyle}`}>
        <p aria-live="polite" aria-atomic="true" className="min-h-[4.8rem] sm:min-h-[3.2rem]">
          {bar === "shown" ? (
            <>
              The address bar is showing, as it is when a page first loads. A <code>100vh</code> box is measured as if the bar
              were gone, so it is {big.overflow}px too tall, and the Buy button at its bottom is out of sight. A{" "}
              <code>100svh</code> box is measured with the bar showing, so it fits.
            </>
          ) : (
            <>
              The bar has slid away, as it does when you scroll. Now the <code>100vh</code> box fits exactly. The{" "}
              <code>100svh</code> box stays the same size, so it leaves {small.spare}px of room below it. That is the small
              price of a box that never changes size.
            </>
          )}
        </p>
      </div>

      <div className={`no-js-only px-3 py-3 text-[14px] leading-[1.6] text-fg-2 ${captionStyle}`}>
        <p>
          With the address bar showing, the visible area is {svh}px tall. A <code>100vh</code> box is {lvh}px, so it is{" "}
          {fit(lvh, "shown").overflow}px too tall, and its bottom is cut off. A <code>100svh</code> box is {svh}px and fits.
          With the bar gone, the visible area is {lvh}px: the <code>100vh</code> box fits exactly, and the{" "}
          <code>100svh</code> box leaves {fit(svh, "hidden").spare}px spare. The sizes are made up. This needs script to try.
        </p>
      </div>
    </section>
  );
}
