import type { ReactNode } from "react";

/**
 * The lesson diagrams, in the site's survey style: hairlines, plotted points,
 * dimension lines, one accent. Inline SVG, so there is nothing to load, and
 * every colour is a token so they follow the dark and light palettes.
 */
export function Figure({
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

export const label = "font-mono fill-fg-2";
export const faint = "font-mono fill-fg-3";

/** A dimension line: a rule between two ticks, with its reading above. */
export function Dimension({ x1, x2, y, text }: { x1: number; x2: number; y: number; text: string }) {
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

/** An arrowhead at the end of a line that runs left to right, or top to bottom. */
export function Head({ x, y, dir = "right" }: { x: number; y: number; dir?: "right" | "down" | "up" }) {
  const d =
    dir === "right"
      ? `M${x - 8} ${y - 4} L${x} ${y} L${x - 8} ${y + 4} Z`
      : dir === "down"
        ? `M${x - 4} ${y - 8} L${x} ${y} L${x + 4} ${y - 8} Z`
        : `M${x - 4} ${y + 8} L${x} ${y} L${x + 4} ${y + 8} Z`;
  return <path d={d} className="fill-survey-2" />;
}

/** Lesson 3: nodes that each own the next, ending in nothing. */
export function LinkedListDiagram() {
  const xs = [130, 330, 530];
  const values = [10, 20, 30];
  const top = 70;
  const mid = top + 28;

  return (
    <Figure
      id="list"
      title="Three nodes in a chain, each pointing at the next"
      caption="A linked list. head points at the first node. Each node holds a value and a link to the next, and the last link holds nothing."
      viewBox="0 0 720 220"
    >
      <text x={64} y={mid + 4} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
        head
      </text>
      <line x1={90} x2={xs[0] - 2} y1={mid} y2={mid} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={xs[0] - 2} y={mid} />

      {xs.map((x, i) => (
        <g key={x}>
          <rect x={x} y={top} width={130} height={56} className="fill-panel-2 stroke-survey" strokeWidth={1.5} />
          <line x1={x + 86} x2={x + 86} y1={top} y2={top + 56} className="stroke-line" strokeWidth={1} />
          <text x={x + 43} y={mid + 6} textAnchor="middle" fontSize={17} className="font-mono fill-fg">
            {values[i]}
          </text>
          <circle cx={x + 108} cy={mid} r={4} className="fill-survey" />
          <text x={x} y={top - 12} fontSize={10} className={faint}>
            {`NODE ${i + 1}`}
          </text>
          {i < xs.length - 1 && (
            <>
              <line
                x1={x + 108}
                x2={xs[i + 1] - 2}
                y1={mid}
                y2={mid}
                className="stroke-survey-2"
                strokeWidth={1.5}
              />
              <Head x={xs[i + 1] - 2} y={mid} />
            </>
          )}
        </g>
      ))}

      {/* The last link leads nowhere. */}
      <text x={xs[2] + 108} y={top + 78} textAnchor="middle" fontSize={12} className="font-mono fill-warn">
        None
      </text>
      <text x={xs[0] + 43} y={top + 78} textAnchor="middle" fontSize={11} className={faint}>
        value
      </text>
      <text x={xs[0] + 108} y={top + 78} textAnchor="middle" fontSize={11} className={faint}>
        next
      </text>

      <Dimension x1={xs[0]} x2={xs[2] + 130} y={192} text="each node owns the next one" />
    </Figure>
  );
}

/** Lesson 4: a pile where only the top moves. */
export function StackDiagram() {
  const x = 270;
  const w = 180;
  const h = 44;
  const bottom = 190;
  const items = [10, 20, 30];
  const topRow = bottom - 3 * h;

  return (
    <Figure
      id="stack"
      title="A stack of three values with an empty slot above the top"
      caption="A stack. push puts a value on the top and pop takes the top value off. Nothing below the top can be reached."
      viewBox="0 0 720 270"
    >
      {/* The slot the next push lands in. */}
      <rect
        x={x}
        y={topRow - h}
        width={w}
        height={h}
        className="fill-ground stroke-line"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      {items.map((value, i) => {
        const y = bottom - (i + 1) * h;
        const isTop = i === items.length - 1;
        return (
          <g key={value}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              className={isTop ? "fill-panel-2 stroke-survey" : "fill-panel-2 stroke-line"}
              strokeWidth={isTop ? 1.5 : 1}
            />
            <text x={x + w / 2} y={y + h / 2 + 6} textAnchor="middle" fontSize={17} className="font-mono fill-fg">
              {value}
            </text>
            <text x={x + w + 14} y={y + h / 2 + 4} fontSize={12} className={faint}>
              {i}
            </text>
          </g>
        );
      })}
      <line x1={x - 20} x2={x + w + 20} y1={bottom} y2={bottom} className="stroke-fg-3" strokeWidth={1} />

      <text x={x - 70} y={topRow + h / 2 + 4} textAnchor="end" fontSize={13} className="font-mono fill-fg">
        top
      </text>
      <line
        x1={x - 62}
        x2={x - 6}
        y1={topRow + h / 2}
        y2={topRow + h / 2}
        className="stroke-survey-2"
        strokeWidth={1.5}
      />
      <Head x={x - 6} y={topRow + h / 2} />

      {/* Both moves go through the top. */}
      <line x1={x + 60} x2={x + 60} y1={14} y2={topRow - h - 4} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={x + 60} y={topRow - h - 4} dir="down" />
      <text x={x + 48} y={30} textAnchor="end" fontSize={13} className="font-mono fill-fg">
        push
      </text>
      <line x1={x + 120} x2={x + 120} y1={topRow - 4} y2={14} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={x + 120} y={14} dir="up" />
      <text x={x + 132} y={30} fontSize={13} className="font-mono fill-fg">
        pop
      </text>

      <text x={x + w + 14} y={bottom + 28} fontSize={10} className={faint}>
        INDEX
      </text>
      <g className="stroke-survey-2" strokeWidth={1}>
        <line x1={x + w + 66} x2={x + w + 66} y1={topRow} y2={bottom} />
        <line x1={x + w + 61} x2={x + w + 71} y1={topRow} y2={topRow} />
        <line x1={x + w + 61} x2={x + w + 71} y1={bottom} y2={bottom} />
      </g>
      <text x={x + w + 82} y={bottom - 1.5 * h + 4} fontSize={12} className="font-mono fill-survey">
        len = 3
      </text>
    </Figure>
  );
}

/** Lesson 5: a ring of eight slots, with the queue wrapped round the end. */
export function QueueDiagram() {
  const left = 56;
  const w = 76;
  const filled = new Map([
    [6, 10],
    [7, 20],
    [0, 30],
    [1, 40],
  ]);
  const mid = (i: number) => left + i * w + w / 2;

  return (
    <Figure
      id="queue"
      title="A queue of four values wrapped round the end of an eight-slot ring"
      caption="A ring buffer. The queue holds 10, 20, 30, 40, with 10 at the front. After slot 7 the queue carries on in slot 0."
      viewBox="0 0 720 220"
    >
      {Array.from({ length: 8 }, (_, i) => {
        const x = left + i * w;
        const value = filled.get(i);
        return (
          <g key={i}>
            <rect
              x={x}
              y={62}
              width={w}
              height={52}
              className={value !== undefined ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
              strokeWidth={value !== undefined ? 1.5 : 1}
              strokeDasharray={value !== undefined ? undefined : "4 3"}
            />
            {value !== undefined && (
              <text x={x + w / 2} y={94} textAnchor="middle" fontSize={16} className="font-mono fill-fg">
                {value}
              </text>
            )}
            <text x={x + w / 2} y={134} textAnchor="middle" fontSize={12} className={faint}>
              {i}
            </text>
          </g>
        );
      })}

      <text x={mid(6)} y={24} textAnchor="middle" fontSize={12} className="font-mono fill-survey">
        front
      </text>
      <line x1={mid(6)} x2={mid(6)} y1={32} y2={54} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={mid(6)} y={54} dir="down" />
      <text x={mid(1)} y={24} textAnchor="middle" fontSize={12} className="font-mono fill-survey">
        back
      </text>
      <line x1={mid(1)} x2={mid(1)} y1={32} y2={54} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={mid(1)} y={54} dir="down" />

      {/* The queue runs off slot 7 and carries on in slot 0. */}
      <path
        d={`M${mid(7)} 146 C ${mid(7)} 206, ${mid(0)} 206, ${mid(0)} 148`}
        fill="none"
        strokeDasharray="4 4"
        className="stroke-fg-3"
        strokeWidth={1}
      />
      <Head x={mid(0)} y={146} dir="up" />
      <text x={(mid(0) + mid(7)) / 2} y={176} textAnchor="middle" fontSize={12} className={label}>
        after slot 7, back to slot 0
      </text>
      <text x={left} y={160} fontSize={10} className={faint}>
        INDEX
      </text>
    </Figure>
  );
}

/** Lesson 6: keys hashed into buckets, with two keys sharing one. */
export function HashDiagram() {
  const row = (i: number) => 40 + i * 26;
  const keys = [
    { text: "3", y: 90, bucket: 3 },
    { text: "11", y: 140, bucket: 3 },
    { text: "-1", y: 196, bucket: 7 },
  ];
  const pairs = [
    { bucket: 3, at: 0, text: "3 : 30" },
    { bucket: 3, at: 1, text: "11 : 110" },
    { bucket: 7, at: 0, text: "-1 : 70" },
  ];

  return (
    <Figure
      id="hash"
      title="Three keys sent to eight buckets, two of them to the same bucket"
      caption="A hash map. Each key is turned into a bucket number. Keys 3 and 11 both land in bucket 3, so that bucket holds a short chain of two pairs."
      viewBox="0 0 720 270"
    >
      <text x={40} y={18} fontSize={10} className={faint}>
        KEYS
      </text>
      <text x={320} y={18} fontSize={10} className={faint}>
        BUCKETS
      </text>
      <text x={392} y={18} fontSize={10} className={faint}>
        PAIRS IN EACH BUCKET
      </text>

      {keys.map((key) => (
        <g key={key.text}>
          <line x1={110} x2={320} y1={key.y} y2={row(key.bucket)} className="stroke-survey-2" strokeWidth={1.2} />
          <circle cx={320} cy={row(key.bucket)} r={3} className="fill-survey" />
          <rect x={40} y={key.y - 14} width={70} height={28} className="fill-panel-2 stroke-line" strokeWidth={1} />
          <text x={75} y={key.y + 5} textAnchor="middle" fontSize={14} className="font-mono fill-fg">
            {key.text}
          </text>
        </g>
      ))}
      <text x={200} y={64} textAnchor="middle" fontSize={12} className="font-mono fill-survey">
        key % 8
      </text>

      {Array.from({ length: 8 }, (_, i) => {
        const used = i === 3 || i === 7;
        return (
          <g key={i}>
            <rect
              x={320}
              y={row(i) - 11}
              width={44}
              height={22}
              className={used ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
              strokeWidth={used ? 1.5 : 1}
            />
            <text
              x={342}
              y={row(i) + 4}
              textAnchor="middle"
              fontSize={11}
              className={used ? "font-mono fill-fg" : faint}
            >
              {i}
            </text>
          </g>
        );
      })}

      {pairs.map((pair) => {
        const x = 392 + pair.at * 112;
        const y = row(pair.bucket);
        return (
          <g key={pair.text}>
            <line
              x1={pair.at === 0 ? 364 : x - 20}
              x2={x - 2}
              y1={y}
              y2={y}
              className="stroke-survey-2"
              strokeWidth={1.2}
            />
            <Head x={x - 2} y={y} />
            <rect x={x} y={y - 11} width={92} height={22} className="fill-panel-2 stroke-line" strokeWidth={1} />
            <text x={x + 46} y={y + 4} textAnchor="middle" fontSize={12} className="font-mono fill-fg">
              {pair.text}
            </text>
          </g>
        );
      })}
      <text x={612} y={row(3) + 4} fontSize={12} className="font-mono fill-warn">
        collision
      </text>
    </Figure>
  );
}

/** Lesson 7: a binary search tree, with the path of a search marked. */
export function TreeDiagram() {
  const at: Record<number, [number, number]> = {
    50: [360, 46],
    30: [200, 114],
    70: [520, 114],
    20: [120, 182],
    40: [280, 182],
    60: [440, 182],
    80: [600, 182],
  };
  const edges: [number, number][] = [
    [50, 30],
    [50, 70],
    [30, 20],
    [30, 40],
    [70, 60],
    [70, 80],
  ];
  const onPath = new Set([50, 30, 40]);

  return (
    <Figure
      id="tree"
      title="A binary search tree of seven values, with a search for 40 marked"
      caption="A binary search tree. Smaller values sit to the left and larger to the right. Searching for 40 visits 50, then 30, then 40, and skips the other four."
      viewBox="0 0 720 266"
    >
      {edges.map(([from, to]) => {
        const hot = onPath.has(from) && onPath.has(to);
        return (
          <line
            key={`${from}-${to}`}
            x1={at[from][0]}
            y1={at[from][1]}
            x2={at[to][0]}
            y2={at[to][1]}
            className={hot ? "stroke-survey" : "stroke-line"}
            strokeWidth={hot ? 2 : 1}
          />
        );
      })}
      {Object.entries(at).map(([value, [x, y]]) => {
        const hot = onPath.has(Number(value));
        return (
          <g key={value}>
            <circle
              cx={x}
              cy={y}
              r={21}
              className={hot ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
              strokeWidth={hot ? 1.5 : 1}
            />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={15} className="font-mono fill-fg">
              {value}
            </text>
          </g>
        );
      })}

      <text x={262} y={78} textAnchor="end" fontSize={12} className={label}>
        smaller
      </text>
      <text x={458} y={78} fontSize={12} className={label}>
        larger
      </text>
      {[
        { y: 50, text: "LEVEL 1" },
        { y: 118, text: "LEVEL 2" },
        { y: 186, text: "LEVEL 3" },
      ].map((level) => (
        <text key={level.text} x={24} y={level.y} fontSize={10} className={faint}>
          {level.text}
        </text>
      ))}
      <text x={360} y={248} textAnchor="middle" fontSize={12} className="font-mono fill-survey">
        search for 40: 50, 30, 40
      </text>
    </Figure>
  );
}

/** An arrow along any direction, ending at (x2, y2) with its head just short of it. */
function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 8;
  const bx = x2 - size * Math.cos(angle);
  const by = y2 - size * Math.sin(angle);
  const px = (size / 2) * Math.sin(angle);
  const py = (size / 2) * Math.cos(angle);
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} className="stroke-survey-2" strokeWidth={1.5} />
      <path d={`M${x2} ${y2} L${bx + px} ${by - py} L${bx - px} ${by + py} Z`} className="fill-survey-2" />
    </g>
  );
}

/** Lesson 8: a min-heap drawn as a tree, and as the row that stores it. */
export function HeapDiagram() {
  const values = [10, 20, 15, 40, 30, 25, 50];
  const at: [number, number][] = [
    [360, 40],
    [200, 98],
    [520, 98],
    [120, 156],
    [280, 156],
    [440, 156],
    [600, 156],
  ];
  const hot = new Set([2, 5, 6]);
  const left = 115;
  const w = 70;

  return (
    <Figure
      id="heap"
      title="A min-heap of seven values, as a tree and as a row of slots"
      caption="A min-heap. Every parent is no bigger than its children, so the smallest value is at the top, in slot 0. The children of slot 2 are in slots 5 and 6."
      viewBox="0 0 720 310"
    >
      {values.map((_, i) => {
        if (i === 0) return null;
        const parent = Math.floor((i - 1) / 2);
        const lit = hot.has(i) && parent === 2;
        return (
          <line
            key={i}
            x1={at[parent][0]}
            y1={at[parent][1]}
            x2={at[i][0]}
            y2={at[i][1]}
            className={lit ? "stroke-survey" : "stroke-line"}
            strokeWidth={lit ? 2 : 1}
          />
        );
      })}
      {values.map((value, i) => (
        <g key={i}>
          <circle
            cx={at[i][0]}
            cy={at[i][1]}
            r={21}
            className={hot.has(i) || i === 0 ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
            strokeWidth={hot.has(i) || i === 0 ? 1.5 : 1}
          />
          <text x={at[i][0]} y={at[i][1] + 5} textAnchor="middle" fontSize={15} className="font-mono fill-fg">
            {value}
          </text>
        </g>
      ))}
      <text x={398} y={44} fontSize={12} className="font-mono fill-survey">
        smallest, always on top
      </text>
      <text x={24} y={22} fontSize={10} className={faint}>
        AS A TREE
      </text>

      <text x={24} y={216} fontSize={10} className={faint}>
        AS A VEC
      </text>
      {values.map((value, i) => {
        const x = left + i * w;
        const lit = hot.has(i) || i === 0;
        return (
          <g key={i}>
            <rect
              x={x}
              y={226}
              width={w}
              height={40}
              className={lit ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
              strokeWidth={lit ? 1.5 : 1}
            />
            <text x={x + w / 2} y={252} textAnchor="middle" fontSize={15} className="font-mono fill-fg">
              {value}
            </text>
            <text x={x + w / 2} y={284} textAnchor="middle" fontSize={12} className={faint}>
              {i}
            </text>
          </g>
        );
      })}
      <text x={left + 7 * w + 12} y={252} fontSize={12} className={label}>
        slot
      </text>
      <text x={left} y={304} fontSize={11} className="font-mono fill-survey">
        parent of i: (i - 1) / 2, children of i: 2i + 1 and 2i + 2
      </text>
    </Figure>
  );
}

/** Lesson 9: sorted keys, with a range query cut out of the middle. */
export function OrderedDiagram() {
  const left = 56;
  const w = 76;
  const keys = [10, 20, 30, 40, 50, 60, 70, 80];
  const inRange = (i: number) => i >= 2 && i <= 4;
  const mid = (i: number) => left + i * w + w / 2;

  return (
    <Figure
      id="ordered"
      title="Eight sorted keys with a range query picking out 30, 40 and 50"
      caption="An ordered map keeps its keys sorted. A range query finds where the range starts, then walks along until it passes the end. It never looks at 10, 20, 70 or 80."
      viewBox="0 0 720 230"
    >
      <text x={left} y={20} fontSize={10} className={faint}>
        KEYS, IN ORDER
      </text>
      {keys.map((key, i) => {
        const x = left + i * w;
        const lit = inRange(i);
        return (
          <g key={key}>
            <rect
              x={x}
              y={78}
              width={w}
              height={52}
              className={lit ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
              strokeWidth={lit ? 1.5 : 1}
            />
            <text x={x + w / 2} y={110} textAnchor="middle" fontSize={16} className="font-mono fill-fg">
              {key}
            </text>
          </g>
        );
      })}

      <text x={mid(2)} y={40} textAnchor="middle" fontSize={12} className="font-mono fill-survey">
        start here
      </text>
      <line x1={mid(2)} x2={mid(2)} y1={48} y2={62} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={mid(2)} y={70} dir="down" />
      <text x={mid(5)} y={40} textAnchor="middle" fontSize={12} className="font-mono fill-warn">
        stop before this
      </text>
      <line x1={mid(5)} x2={mid(5)} y1={48} y2={70} className="stroke-warn" strokeWidth={1.5} />

      <Dimension x1={left + 2 * w} x2={left + 5 * w} y={166} text="range(30..60): 3 pairs" />
      <text x={left} y={206} fontSize={12} className={label}>
        binary search finds the start, then it is just a walk
      </text>
    </Figure>
  );
}

/** Lesson 10: a small metro map, and the adjacency list that stores it. */
export function GraphDiagram() {
  const at: [number, number][] = [
    [60, 120],
    [150, 52],
    [170, 168],
    [262, 214],
    [330, 118],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 3],
    [3, 4],
  ];
  const lists = ["[1, 2]", "[0, 2]", "[0, 1, 3]", "[2, 4]", "[3]"];
  const row = (i: number) => 52 + i * 38;

  return (
    <Figure
      id="graph"
      title="A graph of five stations, and its adjacency list"
      caption="A graph is places joined by links. Here the places are numbered 0 to 4. The adjacency list on the right says, for each place, which places it is joined to."
      viewBox="0 0 720 270"
    >
      <text x={24} y={22} fontSize={10} className={faint}>
        THE MAP
      </text>
      <text x={430} y={22} fontSize={10} className={faint}>
        THE ADJACENCY LIST
      </text>
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={at[a][0]}
          y1={at[a][1]}
          x2={at[b][0]}
          y2={at[b][1]}
          className="stroke-survey-2"
          strokeWidth={1.5}
        />
      ))}
      {at.map(([x, y], v) => (
        <g key={v}>
          <circle
            cx={x}
            cy={y}
            r={19}
            className={v === 2 ? "fill-panel-2 stroke-survey" : "fill-panel stroke-line"}
            strokeWidth={v === 2 ? 1.5 : 1}
          />
          <text x={x} y={y + 5} textAnchor="middle" fontSize={15} className="font-mono fill-fg">
            {v}
          </text>
        </g>
      ))}

      {lists.map((text, v) => (
        <g key={v}>
          <rect
            x={430}
            y={row(v) - 16}
            width={44}
            height={32}
            className={v === 2 ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
            strokeWidth={v === 2 ? 1.5 : 1}
          />
          <text x={452} y={row(v) + 5} textAnchor="middle" fontSize={14} className="font-mono fill-fg">
            {v}
          </text>
          <line x1={474} x2={486} y1={row(v)} y2={row(v)} className="stroke-survey-2" strokeWidth={1.2} />
          <Head x={494} y={row(v)} />
          <rect
            x={494}
            y={row(v) - 16}
            width={120}
            height={32}
            className={v === 2 ? "fill-panel-2 stroke-survey" : "fill-panel-2 stroke-line"}
            strokeWidth={v === 2 ? 1.5 : 1}
          />
          <text x={508} y={row(v) + 5} fontSize={14} className="font-mono fill-fg">
            {text}
          </text>
        </g>
      ))}
      <text x={628} y={row(2) + 5} fontSize={12} className="font-mono fill-survey">
        3 links
      </text>
    </Figure>
  );
}

/** Lesson 11: a trie holding five words, with a prefix search marked. */
export function TrieDiagram() {
  const at: Record<string, [number, number]> = {
    root: [360, 40],
    c: [200, 106],
    a: [200, 168],
    p: [120, 234],
    r: [200, 234],
    t: [280, 234],
    d: [520, 106],
    o: [520, 168],
    g: [520, 234],
  };
  const edges: [string, string][] = [
    ["root", "c"],
    ["c", "a"],
    ["a", "p"],
    ["a", "r"],
    ["a", "t"],
    ["root", "d"],
    ["d", "o"],
    ["o", "g"],
  ];
  const hot = new Set(["root", "c", "a", "p", "r", "t"]);
  const ends = new Set(["p", "r", "t", "o", "g"]);

  return (
    <Figure
      id="trie"
      title="A trie holding cap, car, cat, do and dog, with the prefix ca marked"
      caption="A trie. Each step down is one letter, so each word is a path from the top. A ringed node means a word ends there. The prefix ca leads to one node, and everything below it is a suggestion."
      viewBox="0 0 720 312"
    >
      {edges.map(([from, to]) => {
        const lit = hot.has(from) && hot.has(to);
        return (
          <line
            key={`${from}-${to}`}
            x1={at[from][0]}
            y1={at[from][1]}
            x2={at[to][0]}
            y2={at[to][1]}
            className={lit ? "stroke-survey" : "stroke-line"}
            strokeWidth={lit ? 2 : 1}
          />
        );
      })}
      {Object.entries(at).map(([name, [x, y]]) => {
        const lit = hot.has(name);
        return (
          <g key={name}>
            {ends.has(name) && (
              <circle cx={x} cy={y} r={23} fill="none" className={lit ? "stroke-survey" : "stroke-line"} strokeWidth={1} />
            )}
            <circle
              cx={x}
              cy={y}
              r={17}
              className={lit ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
              strokeWidth={lit ? 1.5 : 1}
            />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={15} className="font-mono fill-fg">
              {name === "root" ? "" : name}
            </text>
          </g>
        );
      })}
      <text x={388} y={44} fontSize={12} className={label}>
        root: no letter yet
      </text>
      <text x={176} y={142} textAnchor="end" fontSize={12} className="font-mono fill-survey">
        prefix ca
      </text>
      {[
        { x: 120, text: "cap" },
        { x: 200, text: "car" },
        { x: 280, text: "cat" },
        { x: 520, text: "dog" },
      ].map((word) => (
        <text key={word.text} x={word.x} y={280} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
          {word.text}
        </text>
      ))}
      <text x={552} y={172} fontSize={13} className="font-mono fill-fg">
        do
      </text>
      <text x={200} y={304} textAnchor="middle" fontSize={11} className="font-mono fill-survey">
        suggestions
      </text>
    </Figure>
  );
}

/** Lesson 12: a long chain of leaders, before and after one find flattens it. */
export function UnionFindDiagram() {
  const before: [number, number][] = [
    [150, 52],
    [150, 112],
    [150, 172],
    [150, 232],
  ];
  const after: [number, number][] = [
    [540, 52],
    [440, 190],
    [540, 190],
    [640, 190],
  ];

  return (
    <Figure
      id="union-find"
      title="A chain of four people before find(3), and a flat group after"
      caption="Each person points at one other, and the person at the top is the leader. Before, finding the leader of 3 takes three steps. A find that points everyone it passes straight at the leader makes every later find one step."
      viewBox="0 0 720 300"
    >
      <text x={24} y={22} fontSize={10} className={faint}>
        BEFORE
      </text>
      <text x={400} y={22} fontSize={10} className={faint}>
        AFTER find(3)
      </text>

      {before.slice(1).map(([x, y], i) => (
        <Arrow key={i} x1={x} y1={y - 19} x2={before[i][0]} y2={before[i][1] + 19} />
      ))}
      {before.map(([x, y], v) => (
        <g key={v}>
          <circle
            cx={x}
            cy={y}
            r={18}
            className={v === 0 ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
            strokeWidth={v === 0 ? 1.5 : 1}
          />
          <text x={x} y={y + 5} textAnchor="middle" fontSize={15} className="font-mono fill-fg">
            {v}
          </text>
        </g>
      ))}
      <text x={184} y={57} fontSize={12} className="font-mono fill-survey">
        leader
      </text>
      <text x={150} y={274} textAnchor="middle" fontSize={12} className={label}>
        3 steps to reach the leader
      </text>

      <line x1={290} x2={358} y1={140} y2={140} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={366} y={140} />
      <text x={328} y={126} textAnchor="middle" fontSize={12} className="font-mono fill-fg">
        find(3)
      </text>

      {after.slice(1).map(([x, y], i) => {
        // Each arrow runs from a person to the edge of the leader's circle.
        const dx = after[0][0] - x;
        const dy = after[0][1] - y;
        const len = Math.hypot(dx, dy);
        return (
          <Arrow
            key={i}
            x1={x + (dx / len) * 19}
            y1={y + (dy / len) * 19}
            x2={after[0][0] - (dx / len) * 19}
            y2={after[0][1] - (dy / len) * 19}
          />
        );
      })}
      {after.map(([x, y], v) => (
        <g key={v}>
          <circle
            cx={x}
            cy={y}
            r={18}
            className={v === 0 ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
            strokeWidth={v === 0 ? 1.5 : 1}
          />
          <text x={x} y={y + 5} textAnchor="middle" fontSize={15} className="font-mono fill-fg">
            {v}
          </text>
        </g>
      ))}
      <text x={574} y={57} fontSize={12} className="font-mono fill-survey">
        leader
      </text>
      <text x={540} y={274} textAnchor="middle" fontSize={12} className={label}>
        1 step for everyone
      </text>
    </Figure>
  );
}
