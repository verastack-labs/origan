import type { ReactNode } from "react";

/**
 * The lesson diagrams, in the site's survey style: hairlines, plotted points,
 * dimension lines, one accent. Inline SVG, so there is nothing to load, and
 * every colour is a token so they follow the dark and light palettes.
 */
function Figure({
  id,
  title,
  caption,
  viewBox,
  children,
}: {
  id: string;
  title: string;
  caption: string;
  viewBox: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <svg
        viewBox={viewBox}
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        className="block h-auto w-full"
      >
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{caption}</desc>
        {children}
      </svg>
      <figcaption className="border-t border-line-2 px-4 py-3 text-[14px] text-fg-2">{caption}</figcaption>
    </figure>
  );
}

const label = "font-mono fill-fg-2";
const faint = "font-mono fill-fg-3";

/** A dimension line: a rule between two ticks, with its reading above. */
function Dimension({ x1, x2, y, text }: { x1: number; x2: number; y: number; text: string }) {
  return (
    <g className="stroke-survey-2" strokeWidth={1}>
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <line x1={x1} x2={x1} y1={y - 5} y2={y + 5} />
      <line x1={x2} x2={x2} y1={y - 5} y2={y + 5} />
      <text
        x={(x1 + x2) / 2}
        y={y - 9}
        textAnchor="middle"
        fontSize={12}
        className="font-mono fill-survey stroke-none"
      >
        {text}
      </text>
    </g>
  );
}

/** Lesson 0: the loop a reader will repeat all course. */
export function SetupDiagram() {
  const stations = [
    { x: 100, top: "cargo new", bottom: "makes the project" },
    { x: 360, top: "edit src/lib.rs", bottom: "write a function and a test" },
    { x: 620, top: "cargo test", bottom: "compiles, runs, reports" },
  ];

  return (
    <Figure
      id="setup"
      title="The loop: make a project, write code, run the tests"
      caption="The loop you will repeat in every lesson: make a project once, then write code and run the tests."
      viewBox="0 0 720 190"
    >
      <line x1={100} x2={620} y1={90} y2={90} className="stroke-survey-2" strokeWidth={1.5} />
      {stations.map((s, i) => (
        <g key={s.x}>
          <circle cx={s.x} cy={90} r={7} className="fill-panel stroke-survey" strokeWidth={1.5} />
          <text x={s.x} y={58} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
            {s.top}
          </text>
          <text x={s.x} y={124} textAnchor="middle" fontSize={12} className={label}>
            {s.bottom}
          </text>
          <text x={s.x} y={148} textAnchor="middle" fontSize={10} className={faint}>
            {`STATION ${i + 1}`}
          </text>
        </g>
      ))}
      {/* The way back: run again after every edit. */}
      <path
        d="M620 97 C 620 176, 360 176, 360 98"
        fill="none"
        strokeDasharray="4 4"
        className="stroke-fg-3"
        strokeWidth={1}
      />
    </Figure>
  );
}

/** Lesson 1: slots in a row, with how many are used and how many exist. */
export function ArrayDiagram() {
  const left = 56;
  const w = 76;
  const used = [10, 20, 30, 40, 50];

  return (
    <Figure
      id="array"
      title="Eight slots in a row, five of them in use"
      caption="A Vec is a row of slots. len counts the slots in use, and capacity counts the slots it has room for."
      viewBox="0 0 720 210"
    >
      <Dimension x1={left} x2={left + used.length * w} y={44} text="len = 5" />
      {Array.from({ length: 8 }, (_, i) => {
        const x = left + i * w;
        const filled = i < used.length;
        return (
          <g key={i}>
            <rect
              x={x}
              y={62}
              width={w}
              height={52}
              className={filled ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
              strokeWidth={filled ? 1.5 : 1}
              strokeDasharray={filled ? undefined : "4 3"}
            />
            {filled && (
              <text x={x + w / 2} y={94} textAnchor="middle" fontSize={16} className="font-mono fill-fg">
                {used[i]}
              </text>
            )}
            <line x1={x + w / 2} x2={x + w / 2} y1={114} y2={121} className="stroke-fg-3" strokeWidth={1} />
            <text x={x + w / 2} y={137} textAnchor="middle" fontSize={12} className={faint}>
              {i}
            </text>
          </g>
        );
      })}
      <text x={left} y={160} fontSize={10} className={faint}>
        INDEX
      </text>
      <Dimension x1={left} x2={left + 8 * w} y={190} text="capacity = 8" />
    </Figure>
  );
}

/** Lesson 2: the same word as characters and as bytes. */
export function BytesDiagram() {
  const left = 120;
  const w = 80;
  const chars = [
    { c: "h", bytes: 1 },
    { c: "é", bytes: 2 },
    { c: "l", bytes: 1 },
    { c: "l", bytes: 1 },
    { c: "o", bytes: 1 },
  ];
  const hex = ["68", "c3", "a9", "6c", "6c", "6f"];
  let at = 0;

  return (
    <Figure
      id="bytes"
      title={'The word "héllo" as five characters and six bytes'}
      caption={'"héllo" has five characters but six bytes, because é takes two. A slice cannot end at byte 2, because that cuts é in half.'}
      viewBox="0 0 720 230"
    >
      <text x={24} y={64} fontSize={11} className={faint}>
        CHARS
      </text>
      <text x={24} y={134} fontSize={11} className={faint}>
        BYTES
      </text>
      {chars.map((ch, i) => {
        const x = left + at * w;
        const width = ch.bytes * w;
        at += ch.bytes;
        return (
          <g key={i}>
            <rect x={x} y={36} width={width} height={42} className="fill-panel-2 stroke-survey" strokeWidth={1.5} />
            <text x={x + width / 2} y={64} textAnchor="middle" fontSize={20} className="font-mono fill-fg">
              {ch.c}
            </text>
          </g>
        );
      })}
      {hex.map((h, i) => {
        const x = left + i * w;
        return (
          <g key={i}>
            <rect
              x={x}
              y={106}
              width={w}
              height={42}
              className="fill-ground stroke-line"
              strokeWidth={1}
            />
            <text x={x + w / 2} y={133} textAnchor="middle" fontSize={15} className="font-mono fill-fg-2">
              {h}
            </text>
            <text x={x + w / 2} y={168} textAnchor="middle" fontSize={12} className={faint}>
              {i}
            </text>
          </g>
        );
      })}
      {/* The cut that a slice ending at 2 would make: through the middle of é. */}
      <line
        x1={left + 2 * w}
        x2={left + 2 * w}
        y1={30}
        y2={186}
        strokeDasharray="5 4"
        className="stroke-warn"
        strokeWidth={1.4}
      />
      <text x={left + 2 * w} y={208} textAnchor="middle" fontSize={12} className="font-mono fill-warn">
        a slice ending at 2 cuts é in half
      </text>
    </Figure>
  );
}
