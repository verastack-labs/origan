"use client";

import { useRef, useState, type MouseEvent } from "react";
import { bands, PIECE_MS, PIECES, position, ratingOf, show, WORK_MS } from "@/lib/demos/inp-demo";

/**
 * A button that does slow work before the page can show anything, and a meter
 * for how long the wait was. Pressed as it is, the work blocks the page, so
 * nothing is drawn until it ends. With "Yield to the browser" on, the same work
 * is cut into pieces and the page first shows that it heard the press.
 *
 * What the meter shows is measured here, now: the time from the press to the
 * next frame. It is a demo of the idea, not the reader's INP, and the block says
 * so. The busy waiting is by the clock, so it lasts about as long on any device.
 */
type Mode = "blocking" | "yielding";

const busy = (ms: number) => {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    // Holding the page still, on purpose. This is the slow work.
  }
};

/** Resolves once the browser has drawn a frame: a frame callback runs just before paint, and the timeout after it. */
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

/** Gives the browser a turn to do anything else it has waiting, such as a tap. */
const nextTurn = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const chip =
  "rounded-control border px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.09em] transition-colors";

function Meter({ label, value }: { label: string; value: number | null }) {
  const [good, middle, poor] = bands();
  const rating = value === null ? null : ratingOf(value);

  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-2">{label}</span>
        <span className="font-mono text-[12px] tabular-nums text-fg">
          {value === null ? <span className="text-fg-3">not pressed yet</span> : <>{show(value)} <span className={rating === "poor" ? "text-warn" : "text-survey"}>{rating}</span></>}
        </span>
      </div>
      <div className="relative h-3">
        <div className="flex h-full w-full overflow-hidden border border-line">
          <span className="h-full bg-survey-2/40" style={{ width: `${good}%` }} />
          <span className="h-full bg-fg-3/30" style={{ width: `${middle}%` }} />
          <span className="h-full bg-warn/40" style={{ width: `${poor}%` }} />
        </div>
        {value !== null && (
          <span
            className="st-move absolute -top-1 bottom-[-4px] w-0.5 bg-fg"
            style={{ left: `${position(value)}%` }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export function InpDemo() {
  const [mode, setMode] = useState<Mode>("blocking");
  const [busyNow, setBusyNow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [readings, setReadings] = useState<Record<Mode, number | null>>({ blocking: null, yielding: null });
  const [taps, setTaps] = useState(0);
  const running = useRef(false);

  const yielding = mode === "yielding";

  const record = (from: number, as: Mode) => {
    // Read the clock now. A state updater would run later, after the next piece of work had held the page up.
    const ms = performance.now() - from;
    setReadings((r) => ({ ...r, [as]: ms }));
  };

  async function press(event: MouseEvent) {
    if (running.current) return;
    running.current = true;
    const from = event.nativeEvent.timeStamp;
    const as = mode;
    setSaved(false);
    setBusyNow(true);

    if (as === "blocking") {
      // All the work first, in one go. The page cannot draw, or hear a tap, until it ends.
      busy(WORK_MS);
      setBusyNow(false);
      setSaved(true);
      await nextFrame();
      record(from, as);
    } else {
      // Let the page draw "Saving..." first, then do the work a piece at a time, with a turn for the browser between.
      await nextFrame();
      record(from, as);
      for (let i = 0; i < PIECES; i++) {
        busy(PIECE_MS);
        await nextTurn();
      }
      setBusyNow(false);
      setSaved(true);
    }
    running.current = false;
  }

  return (
    <section aria-label="Slow tap demo" className="stepper my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line-2 px-3 py-2">
        <span className="notation">A slow tap, a demo of the idea</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">Not a measurement of your device</span>
      </div>

      <div className="js-only grid gap-4 px-3 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={yielding}
            onClick={() => setMode(yielding ? "blocking" : "yielding")}
            className={`${chip} ${yielding ? "border-survey bg-survey text-survey-ink" : "border-line text-fg-2 hover:border-survey-2 hover:text-fg"}`}
          >
            Yield to the browser: {yielding ? "on" : "off"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={press}
            className="rounded-control bg-survey px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.09em] text-survey-ink"
          >
            {busyNow ? "Saving..." : saved ? "Saved. Save again" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setTaps((n) => n + 1)}
            className="rounded-control border border-line px-4 py-3 font-mono text-[12px] uppercase tracking-[0.09em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg"
          >
            Tap me: <span className="tabular-nums text-fg">{taps}</span>
          </button>
        </div>
        <p className="text-[13.5px] leading-[1.55] text-fg-3">
          Press Save, then try Tap me straight away. With the work blocking the page, your tap waits for it.
        </p>

        <div className="grid gap-3">
          <Meter label="Work blocks the page" value={readings.blocking} />
          <Meter label="Work yields to the browser" value={readings.yielding} />
          <p className="flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
            <span>0 ms</span>
            <span>good up to 200</span>
            <span>poor above 500</span>
          </p>
        </div>
      </div>

      <div className="js-only border-t border-line-2 bg-ground-2 px-3 py-3 text-[14.5px] leading-[1.6] text-fg-2">
        <p aria-live="polite" aria-atomic="true" className="min-h-[3.2rem]">
          {readings.blocking === null && readings.yielding === null ? (
            <>Pressing Save runs {WORK_MS} ms of work. Press it once as it is, then switch on yielding and press again.</>
          ) : (
            <>
              {readings.blocking !== null && (
                <>
                  Blocking: the page could not draw anything until the work ended, <b className="font-semibold text-fg">{show(readings.blocking)}</b> after
                  your press.{" "}
                </>
              )}
              {readings.yielding !== null && (
                <>
                  Yielding: the same work, in {PIECES} pieces. The page drew a first answer after{" "}
                  <b className="font-semibold text-fg">{show(readings.yielding)}</b>, and stayed ready for taps in between.
                </>
              )}
            </>
          )}
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
          The meter shows press to next frame, measured here just now. It is not your page&apos;s INP.
        </p>
      </div>

      <div className="no-js-only px-3 py-3 text-[14px] leading-[1.6] text-fg-2">
        <p>
          In this demo a Save button does {WORK_MS} ms of work before the page can show anything. Left as it is, the page
          cannot draw until the work ends, so the wait from press to next frame is about {WORK_MS} ms, which is poor. If
          the same work is cut into {PIECES} pieces and the page yields to the browser between them, the page can draw a first
          answer straight away, and stays ready for taps in between. This needs script to try.
        </p>
      </div>
    </section>
  );
}
