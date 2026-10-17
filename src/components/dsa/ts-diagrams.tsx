import type { ReactNode } from "react";

/**
 * The diagrams for The Switch, in the same survey style as the other courses:
 * hairlines, plotted points, one accent (`survey`), tokens only. The amber
 * `warn` token marks what TypeScript refuses, and is never the only signal: a
 * refused thing also says so in words, and is dashed or struck through.
 *
 * Each diagram is drawn twice, a wide layout and a narrow one, and the frame
 * shows whichever fits the width of the figure itself (a container query, so
 * the open sidebar is accounted for; the switch is at 620px, in the two class
 * names below, which Tailwind can only find as whole literals). The narrow layout is a taller stack that
 * keeps the text at the size it is drawn at, instead of shrinking a wide
 * drawing until it cannot be read.
 */

/** Marker references for arrowheads, unique to one drawing. */
type Heads = { grey: string; accent: string; warn: string };
type Drawing = { viewBox: string; draw: (heads: Heads) => ReactNode };

function Frame({
  id,
  layout,
  title,
  caption,
  className,
  drawing,
}: {
  id: string;
  layout: "narrow" | "wide";
  title: string;
  caption: string;
  className: string;
  drawing: Drawing;
}) {
  const key = `${id}-${layout}`;
  const heads: Heads = { grey: `url(#${key}-g)`, accent: `url(#${key}-s)`, warn: `url(#${key}-w)` };

  return (
    <svg viewBox={drawing.viewBox} role="img" aria-labelledby={`${key}-t ${key}-d`} className={className}>
      <title id={`${key}-t`}>{title}</title>
      <desc id={`${key}-d`}>{caption}</desc>
      <defs>
        {(
          [
            ["g", "fill-fg-3"],
            ["s", "fill-survey"],
            ["w", "fill-warn"],
          ] as const
        ).map(([name, fill]) => (
          <marker
            key={name}
            id={`${key}-${name}`}
            viewBox="0 0 8 8"
            refX={7}
            refY={4}
            markerWidth={8}
            markerHeight={8}
            orient="auto-start-reverse"
          >
            <path d="M0 0 L8 4 L0 8 Z" className={fill} />
          </marker>
        ))}
      </defs>
      {drawing.draw(heads)}
    </svg>
  );
}

/**
 * The frame for a Switch diagram. `alt` is the text alternative: what the
 * picture shows, in words, for someone who cannot see it. The visible caption
 * says what to take from it.
 */
export function TsFigure({
  id,
  title,
  alt,
  caption,
  wide,
  narrow,
}: {
  id: string;
  title: string;
  alt: string;
  caption: string;
  wide: Drawing;
  narrow: Drawing;
}) {
  return (
    <figure className="@container my-6 overflow-hidden rounded-panel border border-line bg-panel">
      <Frame
        id={id}
        layout="narrow"
        title={title}
        caption={alt}
        drawing={narrow}
        className="mx-auto block h-auto w-full max-w-[440px] @[620px]:hidden"
      />
      <Frame
        id={id}
        layout="wide"
        title={title}
        caption={alt}
        drawing={wide}
        className="hidden h-auto w-full @[620px]:block"
      />
      <figcaption className="border-t border-line-2 px-4 py-3 text-[14px] text-fg-2">{caption}</figcaption>
    </figure>
  );
}

// --- drawing helpers ---------------------------------------------------------

type Tone = "fg" | "fg2" | "fg3" | "survey" | "warn";
const fillOf: Record<Tone, string> = {
  fg: "font-mono fill-fg",
  fg2: "font-mono fill-fg-2",
  fg3: "font-mono fill-fg-3",
  survey: "font-mono fill-survey",
  warn: "font-mono fill-warn",
};

function Txt({
  x,
  y,
  children,
  size = 13,
  tone = "fg",
  anchor = "start",
  strike = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  tone?: Tone;
  anchor?: "start" | "middle" | "end";
  strike?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      textAnchor={anchor}
      className={fillOf[tone]}
      textDecoration={strike ? "line-through" : undefined}
    >
      {children}
    </text>
  );
}

/** A small uppercase tag, in the house `STATION 1` voice. */
function Tag({ x, y, children, anchor = "start" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} fontSize={11} textAnchor={anchor} letterSpacing="0.08em" className="font-mono fill-fg-3">
      {children}
    </text>
  );
}

type Edge = "line" | "survey" | "warn" | "dash" | "dashWarn" | "ghost";
const edgeClass: Record<Edge, string> = {
  line: "fill-panel-2 stroke-line",
  survey: "fill-panel-2 stroke-survey",
  warn: "fill-panel-2 stroke-warn",
  dash: "fill-ground stroke-fg-3",
  dashWarn: "fill-ground stroke-warn",
  ghost: "fill-ground stroke-line",
};

function Box({
  x,
  y,
  w,
  h,
  edge = "line",
  width = 1.25,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  edge?: Edge;
  width?: number;
}) {
  const dashed = edge === "dash" || edge === "dashWarn" || edge === "ghost";
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={2}
      className={edgeClass[edge]}
      strokeWidth={edge === "survey" || edge === "warn" ? 1.5 : width}
      strokeDasharray={dashed ? "4 3" : undefined}
    />
  );
}

/**
 * How wide a line of text is, estimated: this monospace face is about 0.655em
 * a character. Used to stop a label from being drawn wider than its box.
 */
const textWidth = (text: string, size: number) => text.length * size * 0.655;

function mustFit(text: string | undefined, size: number, w: number) {
  if (text && textWidth(text, size) > w - 8) {
    throw new Error(`ts-diagrams: "${text}" at ${size}px is wider than its ${w}px box`);
  }
}

/** A box with one or two centred lines: a title and a quieter line under it. */
function Card({
  x,
  y,
  w,
  h,
  title,
  sub,
  edge = "line",
  titleTone = "fg",
  subTone = "fg2",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  edge?: Edge;
  titleTone?: Tone;
  subTone?: Tone;
}) {
  const cx = x + w / 2;
  mustFit(title, 13, w);
  mustFit(sub, 12.5, w);
  return (
    <g>
      <Box x={x} y={y} w={w} h={h} edge={edge} />
      {sub ? (
        <>
          <Txt x={cx} y={y + h / 2 - 3} anchor="middle" tone={titleTone}>
            {title}
          </Txt>
          <Txt x={cx} y={y + h / 2 + 14} anchor="middle" size={12.5} tone={subTone}>
            {sub}
          </Txt>
        </>
      ) : (
        <Txt x={cx} y={y + h / 2 + 4.5} anchor="middle" tone={titleTone}>
          {title}
        </Txt>
      )}
    </g>
  );
}

function Line({
  x1,
  y1,
  x2,
  y2,
  head,
  tone = "grey",
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  head?: string;
  tone?: "grey" | "survey" | "warn";
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={tone === "survey" ? "stroke-survey-2" : tone === "warn" ? "stroke-warn" : "stroke-fg-3"}
      strokeWidth={1.25}
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd={head}
    />
  );
}

function Curve({ d, head, tone = "grey", dashed = false }: { d: string; head?: string; tone?: "grey" | "survey" | "warn"; dashed?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      className={tone === "survey" ? "stroke-survey-2" : tone === "warn" ? "stroke-warn" : "stroke-fg-3"}
      strokeWidth={1.25}
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd={head}
    />
  );
}

/** A vertical dimension line with a reading to its right (the narrow version of `Dimension`). */
function DimensionV({ x, y1, y2, lines }: { x: number; y1: number; y2: number; lines: string[] }) {
  const mid = (y1 + y2) / 2;
  return (
    <g>
      <g className="stroke-survey-2" strokeWidth={1}>
        <line x1={x} x2={x} y1={y1} y2={y2} />
        <line x1={x - 5} x2={x + 5} y1={y1} y2={y1} />
        <line x1={x - 5} x2={x + 5} y1={y2} y2={y2} />
      </g>
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + 12}
          y={mid + (i - (lines.length - 1) / 2) * 16 + 4}
          fontSize={12.5}
          className="font-mono fill-survey"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

/** A horizontal dimension line, as in the other courses, with the reading above. */
function DimensionH({ x1, x2, y, text }: { x1: number; x2: number; y: number; text: string }) {
  return (
    <g className="stroke-survey-2" strokeWidth={1}>
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <line x1={x1} x2={x1} y1={y - 5} y2={y + 5} />
      <line x1={x2} x2={x2} y1={y - 5} y2={y + 5} />
      <text x={(x1 + x2) / 2} y={y - 9} textAnchor="middle" fontSize={12.5} className="font-mono fill-survey stroke-none">
        {text}
      </text>
    </g>
  );
}

// --- lesson 0 ----------------------------------------------------------------

/** Lesson 0: types exist while you write, and are stripped before anything runs. */
export function TypesErasedDiagram() {
  const stations = (w: number, h: number, xs: number[], ys: number[]) => {
    const items = [
      { title: "greet.ts", sub: "code + types", edge: "line" as Edge, subTone: "fg2" as Tone },
      { title: "tsc: the check", sub: "mismatch = error", edge: "survey" as Edge, subTone: "warn" as Tone },
      { title: "types stripped", sub: "labels removed", edge: "dash" as Edge, subTone: "fg2" as Tone },
      { title: "greet.js", sub: "plain JavaScript", edge: "line" as Edge, subTone: "fg2" as Tone },
    ];
    return items.map((s, i) => (
      <Card key={s.title} x={xs[i]} y={ys[i]} w={w} h={h} title={s.title} sub={s.sub} edge={s.edge} subTone={s.subTone} />
    ));
  };

  const wide: Drawing = {
    viewBox: "0 0 680 232",
    draw: (m) => {
      const xs = [8, 180, 352, 524];
      return (
        <>
          <DimensionH x1={8} x2={328} y={36} text="types exist while you write" />
          <DimensionH x1={352} x2={672} y={36} text="only JavaScript is left" />
          {stations(148, 62, xs, [64, 64, 64, 64])}
          {xs.slice(0, 3).map((x, i) => (
            <Line key={x} x1={x + 148} y1={95} x2={xs[i + 1] - 3} y2={95} head={m.grey} />
          ))}
          <Curve d="M254 128 C 254 178, 82 178, 82 131" head={m.warn} tone="warn" dashed />
          <Txt x={168} y={198} anchor="middle" size={12.5} tone="warn">
            an error sends you back to fix it
          </Txt>
          <Line x1={598} y1={128} x2={598} y2={164} head={m.accent} tone="survey" />
          <Txt x={672} y={188} anchor="end" size={12.5} tone="survey">
            Node or a browser runs it
          </Txt>
        </>
      );
    },
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 372",
    draw: (m) => {
      const ys = [12, 94, 176, 258];
      return (
        <>
          {stations(168, 58, [12, 12, 12, 12], ys)}
          {ys.slice(0, 3).map((y, i) => (
            <Line key={y} x1={96} y1={y + 58} x2={96} y2={ys[i + 1] - 3} head={m.grey} />
          ))}
          <DimensionV x={196} y1={12} y2={152} lines={["types exist", "while you", "write"]} />
          <DimensionV x={196} y1={176} y2={316} lines={["only JavaScript", "is left"]} />
          <Line x1={96} y1={316} x2={96} y2={340} head={m.accent} tone="survey" />
          <Txt x={12} y={362} size={12.5} tone="survey">
            Node or a browser runs it
          </Txt>
        </>
      );
    },
  };

  return (
    <TsFigure
      id="ts-erased"
      title="Types exist while you write, and are stripped before the code runs"
      alt="A file greet.ts goes through tsc, the check. A mismatch is an error that sends you back to fix it. The types are then stripped, leaving greet.js, plain JavaScript, which Node or a browser runs. Types exist only on the left half of the road."
      caption="The types are for you and your tools. The checker reads them, then they are stripped, and only plain JavaScript runs."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 1 ----------------------------------------------------------------

/** Lesson 1: checking and running are two separate jobs. */
export function ToolchainDiagram() {
  const wide: Drawing = {
    viewBox: "0 0 680 232",
    draw: (m) => (
      <>
        <Card x={14} y={84} w={124} h={62} title="hello.ts" sub="code + labels" />
        <Tag x={196} y={16}>CHECK</Tag>
        <Tag x={196} y={142}>RUN</Tag>
        <Card x={196} y={24} w={188} h={62} title="tsc --noEmit" sub="types: checked" edge="survey" />
        <Card x={452} y={24} w={214} h={62} title="red lines, error codes" sub="writes no files" />
        <Line x1={384} y1={55} x2={449} y2={55} head={m.accent} tone="survey" />
        <Card x={196} y={150} w={188} h={62} title="node hello.ts" sub="types: skipped" edge="dash" subTone="warn" />
        <Card x={452} y={150} w={214} h={62} title="HELLO, TYPESCRIPT!" sub="labels stripped, then run" />
        <Line x1={384} y1={181} x2={449} y2={181} head={m.grey} />
        <Curve d="M138 105 C 170 105, 168 55, 193 55" head={m.accent} tone="survey" />
        <Curve d="M138 125 C 170 125, 168 181, 193 181" head={m.grey} />
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 304",
    draw: (m) => (
      <>
        <Card x={92} y={8} w={156} h={54} title="hello.ts" sub="code + labels" />
        <Curve d="M150 62 C 150 78, 72 78, 72 96" head={m.accent} tone="survey" />
        <Curve d="M190 62 C 190 78, 239 78, 239 96" head={m.grey} />
        <Tag x={8} y={100}>CHECK</Tag>
        <Tag x={146} y={100}>RUN</Tag>
        <Card x={8} y={106} w={128} h={60} title="tsc --noEmit" sub="types: checked" edge="survey" />
        <Card x={146} y={106} w={186} h={60} title="node hello.ts" sub="types: skipped" edge="dash" subTone="warn" />
        <Line x1={72} y1={166} x2={72} y2={196} head={m.accent} tone="survey" />
        <Line x1={239} y1={166} x2={239} y2={196} head={m.grey} />
        <Card x={8} y={200} w={128} h={60} title="red lines" sub="writes nothing" />
        <Card x={146} y={200} w={186} h={60} title="HELLO, TYPESCRIPT!" sub="stripped, then run" />
        <Txt x={10} y={290} size={12.5} tone="fg2">
          Two jobs: checking and running.
        </Txt>
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-toolchain"
      title="Checking and running are two separate jobs"
      alt="hello.ts can go two ways. tsc with noEmit checks the types and reports red lines and error codes, and writes no files. node hello.ts strips the labels and runs the rest, printing HELLO, TYPESCRIPT!, and checks no types at all."
      caption="tsc --noEmit is the checker. node hello.ts is the runner. Node strips the labels but never checks them."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 2 ----------------------------------------------------------------

type VarSpec = { kind: string; name: string; value: string; type: string; written?: boolean };

/** A named box holding a value, with its type label tied on. A dashed label was worked out by TypeScript. */
function Variable({ x, y, w, spec }: { x: number; y: number; w: number; spec: VarSpec }) {
  const tagW = Math.min(w, spec.type.length * 8 + 22);
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={cx - tagW / 2}
        y={y}
        width={tagW}
        height={22}
        rx={2}
        className="fill-panel stroke-survey"
        strokeWidth={1.25}
        strokeDasharray={spec.written ? undefined : "4 3"}
      />
      <Txt x={cx} y={y + 15} anchor="middle" tone="survey" size={12.5}>
        {spec.type}
      </Txt>
      <Line x1={cx} y1={y + 22} x2={cx} y2={y + 32} />
      <Box x={x} y={y + 32} w={w} h={50} edge="line" />
      <Txt x={cx} y={y + 63} anchor="middle" size={15}>
        {spec.value}
      </Txt>
      <Txt x={cx} y={y + 100} anchor="middle" size={12.5} tone="fg2">
        {`${spec.kind} ${spec.name}`}
      </Txt>
    </g>
  );
}

/** Lesson 2: values with type labels, and the labels TypeScript wrote for you. */
export function LabelsDiagram() {
  const row1: VarSpec[] = [
    { kind: "let", name: "price", value: "499", type: "number" },
    { kind: "let", name: "item", value: '"Chai"', type: "string" },
    { kind: "let", name: "inStock", value: "true", type: "boolean" },
  ];
  const row2: VarSpec[] = [
    { kind: "const", name: "city", value: '"Pune"', type: '"Pune"' },
    { kind: "let", name: "town", value: '"Pune"', type: "string" },
    { kind: "const", name: "stops", value: "3", type: "3" },
    { kind: "let", name: "total", value: "3", type: "number" },
  ];

  const legend = (x: number, y: number, split: boolean) => (
    <g>
      <rect x={x} y={y - 12} width={34} height={16} rx={2} className="fill-panel stroke-survey" strokeWidth={1.25} strokeDasharray="4 3" />
      <Txt x={x + 46} y={y} size={12.5} tone="fg2">
        {split ? "TypeScript read the value" : "TypeScript read the value and wrote the label"}
      </Txt>
      {split && (
        <Txt x={x + 46} y={y + 16} size={12.5} tone="fg2">
          and wrote the label
        </Txt>
      )}
      <rect x={x} y={y + (split ? 38 : 30) - 12} width={34} height={16} rx={2} className="fill-panel stroke-survey" strokeWidth={1.25} />
      <Txt x={x + 46} y={y + (split ? 38 : 30)} size={12.5} tone="fg2">
        {split ? "You wrote it, as on a" : "You wrote it, as on a function's inputs"}
      </Txt>
      {split && (
        <Txt x={x + 46} y={y + 54} size={12.5} tone="fg2">
          function&apos;s inputs
        </Txt>
      )}
    </g>
  );

  const wide: Drawing = {
    viewBox: "0 0 680 372",
    draw: () => (
      <>
        <Tag x={14} y={20}>INFERRED FROM THE VALUE</Tag>
        {row1.map((s, i) => (
          <Variable key={s.name} x={14 + i * 224} y={30} w={186} spec={s} />
        ))}
        <Tag x={14} y={170}>CONST KEEPS THE EXACT VALUE, LET MAY CHANGE</Tag>
        {row2.map((s, i) => (
          <Variable key={s.name} x={14 + i * 167} y={180} w={140} spec={s} />
        ))}
        {legend(14, 328, false)}
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 590",
    draw: () => (
      <>
        <Tag x={12} y={20}>INFERRED FROM THE VALUE</Tag>
        {row1.map((s, i) => (
          <Variable key={s.name} x={12 + i * 112} y={30} w={104} spec={s} />
        ))}
        <Tag x={12} y={170}>CONST KEEPS THE EXACT VALUE,</Tag>
        <Tag x={12} y={186}>LET MAY CHANGE</Tag>
        {row2.map((s, i) => (
          <Variable key={s.name} x={12 + (i % 2) * 166} y={198 + Math.floor(i / 2) * 124} w={150} spec={s} />
        ))}
        {legend(12, 478, true)}
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-labels"
      title="Values with type labels, and the labels TypeScript wrote for you"
      alt="Boxes hold values, each with a type label tied on. 499 is a number, Chai is a string, true is a boolean. A dashed label means TypeScript worked it out from the value. A const city holding Pune has the exact type Pune, while a let town holding Pune has the wider type string. A const stops holding 3 has the type 3, and a let total holding 3 has the type number."
      caption="A dashed label is one TypeScript wrote for you. You only need to write the solid ones, mostly on a function's inputs."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 3 ----------------------------------------------------------------

type Slot = { label: string; value?: string };
type Case = { title: string; slots: [Slot, Slot]; extra?: { text: string; note: string[]; ok: boolean }; verdict: { text: string; code?: string; ok: boolean } };

const userCases: Case[] = [
  { title: "A full object", slots: [{ label: "name: string", value: '"Asha"' }, { label: "age: number", value: "21" }], verdict: { text: "fits", ok: true } },
  { title: "age is missing", slots: [{ label: "name: string", value: '"Ravi"' }, { label: "age: number" }], verdict: { text: "refused", code: "TS2345", ok: false } },
  {
    title: "agee is a typo",
    slots: [{ label: "name: string", value: '"Asha"' }, { label: "age: number" }],
    extra: { text: "agee: 21", note: ["not in User"], ok: false },
    verdict: { text: "refused", code: "TS2561", ok: false },
  },
  {
    title: "pet has a tail",
    slots: [{ label: "name: string", value: '"Momo"' }, { label: "age: number", value: "3" }],
    extra: { text: "tail: true", note: ["allowed: a variable,", "not a fresh literal"], ok: true },
    verdict: { text: "fits", ok: true },
  },
];

function StencilCard({ x, y, w, c }: { x: number; y: number; w: number; c: Case }) {
  const inner = w - 20;
  const cx = x + w / 2;
  return (
    <g>
      <Txt x={cx} y={y + 16} anchor="middle" size={13}>
        {c.title}
      </Txt>
      <Box x={x + 10} y={y + 28} w={inner} h={100} edge="survey" />
      {c.slots.map((s, i) => {
        const sy = y + 36 + i * 44;
        return (
          <g key={s.label}>
            <Box x={x + 18} y={sy} w={inner - 16} h={38} edge={s.value ? "line" : "dashWarn"} />
            <Txt x={x + 25} y={sy + 15} size={12.5} tone="fg3">
              {s.label}
            </Txt>
            <Txt x={x + 25} y={sy + 31} tone={s.value ? "fg" : "warn"}>
              {s.value ?? "missing"}
            </Txt>
          </g>
        );
      })}
      {c.extra && (
        <g>
          <Box x={x + 10} y={y + 140} w={inner} h={26} edge={c.extra.ok ? "dash" : "dashWarn"} />
          <Txt x={cx} y={y + 157} anchor="middle" tone={c.extra.ok ? "fg" : "warn"}>
            {c.extra.text}
          </Txt>
          {c.extra.note.map((line, i) => (
            <Txt key={line} x={cx} y={y + 183 + i * 15} anchor="middle" size={12.5} tone="fg2">
              {line}
            </Txt>
          ))}
        </g>
      )}
      <Txt x={cx} y={y + 228} anchor="middle" tone={c.verdict.ok ? "survey" : "warn"}>
        {c.verdict.ok ? "fits" : `${c.verdict.text}: ${c.verdict.code}`}
      </Txt>
    </g>
  );
}

/** Lesson 3: a shape as a stencil. A value fits it or it doesn't. */
export function StencilDiagram() {
  const wide: Drawing = {
    viewBox: "0 0 680 304",
    draw: () => (
      <>
        <Txt x={14} y={20} tone="survey">
          type User = {"{ name: string; age: number }"}
        </Txt>
        {userCases.map((c, i) => (
          <StencilCard key={c.title} x={9 + i * 166} y={38} w={152} c={c} />
        ))}
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 590",
    draw: () => (
      <>
        <Txt x={12} y={20} tone="survey" size={12.5}>
          type User =
        </Txt>
        <Txt x={12} y={38} tone="survey" size={12.5}>
          {"  { name: string; age: number }"}
        </Txt>
        {userCases.map((c, i) => (
          <StencilCard key={c.title} x={10 + (i % 2) * 168} y={58 + Math.floor(i / 2) * 266} w={152} c={c} />
        ))}
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-stencil"
      title="A type as a stencil: a value either fits it or it doesn't"
      alt="The type User has two boxes, name as a string and age as a number. An object with both fits. An object with only a name leaves the age box empty and is refused with TS2345. An object literal with a misspelled agee has a property that is not in User and is refused with TS2561. A variable called pet with an extra tail property still fits, because only fresh object literals get the extra-property check."
      caption="A stencil has a hole for each property. A missing property or an unknown one in a fresh literal is refused, but a variable with extras still fits."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 4 ----------------------------------------------------------------

/** Lesson 4: a list of one type, a tuple of fixed positions, and a function's types in and out. */
export function ShapesDiagram() {
  const list = ["90", "85", "72", "77"];

  const slots = (x0: number, y: number, w: number, gap: number, items: { value: string; tag: string; ghost?: boolean }[]) =>
    items.map((s, i) => {
      const x = x0 + i * (w + gap);
      return (
        <g key={`${s.value}-${i}`}>
          <Box x={x} y={y} w={w} h={42} edge={s.ghost ? "dashWarn" : "line"} />
          <Txt x={x + w / 2} y={y + 26} anchor="middle" size={s.ghost ? 12.5 : 15} tone={s.ghost ? "warn" : "fg"}>
            {s.value}
          </Txt>
          <Txt x={x + w / 2} y={y + 60} anchor="middle" size={12.5} tone={s.ghost ? "warn" : "survey"}>
            {s.tag}
          </Txt>
        </g>
      );
    });

  const fn = (x0: number, y: number, bw: number, gap: number, m: Heads) => (
    <g>
      <Card x={x0} y={y} w={bw} h={46} title="price" sub="number" subTone="survey" />
      <Line x1={x0 + bw} y1={y + 23} x2={x0 + bw + gap - 3} y2={y + 23} head={m.grey} />
      <Card x={x0 + bw + gap} y={y} w={bw} h={46} title="Discount" sub="function" edge="survey" />
      <Line x1={x0 + 2 * bw + gap} y1={y + 23} x2={x0 + 2 * bw + 2 * gap - 3} y2={y + 23} head={m.grey} />
      <Card x={x0 + 2 * bw + 2 * gap} y={y} w={bw} h={46} title="returns" sub="number" subTone="survey" />
    </g>
  );

  const wide: Drawing = {
    viewBox: "0 0 680 372",
    draw: (m) => (
      <>
        <Txt x={14} y={20} tone="survey">number[]</Txt>
        <Txt x={112} y={20} size={12.5} tone="fg2">a list: any length, every slot a number</Txt>
        {slots(14, 34, 84, 8, [
          ...list.map((v) => ({ value: v, tag: "number" })),
          { value: "...", tag: "room to grow", ghost: false },
        ])}
        <Txt x={14} y={140} tone="survey">[coach: string, seat: number]</Txt>
        <Txt x={282} y={140} size={12.5} tone="fg2">a tuple: fixed positions, each its own type</Txt>
        {slots(14, 154, 120, 8, [
          { value: '"B2"', tag: "string" },
          { value: "14", tag: "number" },
          { value: "ticket[2]", tag: "TS2493: no third slot", ghost: true },
        ])}
        <Txt x={14} y={262} tone="survey">(price: number) =&gt; number</Txt>
        <Txt x={262} y={262} size={12.5} tone="fg2">a function: types in, one type out</Txt>
        {fn(14, 276, 130, 56, m)}
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 424",
    draw: (m) => (
      <>
        <Txt x={12} y={20} tone="survey">number[]</Txt>
        <Txt x={12} y={38} size={12.5} tone="fg2">a list: any length,</Txt>
        <Txt x={12} y={54} size={12.5} tone="fg2">every slot a number</Txt>
        {slots(12, 66, 60, 6, [...list.map((v) => ({ value: v, tag: "number" })), { value: "...", tag: "more" }])}
        <Txt x={12} y={180} tone="survey" size={12.5}>[coach: string, seat: number]</Txt>
        <Txt x={12} y={198} size={12.5} tone="fg2">a tuple: fixed positions,</Txt>
        <Txt x={12} y={214} size={12.5} tone="fg2">each its own type</Txt>
        {slots(12, 226, 98, 7, [
          { value: '"B2"', tag: "string" },
          { value: "14", tag: "number" },
          { value: "ticket[2]", tag: "TS2493", ghost: true },
        ])}
        <Txt x={12} y={332} tone="survey" size={12.5}>(price: number) =&gt; number</Txt>
        <Txt x={12} y={350} size={12.5} tone="fg2">a function: types in, one out</Txt>
        {fn(12, 366, 92, 26, m)}
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-shapes"
      title="An array, a tuple and a function type"
      alt="An array typed number[] is a row of slots, each holding a number, with room to grow. A tuple typed [coach: string, seat: number] has exactly two slots, a string and a number, and reading a third slot is refused with TS2493. A function typed (price: number) => number takes a number in and gives a number back."
      caption="A list has many slots of one type. A tuple has a fixed row with a type for each position. A function type is types in, one type out."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 5 ----------------------------------------------------------------

const orderTokens = ["ChaiOrder", "CoffeeOrder", "LassiOrder"];
const tokenW = (name: string) => name.length * 7.9 + 18;

/** Lesson 5: the order goes through the kind checks, and the union shrinks until nothing is left. */
export function NarrowingDiagram() {
  const rows = [
    { check: 'case "chai"', left: orderTokens, inside: "ChaiOrder" },
    { check: 'case "coffee"', left: orderTokens.slice(1), inside: "CoffeeOrder" },
    { check: 'case "lassi"', left: orderTokens.slice(2), inside: "LassiOrder" },
    { check: "default", left: [] as string[], inside: "never" },
  ];

  const tokens = (x0: number, y: number, left: string[], h = 28) => {
    let x = x0;
    return left.map((t, i) => {
      const w = tokenW(t);
      const at = x;
      x += w + 8;
      return (
        <g key={t}>
          <Box x={at} y={y} w={w} h={h} edge={i === 0 ? "survey" : "line"} />
          <Txt x={at + w / 2} y={y + h / 2 + 4.5} anchor="middle">
            {t}
          </Txt>
        </g>
      );
    });
  };

  const result = (x: number, y: number, w: number, inside: string) => (
    <g>
      <Box x={x} y={y} w={w} h={28} edge={inside === "never" ? "warn" : "survey"} />
      <Txt x={x + w / 2} y={y + 18.5} anchor="middle" tone={inside === "never" ? "warn" : "survey"}>
        {`order: ${inside}`}
      </Txt>
    </g>
  );

  const wide: Drawing = {
    viewBox: "0 0 680 300",
    draw: (m) => (
      <>
        <Tag x={14} y={22}>THE CHECK</Tag>
        <Tag x={152} y={22}>ORDER COULD STILL BE</Tag>
        <Tag x={500} y={22}>INSIDE THE BRANCH</Tag>
        {rows.map((r, i) => {
          const y = 40 + i * 62;
          return (
            <g key={r.check}>
              <Txt x={14} y={y + 19}>{r.check}</Txt>
              {r.left.length ? tokens(152, y, r.left) : (
                <g>
                  <Box x={152} y={y} w={150} h={28} edge="ghost" />
                  <Txt x={227} y={y + 18.5} anchor="middle" size={12.5} tone="fg3">nothing left</Txt>
                </g>
              )}
              <Line x1={462} y1={y + 14} x2={494} y2={y + 14} head={r.inside === "never" ? m.warn : m.accent} tone={r.inside === "never" ? "warn" : "survey"} />
              {result(500, y, 166, r.inside)}
            </g>
          );
        })}
        <Txt x={14} y={290} size={12.5} tone="fg2">switch (order.kind) removes one option at each case.</Txt>
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 452",
    draw: (m) => (
      <>
        {rows.map((r, i) => {
          const y = 12 + i * 108;
          return (
            <g key={r.check}>
              <Tag x={12} y={y + 8}>{r.check.toUpperCase()}</Tag>
              <Txt x={12} y={y + 27} size={12.5} tone="fg2">order could still be</Txt>
              {r.left.length ? tokens(12, y + 36, r.left, 26) : (
                <g>
                  <Box x={12} y={y + 36} w={150} h={26} edge="ghost" />
                  <Txt x={87} y={y + 53} anchor="middle" size={12.5} tone="fg3">nothing left</Txt>
                </g>
              )}
              <Line x1={30} y1={y + 62} x2={30} y2={y + 72} head={r.inside === "never" ? m.warn : m.accent} tone={r.inside === "never" ? "warn" : "survey"} />
              {result(12, y + 74, 168, r.inside)}
            </g>
          );
        })}
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-narrowing"
      title="The order goes through the kind checks and the union shrinks to never"
      alt="A switch on order.kind. At case chai, order could still be ChaiOrder, CoffeeOrder or LassiOrder, and inside the branch it is ChaiOrder. At case coffee it could still be CoffeeOrder or LassiOrder, and inside the branch it is CoffeeOrder. At case lassi only LassiOrder is left, and inside the branch it is LassiOrder. At default nothing is left, so order has the type never."
      caption="Each case takes one option out of the union. When every kind is handled, nothing is left and order is never, which is how the checker spots a forgotten kind."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 6 ----------------------------------------------------------------

/** Lesson 6: the tiffin box that may be empty, `?.` and `??`. */
export function TiffinDiagram() {
  const panel = (x: number, y: number, w: number, children: ReactNode) => (
    <g>
      <rect x={x} y={y} width={w} height={214} rx={2} className="fill-ground stroke-line-2" strokeWidth={1} />
      {children}
    </g>
  );

  const boxPanel = (x: number, y: number, w: number) => {
    const half = (w - 20) / 2;
    return panel(
      x,
      y,
      w,
      <>
        <Tag x={x + 10} y={y + 20}>MAYBE EMPTY</Tag>
        <Txt x={x + 10} y={y + 42} size={12.5} tone="survey">lunch: string | null</Txt>
        <Box x={x + 10} y={y + 54} w={half} h={44} edge="line" />
        <Txt x={x + 10 + half / 2} y={y + 80} anchor="middle">string</Txt>
        <Box x={x + 10 + half} y={y + 54} w={half} h={44} edge="dash" />
        <Txt x={x + 10 + half * 1.5} y={y + 80} anchor="middle" tone="fg2">null</Txt>
        <Txt x={x + 10} y={y + 124} size={12.5} tone="fg2">null: it is empty</Txt>
        <Txt x={x + 10} y={y + 142} size={12.5} tone="fg2">else: a plain string</Txt>
        <Txt x={x + 10} y={y + 174} size={12.5} tone="warn">lunch.toUpperCase()</Txt>
        <Txt x={x + 10} y={y + 191} size={12.5} tone="warn">is refused: TS18047</Txt>
      </>,
    );
  };

  const chainPanel = (x: number, y: number, w: number, m: Heads) =>
    panel(
      x,
      y,
      w,
      <>
        <Tag x={x + 10} y={y + 20}>STOPS AT EMPTY</Tag>
        <Txt x={x + 10} y={y + 42} size={12.5} tone="survey">customer.address?.city</Txt>
        <Txt x={x + 10} y={y + 68} size={12.5} tone="fg3">Asha</Txt>
        <Card x={x + 10} y={y + 76} w={80} h={30} title="address" />
        <Line x1={x + 90} y1={y + 91} x2={x + 112} y2={y + 91} head={m.accent} tone="survey" />
        <Txt x={x + 118} y={y + 96} tone="survey">{'"Pune"'}</Txt>
        <Txt x={x + 10} y={y + 130} size={12.5} tone="fg3">Ravi</Txt>
        <Box x={x + 10} y={y + 138} w={80} h={30} edge="dash" />
        <Txt x={x + 50} y={y + 157.5} anchor="middle" tone="fg2" size={12.5}>empty</Txt>
        <rect x={x + 97} y={y + 134} width={4} height={38} className="fill-warn" />
        <Txt x={x + 112} y={y + 157.5} size={12.5} tone="fg2">undefined</Txt>
        <Txt x={x + 10} y={y + 184} size={12.5} tone="fg2">result type:</Txt>
        <Txt x={x + 10} y={y + 200} size={12.5} tone="fg2">string | undefined</Txt>
      </>,
    );

  const mapRow = (x: number, y: number, input: string, output: string, wIn: number, wOut: number, m: Heads, fall = false) => (
    <g>
      <Box x={x} y={y} w={wIn} h={28} edge="line" />
      <Txt x={x + wIn / 2} y={y + 18} anchor="middle" size={12.5}>{input}</Txt>
      <Line x1={x + wIn} y1={y + 14} x2={x + wIn + 15} y2={y + 14} head={fall ? m.accent : m.grey} tone={fall ? "survey" : "grey"} />
      <Box x={x + wIn + 18} y={y} w={wOut} h={28} edge={fall ? "survey" : "line"} />
      <Txt x={x + wIn + 18 + wOut / 2} y={y + 18} anchor="middle" size={12.5} tone={fall ? "survey" : "fg"}>{output}</Txt>
    </g>
  );

  const nullishPanel = (x: number, y: number, w: number, m: Heads) =>
    panel(
      x,
      y,
      w,
      <>
        <Tag x={x + 10} y={y + 20}>ONLY FOR EMPTY</Tag>
        <Txt x={x + 10} y={y + 42} size={12.5} tone="survey">{'runs ?? "did not bat"'}</Txt>
        {mapRow(x + 10, y + 56, "82", "82", 82, 115, m)}
        {mapRow(x + 10, y + 94, "0", "0", 82, 115, m)}
        {mapRow(x + 10, y + 132, "undefined", '"did not bat"', 82, 115, m, true)}
        <Txt x={x + 10} y={y + 190} size={12.5} tone="fg2">a zero is a real answer</Txt>
      </>,
    );

  const wide: Drawing = {
    viewBox: "0 0 680 236",
    draw: (m) => (
      <>
        {boxPanel(10, 10, 190)}
        {chainPanel(210, 10, 214, m)}
        {nullishPanel(434, 10, 236, m)}
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 674",
    draw: (m) => (
      <>
        {boxPanel(9, 8, 322)}
        {chainPanel(9, 230, 322, m)}
        {nullishPanel(9, 452, 322, m)}
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-tiffin"
      title="The tiffin box that may be empty, optional chaining and nullish coalescing"
      alt="Three panels. First, a tiffin box typed string or null, with a string half and an empty null half. Checking for null first makes lunch a plain string in the else branch, and calling toUpperCase without the check is refused with TS18047. Second, optional chaining: customer.address?.city gives Pune for Asha, and stops at the missing address for Ravi, giving undefined, so the result type is string or undefined. Third, nullish coalescing: runs ?? did not bat keeps 82, keeps 0, and only replaces undefined with did not bat."
      caption="A plain string never holds null, so the type says so. ?. stops at the first empty box, and ?? gives a fallback only for null or undefined."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 7 ----------------------------------------------------------------

/** Lesson 7: the courier carries T in and out without opening the parcel, and a constraint is a size gate. */
export function CourierDiagram() {
  const parcel = (x: number, y: number, w: number, value: string, sub: string, edge: Edge = "line") => (
    <g>
      <Card x={x} y={y} w={w} h={46} title={value} sub={sub} edge={edge} subTone="survey" />
    </g>
  );

  const courierPanel = (x: number, y: number, w: number, m: Heads) => {
    const pw = 90;
    const cw = w - 2 * pw - 32;
    const lane = (ly: number, value: string, tType: string) => (
      <g>
        {parcel(x, ly, pw, value, `T = ${tType}`)}
        <Line x1={x + pw} y1={ly + 23} x2={x + pw + 13} y2={ly + 23} head={m.grey} />
        <Card x={x + pw + 16} y={ly} w={cw} h={46} title="deliver" sub="stays sealed" edge="survey" />
        <Line x1={x + pw + 16 + cw} y1={ly + 23} x2={x + pw + 29 + cw} y2={ly + 23} head={m.grey} />
        {parcel(x + pw + 32 + cw, ly, pw, value, `T = ${tType}`)}
      </g>
    );
    return (
      <g>
        <Tag x={x} y={y + 8}>THE COURIER</Tag>
        <Txt x={x} y={y + 30} tone="survey">deliver&lt;T&gt;(parcel: T): T</Txt>
        {lane(y + 44, '"laddoo"', "string")}
        {lane(y + 112, "42", "number")}
        <Txt x={x} y={y + 190} size={12.5} tone="fg2">What goes in comes out as the same T.</Txt>
      </g>
    );
  };

  const gatePanel = (x: number, y: number, w: number, m: Heads) => {
    const rows = [
      { value: '"coffee"', verdict: "passes: has a length", ok: true },
      { value: "[1, 2, 3]", verdict: "passes: has a length", ok: true },
      { value: "10", verdict: "refused: TS2345", ok: false },
    ];
    const gx = x + 118;
    return (
      <g>
        <Tag x={x} y={y + 8}>THE SIZE GATE</Tag>
        <Txt x={x} y={y + 30} tone="survey" size={12.5}>T extends {"{ length: number }"}</Txt>
        {rows.map((r, i) => {
          const ry = y + 44 + i * 54;
          return (
            <g key={r.value}>
              <Box x={x} y={ry} w={88} h={34} edge={r.ok ? "line" : "dashWarn"} />
              <Txt x={x + 44} y={ry + 21.5} anchor="middle" tone={r.ok ? "fg" : "warn"}>{r.value}</Txt>
              <Line x1={x + 88} y1={ry + 17} x2={gx - 4} y2={ry + 17} head={r.ok ? undefined : m.warn} tone={r.ok ? "grey" : "warn"} />
              <rect x={gx} y={ry - 6} width={7} height={46} className="fill-survey-2" />
              <rect x={gx + 34} y={ry - 6} width={7} height={46} className="fill-survey-2" />
              {r.ok ? (
                <Line x1={gx + 7} y1={ry + 17} x2={gx + 62} y2={ry + 17} head={m.accent} tone="survey" />
              ) : (
                <path d={`M${gx + 13} ${ry + 5} L${gx + 28} ${ry + 29} M${gx + 28} ${ry + 5} L${gx + 13} ${ry + 29}`} className="stroke-warn" strokeWidth={1.5} fill="none" />
              )}
              <Txt x={gx + 68} y={ry + 21.5} size={12.5} tone={r.ok ? "survey" : "warn"}>{r.ok ? "passes" : "refused"}</Txt>
            </g>
          );
        })}
        <Txt x={x} y={y + 212} size={12.5} tone="fg2">10 has no length, so it cannot pass.</Txt>
      </g>
    );
  };

  const wide: Drawing = {
    viewBox: "0 0 680 252",
    draw: (m) => (
      <>
        {courierPanel(14, 6, 322, m)}
        {gatePanel(362, 6, 304, m)}
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 504",
    draw: (m) => (
      <>
        {courierPanel(9, 6, 322, m)}
        {gatePanel(9, 232, 322, m)}
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-courier"
      title="The courier carries T in and out without opening the parcel, and a constraint is a size gate"
      alt="The deliver function takes a parcel of type T and gives back the same T, never opening it. Laddoo goes in as a string and comes out as a string, and 42 goes in as a number and comes out as a number. A constraint, T extends an object with a numeric length, is a size gate: the text coffee and the list 1, 2, 3 pass because they have a length, and the number 10 is refused with TS2345."
      caption="T goes in and the same T comes out. A constraint with extends is a gate: only parcels of the right size get through."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 8 ----------------------------------------------------------------

type Cell = "kept" | "optional" | "gone";
const fields = ["id", "name", "email", "password"];
const variants: { head: string; wideHead: [string, string]; cells: Cell[] }[] = [
  { head: "User", wideHead: ["User", "the original"], cells: ["kept", "kept", "kept", "kept"] },
  { head: "Partial<User>", wideHead: ["Partial", "all optional"], cells: ["optional", "optional", "optional", "optional"] },
  { head: 'Pick<User, "id" | "name">', wideHead: ["Pick", '"id" | "name"'], cells: ["kept", "kept", "gone", "gone"] },
  { head: 'Omit<User, "password">', wideHead: ["Omit", '"password"'], cells: ["kept", "kept", "kept", "gone"] },
];

function FieldCell({ x, y, w, h, field, state }: { x: number; y: number; w: number; h: number; field: string; state: Cell }) {
  return (
    <g>
      <Box x={x} y={y} w={w} h={h} edge={state === "kept" ? "survey" : state === "optional" ? "dash" : "ghost"} />
      <Txt x={x + w / 2} y={y + h / 2 + 4.5} anchor="middle" tone={state === "gone" ? "fg3" : "fg"} size={12.5} strike={state === "gone"}>
        {state === "optional" ? `${field}?` : field}
      </Txt>
    </g>
  );
}

/** Lesson 8: one User, and what Partial, Pick and Omit each keep. */
export function UtilityDiagram() {
  const legend = (x: number, y: number) => (
    <g>
      <Box x={x} y={y - 12} w={26} h={16} edge="survey" />
      <Txt x={x + 36} y={y} size={12.5} tone="fg2">kept as it was</Txt>
      <Box x={x + 168} y={y - 12} w={26} h={16} edge="dash" />
      <Txt x={x + 204} y={y} size={12.5} tone="fg2">optional (the ? mark)</Txt>
      <Box x={x + 414} y={y - 12} w={26} h={16} edge="ghost" />
      <Txt x={x + 450} y={y} size={12.5} tone="fg3" strike>dropped</Txt>
    </g>
  );

  const wide: Drawing = {
    viewBox: "0 0 680 262",
    draw: () => (
      <>
        {variants.map((v, c) => {
          const x = 14 + c * 166;
          return (
            <g key={v.head}>
              <Txt x={x} y={22} size={15} tone={c === 0 ? "fg" : "survey"}>{v.wideHead[0]}</Txt>
              <Txt x={x} y={40} size={12.5} tone="fg2">{v.wideHead[1]}</Txt>
              {v.cells.map((s, r) => (
                <FieldCell key={fields[r]} x={x} y={54 + r * 44} w={152} h={34} field={fields[r]} state={s} />
              ))}
            </g>
          );
        })}
        {legend(14, 250)}
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 396",
    draw: () => (
      <>
        {variants.map((v, r) => {
          const y = 8 + r * 74;
          return (
            <g key={v.head}>
              <Txt x={12} y={y + 14} size={12.5} tone={r === 0 ? "fg" : "survey"}>{v.head}</Txt>
              {v.cells.map((s, c) => (
                <FieldCell key={fields[c]} x={12 + c * 80} y={y + 24} w={76} h={32} field={fields[c]} state={s} />
              ))}
            </g>
          );
        })}
        <Box x={12} y={310} w={26} h={16} edge="survey" />
        <Txt x={48} y={322} size={12.5} tone="fg2">kept as it was</Txt>
        <Box x={12} y={334} w={26} h={16} edge="dash" />
        <Txt x={48} y={346} size={12.5} tone="fg2">optional (the ? mark)</Txt>
        <Box x={12} y={358} w={26} h={16} edge="ghost" />
        <Txt x={48} y={370} size={12.5} tone="fg3" strike>dropped</Txt>
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-utility"
      title="One User, and which fields Partial, Pick and Omit keep"
      alt="The User type has four fields: id, name, email and password. Partial of User keeps all four but makes each optional. Pick of User with id and name keeps id and name and drops email and password. Omit of User with password keeps id, name and email and drops password."
      caption="Same User, three views. Partial keeps every field but makes it optional, Pick keeps only what you name, and Omit keeps all but what you name."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 9 ----------------------------------------------------------------

/** Lesson 9: `unknown` at the door, a type guard, then a trusted type. `any` is the bypass door. */
export function DoorDiagram() {
  const safe = (m: Heads, vertical: boolean) => {
    const A = { title: "data from outside", sub: "unknown" };
    const B = { title: "isOrder(data)", sub: "type guard" };
    const C = { title: "Order", sub: "trusted type" };
    if (!vertical) {
      return (
        <g>
          <Tag x={14} y={20}>THE SAFE WAY: UNKNOWN FIRST</Tag>
          <Card x={14} y={32} w={170} h={58} title={A.title} sub={A.sub} subTone="survey" />
          <Line x1={184} y1={61} x2={252} y2={61} head={m.grey} />
          <Card x={255} y={32} w={170} h={58} title={B.title} sub={B.sub} edge="survey" />
          <Line x1={425} y1={61} x2={493} y2={61} head={m.accent} tone="survey" />
          <Txt x={459} y={52} size={12.5} anchor="middle" tone="survey">passes</Txt>
          <Card x={496} y={32} w={170} h={58} title={C.title} sub={C.sub} edge="survey" subTone="survey" />
          <Line x1={340} y1={90} x2={340} y2={114} head={m.warn} tone="warn" dashed />
          <Card x={255} y={117} w={170} h={36} title="undefined" sub={undefined} edge="dashWarn" titleTone="warn" />
          <Txt x={437} y={140} size={12.5} tone="warn">fails: stopped at the door</Txt>
        </g>
      );
    }
    return (
      <g>
        <Tag x={12} y={20}>THE SAFE WAY: UNKNOWN FIRST</Tag>
        <Card x={12} y={32} w={190} h={52} title={A.title} sub={A.sub} subTone="survey" />
        <Line x1={107} y1={84} x2={107} y2={108} head={m.grey} />
        <Card x={12} y={111} w={190} h={52} title={B.title} sub={B.sub} edge="survey" />
        <Line x1={107} y1={163} x2={107} y2={187} head={m.accent} tone="survey" />
        <Txt x={118} y={180} size={12.5} tone="survey">passes</Txt>
        <Card x={12} y={190} w={190} h={52} title={C.title} sub={C.sub} edge="survey" subTone="survey" />
        <Line x1={202} y1={137} x2={222} y2={137} head={m.warn} tone="warn" dashed />
        <Card x={225} y={120} w={103} h={34} title="undefined" edge="dashWarn" titleTone="warn" />
        <Txt x={225} y={172} size={12.5} tone="warn">fails: stopped</Txt>
        <Txt x={225} y={188} size={12.5} tone="warn">at the door</Txt>
      </g>
    );
  };

  const bypass = (m: Heads, vertical: boolean) => {
    if (!vertical) {
      return (
        <g>
          <Tag x={14} y={192}>THE BYPASS DOOR: ANY</Tag>
          <Card x={14} y={204} w={170} h={58} title="JSON.parse(text)" sub="returns any" edge="dashWarn" subTone="warn" />
          <Line x1={184} y1={233} x2={252} y2={233} head={m.warn} tone="warn" dashed />
          <Card x={255} y={204} w={170} h={58} title="no check here" edge="ghost" titleTone="fg3" />
          <Line x1={425} y1={233} x2={493} y2={233} head={m.warn} tone="warn" dashed />
          <Card x={496} y={204} w={170} h={58} title="Order" sub="a label only" edge="dashWarn" subTone="warn" />
        </g>
      );
    }
    return (
      <g>
        <Tag x={12} y={296}>THE BYPASS DOOR: ANY</Tag>
        <Card x={12} y={308} w={190} h={52} title="JSON.parse(text)" sub="returns any" edge="dashWarn" subTone="warn" />
        <Line x1={107} y1={360} x2={107} y2={384} head={m.warn} tone="warn" dashed />
        <Card x={12} y={387} w={190} h={52} title="no check here" edge="ghost" titleTone="fg3" />
        <Line x1={107} y1={439} x2={107} y2={463} head={m.warn} tone="warn" dashed />
        <Card x={12} y={466} w={190} h={52} title="Order" sub="a label only" edge="dashWarn" subTone="warn" />
      </g>
    );
  };

  const wide: Drawing = { viewBox: "0 0 680 276", draw: (m) => <>{safe(m, false)}{bypass(m, false)}</> };
  const narrow: Drawing = { viewBox: "0 0 340 532", draw: (m) => <>{safe(m, true)}{bypass(m, true)}</> };

  return (
    <TsFigure
      id="ts-door"
      title="Data from outside enters as unknown, passes a type guard, and only then is trusted"
      alt="The safe way: data from outside has the type unknown, goes through the type guard isOrder, and if it passes it becomes a trusted Order. If it fails, it is stopped at the door and you get undefined. The bypass door: JSON.parse returns any, which fits into the label Order with no check at all, so the Order is only a label and not a check."
      caption="unknown makes you open the parcel before you use it. any is the door with no guard on it: the label says Order, and nothing looked inside."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 10 ---------------------------------------------------------------

const rungs = [
  { name: "allowJs", found: "0" },
  { name: "checkJs", found: "1" },
  { name: "noImplicitAny", found: "6" },
  { name: "strictNullChecks", found: "7" },
  { name: "strict", found: "7" },
];

/** Lesson 10: the strictness ladder as a staircase, and the file-by-file road beside it. */
export function LadderDiagram() {
  const files = (x: number, y: number, w: number, vertical: boolean, m: Heads) => {
    const items = [
      { title: "cart.js", sub: "left as it is" },
      { title: "cart.js + JSDoc", sub: "types in comments" },
      { title: "cart.ts", sub: "real labels" },
    ];
    return (
      <g>
        <Tag x={x} y={y}>AND FILE BY FILE, SMALL FILES FIRST</Tag>
        {items.map((it, i) => {
          const bx = vertical ? x : x + i * 232;
          const by = vertical ? y + 12 + i * 70 : y + 12;
          return (
            <g key={it.title}>
              <Card x={bx} y={by} w={w} h={52} title={it.title} sub={it.sub} edge={i === 2 ? "survey" : "line"} />
              {i < 2 &&
                (vertical ? (
                  <Line x1={bx + w / 2} y1={by + 52} x2={bx + w / 2} y2={by + 67} head={m.grey} />
                ) : (
                  <Line x1={bx + w} y1={by + 26} x2={bx + 229} y2={by + 26} head={m.grey} />
                ))}
            </g>
          );
        })}
      </g>
    );
  };

  const wide: Drawing = {
    viewBox: "0 0 680 332",
    draw: (m) => (
      <>
        <Tag x={14} y={18}>THE STRICTNESS LADDER: PROBLEMS FOUND IN A SMALL CART FILE</Tag>
        {rungs.map((r, i) => {
          const h = 56 + i * 26;
          const top = 214 - h;
          const x = 14 + i * 130;
          const late = i === 3;
          return (
            <g key={r.name}>
              <Txt x={late ? x + 124 : x} y={top - 8} size={13} anchor={late ? "end" : "start"} tone={i === 4 ? "survey" : "fg"}>{r.name}</Txt>
              <rect x={x} y={top} width={126} height={h} className="fill-panel-2 stroke-survey" strokeWidth={i === 4 ? 1.5 : 1} />
              <Txt x={x + 10} y={top + 30} size={22} tone="survey">{r.found}</Txt>
              {i === 4 ? (
                <>
                  <Txt x={x + 10} y={top + 48} size={12.5} tone="fg3">found, plus</Txt>
                  <Txt x={x + 10} y={top + 64} size={12.5} tone="fg3">every new</Txt>
                  <Txt x={x + 10} y={top + 80} size={12.5} tone="fg3">strict check</Txt>
                </>
              ) : (
                <Txt x={x + 10} y={top + 48} size={12.5} tone="fg3">found</Txt>
              )}
            </g>
          );
        })}
        <line x1={14} x2={666} y1={214} y2={214} className="stroke-fg-3" strokeWidth={1} />
        {files(14, 248, 190, false, m)}
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 574",
    draw: (m) => (
      <>
        <Tag x={12} y={18}>THE STRICTNESS LADDER</Tag>
        <Txt x={12} y={36} size={12.5} tone="fg2">problems found in a small cart file</Txt>
        {rungs.map((r, i) => {
          const x0 = 12 + i * 24;
          const y = 48 + i * 46;
          return (
            <g key={r.name}>
              <rect x={x0} y={y} width={328 - x0} height={40} className="fill-panel-2 stroke-survey" strokeWidth={i === 4 ? 1.5 : 1} />
              <Txt x={x0 + 8} y={y + 25} size={13} tone={i === 4 ? "survey" : "fg"}>{`${i + 1} ${r.name}`}</Txt>
              <Txt x={322} y={y + 25} size={12.5} anchor="end" tone="survey">{`${r.found} found`}</Txt>
            </g>
          );
        })}
        <Txt x={12} y={296} size={12.5} tone="fg2">strict also switches on every</Txt>
        <Txt x={12} y={312} size={12.5} tone="fg2">new strict check.</Txt>
        {files(12, 342, 196, true, m)}
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-ladder"
      title="The strictness ladder as a staircase"
      alt="Five rungs, each finding more problems in a small cart file. Step 1, allowJs, finds 0. Step 2, checkJs, finds 1. Step 3, noImplicitAny, finds 6. Step 4, strictNullChecks, finds 7. Step 5, strict, finds 7 and switches on every new strict check. Beside the ladder, each file moves on its own: cart.js is left as it is, then gets JSDoc types in comments, then is renamed to cart.ts with real labels."
      caption="Climb one rung at a time so the problems arrive slowly. Move files one at a time too, starting with the small ones that import nothing."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- lesson 11 ---------------------------------------------------------------

/** Lesson 11: the escape hatches as skip-the-queue passes, and which the checker still inspects. */
export function PassesDiagram() {
  const rows: { pass: string; desc: string; status: string; looks: boolean }[] = [
    { pass: "any", desc: "switches it off", status: "not inspected at all", looks: false },
    { pass: "as", desc: "overrules it", status: "refused if the types share nothing", looks: true },
    { pass: "!", desc: "silences it", status: "only null and undefined pass", looks: true },
    { pass: "as unknown as T", desc: "forges a pass", status: "not inspected: a forged pass", looks: false },
    { pass: "satisfies", desc: "tells it more", status: "inspected more, not less", looks: true },
  ];

  const wide: Drawing = {
    viewBox: "0 0 680 372",
    draw: (m) => (
      <>
        <Tag x={14} y={18}>THE PASS</Tag>
        <Tag x={262} y={18}>THE CHECKER</Tag>
        <Tag x={376} y={18}>DOES IT STILL LOOK?</Tag>
        {rows.map((r, i) => {
          const y = 30 + i * 56;
          return (
            <g key={r.pass}>
              <Card x={14} y={y} w={170} h={44} title={r.pass} sub={r.desc} edge={r.looks ? "line" : "dashWarn"} subTone={r.looks ? "fg2" : "warn"} />
              <Line x1={184} y1={y + 22} x2={260} y2={y + 22} head={r.looks ? m.accent : m.warn} tone={r.looks ? "survey" : "warn"} dashed={!r.looks} />
              <Box x={262} y={y + 4} w={96} h={36} edge={r.looks ? "survey" : "ghost"} />
              <Txt x={310} y={y + 26.5} anchor="middle" tone={r.looks ? "fg" : "fg3"}>checker</Txt>
              <Txt x={376} y={y + 26.5} size={12.5} tone={r.looks ? "survey" : "warn"}>{r.status}</Txt>
            </g>
          );
        })}
        <Txt x={14} y={340} size={12.5} tone="fg2">None of them changes the data. A wrong value still crashes when it runs.</Txt>
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 474",
    draw: (m) => (
      <>
        {rows.map((r, i) => {
          const y = 10 + i * 84;
          return (
            <g key={r.pass}>
              <Card x={12} y={y} w={138} h={40} title={r.pass} edge={r.looks ? "line" : "dashWarn"} />
              <Line x1={150} y1={y + 20} x2={172} y2={y + 20} head={r.looks ? m.accent : m.warn} tone={r.looks ? "survey" : "warn"} dashed={!r.looks} />
              <Box x={174} y={y + 4} w={96} h={32} edge={r.looks ? "survey" : "ghost"} />
              <Txt x={222} y={y + 24.5} anchor="middle" tone={r.looks ? "fg" : "fg3"}>checker</Txt>
              <Txt x={12} y={y + 60} size={12.5} tone="fg2">{r.desc}</Txt>
              <Txt x={12} y={y + 76} size={12.5} tone={r.looks ? "survey" : "warn"}>{r.status}</Txt>
            </g>
          );
        })}
        <Txt x={12} y={446} size={12.5} tone="fg2">None of them changes the data.</Txt>
        <Txt x={12} y={462} size={12.5} tone="fg2">A wrong value still crashes at runtime.</Txt>
      </>
    ),
  };

  return (
    <TsFigure
      id="ts-passes"
      title="The escape hatches as passes that skip the queue"
      alt="Five passes and whether the checker still looks. any switches the checker off: not inspected at all. as overrules it, but the checker still refuses if the two types share nothing. The bang, !, silences it, but only for null and undefined. as unknown as T forges a pass and is not inspected. satisfies tells the checker more and is inspected more. None of them changes the data, so a wrong value still crashes when the program runs."
      caption="A pass gets you past the checker, not past the crash. any and the double cast skip every check. as and ! skip only part of one."
      wide={wide}
      narrow={narrow}
    />
  );
}
