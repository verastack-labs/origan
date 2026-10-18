"use client";

import { useEffect, useState } from "react";
import { AD_H, adShift, CONTENT_W, FRAME, GAP, layout, type Box } from "@/lib/demos/cls-demo";

/**
 * A small mock page where an ad arrives late and the Pay button jumps. A
 * switch reserves the ad's space, and then nothing moves. The page is drawn
 * from the same numbers that are scored (`lib/demos/cls-demo.ts`), and the
 * score is the article's own formula, so the picture and the number agree.
 *
 * It is a demo of the idea: made-up sizes, nothing measured from a real page
 * or from the reader's device, and it says so on the block.
 */
type Phase = "idle" | "page" | "ad";

const button =
  "rounded-control border border-line px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.09em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg aria-disabled:cursor-default aria-disabled:opacity-45";

const f2 = (n: number) => n.toFixed(2);

function Mock({ phase, reserved }: { phase: Phase; reserved: boolean }) {
  const boxes = layout({ adArrived: phase === "ad", reserved });
  const at = (id: Box["id"]) => boxes.find((b) => b.id === id) as Box;
  const placed = (b: Box) => ({ top: b.y, height: b.h, left: 16, width: CONTENT_W });
  const was = layout({ adArrived: false, reserved }).find((b) => b.id === "pay") as Box;

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto overflow-hidden border border-line bg-ground"
      style={{ width: FRAME.w, height: FRAME.h }}
    >
      {phase === "idle" ? (
        <p className="absolute inset-0 flex items-center justify-center px-8 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3">
          Press Load the page
        </p>
      ) : (
        <>
          <div className="absolute inset-x-0 top-0 flex items-center bg-panel-2 px-4 font-mono text-[12px] text-fg-2" style={{ height: at("header").h }}>
            Train tickets
          </div>
          <div className="absolute flex items-center text-[19px] font-bold tracking-[-0.02em] text-fg" style={{ ...placed(at("title")) }}>
            Pick your seat
          </div>

          {/* The ad: it holds its place from the start if the space was reserved, and arrives later either way. */}
          {(reserved || phase === "ad") && (
            <div
              className={`absolute flex items-center justify-center border font-mono text-[11px] uppercase tracking-[0.08em] ${
                phase === "ad" ? "border-survey-2 bg-panel text-survey" : "border-dashed border-line text-fg-3"
              }`}
              style={placed(at("ad"))}
            >
              {phase === "ad" ? "Offer: 10% off" : "Space for an ad"}
            </div>
          )}

          <div className="absolute border border-line bg-panel px-3 py-2 text-[13px] leading-snug text-fg-2" style={placed(at("seat"))}>
            <b className="text-fg">Coach B2, seat 31</b>
            <br />
            Window side. 5:40 pm to 9:15 pm.
          </div>

          <div
            className="absolute flex items-center justify-center bg-survey font-mono text-[12px] font-semibold uppercase tracking-[0.09em] text-survey-ink"
            style={placed(at("pay"))}
          >
            Pay now
          </div>
          <div
            className="absolute flex items-center justify-center border border-line font-mono text-[11px] uppercase tracking-[0.09em] text-fg-2"
            style={placed(at("cancel"))}
          >
            Cancel
          </div>

          {/* Where the reader's thumb is already heading. It does not move. */}
          <span
            className="absolute h-6 w-6 rounded-full border-2 border-warn"
            style={{ left: FRAME.w / 2 - 12, top: was.y + was.h / 2 - 12 }}
          />
        </>
      )}
    </div>
  );
}

export function ClsDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reserved, setReserved] = useState(false);

  // The ad arrives a moment after the page, which is the whole problem.
  useEffect(() => {
    if (phase !== "page") return;
    const id = window.setTimeout(() => setPhase("ad"), 1100);
    return () => window.clearTimeout(id);
  }, [phase]);

  const shift = adShift(reserved);
  const pushed = AD_H + GAP;

  return (
    <section aria-label="Layout shift demo" className="stepper my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line-2 px-3 py-2">
        <span className="notation">Layout shift, a demo of the idea</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">Made-up sizes, not a measurement</span>
      </div>

      <div className="js-only flex flex-wrap items-center gap-2 border-b border-line-2 px-3 py-3">
        <button type="button" onClick={() => setPhase("page")} aria-disabled={phase === "page"} className={button}>
          Load the page
        </button>
        <button type="button" onClick={() => setPhase("idle")} aria-disabled={phase === "idle"} className={button}>
          Replay
        </button>
        <button
          type="button"
          aria-pressed={reserved}
          onClick={() => {
            setReserved((r) => !r);
            setPhase("idle");
          }}
          className={`min-h-9 rounded-control border px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.09em] transition-colors ${
            reserved ? "border-survey bg-survey text-survey-ink" : "border-line text-fg-2 hover:border-survey-2 hover:text-fg"
          }`}
        >
          Reserve the space: {reserved ? "on" : "off"}
        </button>
      </div>

      <div className="js-only px-3 py-4">
        <Mock phase={phase} reserved={reserved} />
      </div>

      <div className="js-only border-t border-line-2 bg-ground-2 px-3 py-3">
        <div aria-live="polite" aria-atomic="true" className="min-h-[5.5rem] text-[14.5px] leading-[1.6] text-fg-2 [&_b]:font-semibold [&_b]:text-fg">
          {phase === "idle" && (
            <p>
              A booking page with an ad that loads late. Press <b>Load the page</b>, then watch the <b>Pay now</b> button. The
              ring is where your thumb is heading.
            </p>
          )}
          {phase === "page" && <p>The page is up, and the ad is still on its way.</p>}
          {phase === "ad" &&
            (reserved ? (
              <p>
                The ad arrived, and it fitted in the space that was kept for it. Nothing moved. The layout shift score is{" "}
                <b>{f2(shift.score)}</b>, which is <b>{shift.rating}</b>.
              </p>
            ) : (
              <p>
                The ad arrived, and had no space of its own, so it pushed everything below it down by {pushed} pixels. Your
                thumb lands on the seat card, not on Pay. The score is the share of the screen that moved,{" "}
                <b>{f2(shift.impact)}</b>, times how far it went, <b>{f2(shift.distance)}</b>, which is <b>{f2(shift.score)}</b>:{" "}
                <b>{shift.rating}</b>. Now switch on <b>Reserve the space</b> and replay.
              </p>
            ))}
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
          The score uses the formula above, with made-up sizes. It is not your page, or your device.
        </p>
      </div>

      {/* No script: both outcomes, in words. */}
      <div className="no-js-only px-3 py-3 text-[14px] leading-[1.6] text-fg-2">
        <p>
          A booking page has an ad that loads late. With no space kept for it, the ad pushes the Pay button down by {pushed}{" "}
          pixels, and the layout shift score is {f2(adShift(false).score)} ({adShift(false).rating}). With the space reserved
          in advance, nothing moves, and the score is {f2(adShift(true).score)} ({adShift(true).rating}). The sizes are
          made up; the score uses the formula in this article.
        </p>
      </div>
    </section>
  );
}
