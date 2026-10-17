import type { ReactNode } from "react";
import { faint, Figure, label } from "./diagrams";

/**
 * The Part 2 (algorithms) diagrams, in the same survey style as the data
 * structure ones: hairlines, plotted points, dimension lines, one accent. They
 * share the frame from `diagrams.tsx`. Each one shows the algorithm stepping,
 * a row at a time, so a reader can follow it with a finger.
 */

type CellKind = "plain" | "hand" | "fresh" | "empty" | "found" | "out";

const cellClass: Record<CellKind, string> = {
  plain: "fill-ground stroke-line",
  hand: "fill-panel stroke-fg-3",
  fresh: "fill-panel-2 stroke-survey",
  empty: "fill-ground stroke-line",
  found: "fill-panel-2 stroke-survey",
  out: "fill-ground stroke-line",
};

/** One row of boxes with a value in each. */
function Cells({
  x,
  y,
  w = 56,
  h = 38,
  size = 16,
  values,
  kind,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  size?: number;
  values: readonly (string | number)[];
  kind: (index: number) => CellKind;
}): ReactNode {
  return (
    <g>
      {values.map((value, i) => {
        const k = kind(i);
        return (
          <g key={i}>
            <rect
              x={x + i * w}
              y={y}
              width={w}
              height={h}
              className={cellClass[k]}
              strokeWidth={k === "fresh" || k === "found" ? 1.5 : 1}
              strokeDasharray={k === "empty" ? "4 3" : undefined}
            />
            {k !== "empty" && (
              <text
                x={x + i * w + w / 2}
                y={y + h / 2 + 5}
                textAnchor="middle"
                fontSize={size}
                className={k === "out" ? "font-mono fill-fg-3" : "font-mono fill-fg"}
              >
                {value}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

/** A line running from one point to another, ending in a small head. */
function Pointer({ x, y1, y2, text }: { x: number; y1: number; y2: number; text?: string }) {
  const down = y2 > y1;
  const tip = y2;
  return (
    <g>
      <line x1={x} x2={x} y1={y1} y2={down ? tip - 7 : tip + 7} className="stroke-survey-2" strokeWidth={1.5} />
      <path
        d={
          down
            ? `M${x - 4} ${tip - 8} L${x} ${tip} L${x + 4} ${tip - 8} Z`
            : `M${x - 4} ${tip + 8} L${x} ${tip} L${x + 4} ${tip + 8} Z`
        }
        className="fill-survey-2"
      />
      {text && (
        <text x={x} y={down ? y1 - 6 : y1 + 15} textAnchor="middle" fontSize={11} className="font-mono fill-survey">
          {text}
        </text>
      )}
    </g>
  );
}

/** Lesson 13: insertion sort, one card at a time, like sorting a hand. */
export function SortingDiagram() {
  const rows: { values: number[]; hand: number; fresh: number; note: string }[] = [
    { values: [4, 2, 5, 1, 3], hand: 1, fresh: -1, note: "start: the hand holds just the 4" },
    { values: [2, 4, 5, 1, 3], hand: 2, fresh: 0, note: "take 2, slide it before the 4" },
    { values: [2, 4, 5, 1, 3], hand: 3, fresh: 2, note: "take 5, it is already in place" },
    { values: [1, 2, 4, 5, 3], hand: 4, fresh: 0, note: "take 1, slide it to the front" },
    { values: [1, 2, 3, 4, 5], hand: 5, fresh: 2, note: "take 3, slot it in the middle" },
  ];
  const left = 40;
  const top = 44;
  const gap = 46;

  return (
    <Figure
      id="sorting"
      title="Insertion sort on 4, 2, 5, 1, 3, one card at a time"
      caption="The sorted hand grows from the left. Each new card (outlined in blue) is slid left until it sits in order. After the last card, the whole row is sorted."
      viewBox="0 0 720 300"
    >
      <text x={left} y={26} fontSize={10} className={faint}>
        THE HAND IS THE LEFT PART
      </text>
      {rows.map((row, r) => (
        <g key={r}>
          <Cells
            x={left}
            y={top + r * gap}
            values={row.values}
            kind={(i) => (i === row.fresh ? "fresh" : i < row.hand ? "hand" : "plain")}
          />
          <text x={left + 5 * 56 + 24} y={top + r * gap + 24} fontSize={12} className={label}>
            {row.note}
          </text>
        </g>
      ))}
    </Figure>
  );
}

/** Lesson 14: binary search narrowing eleven numbers down to the one wanted. */
export function BinarySearchDiagram() {
  const values = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];
  const steps: { lo: number; hi: number; mid: number; note: string }[] = [
    { lo: 0, hi: 11, mid: 5, note: "look at 23: too small" },
    { lo: 6, hi: 11, mid: 8, note: "look at 56: too big" },
    { lo: 6, hi: 8, mid: 7, note: "look at 45: found it" },
  ];
  const left = 20;
  const w = 44;
  const top = 58;
  const gap = 62;

  return (
    <Figure
      id="binary-search"
      title="Binary search for 45 among eleven sorted numbers, in three looks"
      caption="Each look at the middle number rules out half of what is left. Faded boxes are ruled out. Eleven numbers took three looks, and a thousand would take about ten."
      viewBox="0 0 720 270"
    >
      <text x={left} y={28} fontSize={10} className={faint}>
        LOOKING FOR 45
      </text>
      {steps.map((step, r) => {
        const y = top + r * gap;
        return (
          <g key={r}>
            <Cells
              x={left}
              y={y}
              w={w}
              h={36}
              size={14}
              values={values}
              kind={(i) =>
                i < step.lo || i >= step.hi
                  ? "out"
                  : i === step.mid
                    ? r === steps.length - 1
                      ? "found"
                      : "fresh"
                    : "plain"
              }
            />
            <text x={left + 11 * w + 18} y={y + 22} fontSize={12} className={label}>
              {step.note}
            </text>
            <text x={left + step.mid * w + w / 2} y={y + 54} textAnchor="middle" fontSize={11} className="font-mono fill-survey">
              mid
            </text>
          </g>
        );
      })}
    </Figure>
  );
}
