import {
  Box,
  Card,
  Curve,
  DimensionH,
  DimensionV,
  Line,
  Tag,
  TsFigure,
  Txt,
  type Drawing,
} from "./ts-diagrams";

/**
 * The diagrams for Off the Syllabus, in the same survey style as the courses':
 * hairlines, plotted points, one accent, tokens only. The drawing primitives
 * and the two-layout frame are The Switch's own (`ts-diagrams.tsx`); an
 * article is not a lesson, but a picture is drawn the same way. Each diagram
 * has a wide layout and a narrow one, a text alternative and a caption.
 */

// --- Core Web Vitals -------------------------------------------------------------

/** The three vitals on one time axis: when LCP happens, when a layout shift happens, and the gap INP measures. */
export function CoreVitalsDiagram() {
  const wide: Drawing = {
    viewBox: "0 0 680 246",
    draw: (m) => (
      <>
        <Tag x={8} y={54}>LOADING</Tag>
        <Tag x={8} y={106}>STABILITY</Tag>
        <Tag x={8} y={160}>RESPONSE</Tag>
        <line x1={8} x2={672} y1={76} y2={76} className="stroke-line" />
        <line x1={8} x2={672} y1={132} y2={132} className="stroke-line" />

        <DimensionH x1={150} x2={330} y={50} text="until the biggest item shows" />
        <Txt x={346} y={54} size={12.5} tone="survey">
          LCP · good: 2.5 s or less
        </Txt>

        <Box x={380} y={86} w={72} h={16} edge="ghost" />
        <Txt x={416} y={98} size={11} anchor="middle" tone="fg3">
          button
        </Txt>
        <Box x={380} y={104} w={72} h={16} edge="warn" />
        <Txt x={416} y={116} size={11} anchor="middle" tone="warn">
          button
        </Txt>
        <Txt x={470} y={100} size={12.5}>
          the button jumps down
        </Txt>
        <Txt x={470} y={120} size={12.5} tone="survey">
          CLS · good: 0.1 or less
        </Txt>

        <circle cx={500} cy={156} r={5} className="fill-survey" />
        <rect x={604} y={151} width={10} height={10} className="fill-survey" />
        <DimensionH x1={500} x2={609} y={190} text="tap to next paint" />
        <Txt x={476} y={160} size={12.5} anchor="end" tone="survey">
          INP · good: 200 ms or less
        </Txt>

        <Line x1={150} y1={214} x2={672} y2={214} head={m.grey} />
        {[330, 416, 500, 609].map((x) => (
          <line key={x} x1={x} x2={x} y1={208} y2={220} className="stroke-fg-3" strokeWidth={1.25} />
        ))}
        <Txt x={150} y={236} size={12} tone="fg3">
          page starts loading
        </Txt>
        <Txt x={672} y={236} size={12} anchor="end" tone="fg3">
          time
        </Txt>
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 424",
    draw: (m) => (
      <>
        <Line x1={28} y1={34} x2={28} y2={412} head={m.grey} />
        <Txt x={28} y={20} size={12} tone="fg3">
          page starts loading
        </Txt>

        <Box x={21} y={89} w={14} h={14} edge="survey" />
        <Txt x={48} y={96} size={13}>
          LCP: the biggest item shows
        </Txt>
        <Txt x={48} y={114} size={12.5} tone="survey">
          good: 2.5 s or less
        </Txt>

        <Box x={48} y={160} w={84} h={16} edge="ghost" />
        <Txt x={90} y={172} size={11} anchor="middle" tone="fg3">
          button
        </Txt>
        <Box x={48} y={178} w={84} h={16} edge="warn" />
        <Txt x={90} y={190} size={11} anchor="middle" tone="warn">
          button
        </Txt>
        <Box x={21} y={168} w={14} h={14} edge="warn" />
        <Txt x={144} y={174} size={12.5}>
          CLS: the button
        </Txt>
        <Txt x={144} y={192} size={12.5}>
          jumps down
        </Txt>
        <Txt x={48} y={222} size={12.5} tone="survey">
          good: 0.1 or less
        </Txt>

        <circle cx={28} cy={290} r={5} className="fill-survey" />
        <rect x={23} y={350} width={10} height={10} className="fill-survey" />
        <Txt x={44} y={294} size={12.5} tone="fg2">
          tap
        </Txt>
        <Txt x={44} y={359} size={12.5} tone="fg2">
          next paint
        </Txt>
        <DimensionV x={150} y1={290} y2={355} lines={["INP: tap to", "next paint"]} />
        <Txt x={48} y={392} size={12.5} tone="survey">
          good: 200 ms or less
        </Txt>
      </>
    ),
  };

  return (
    <TsFigure
      id="ots-vitals"
      title="Where the three Core Web Vitals sit on a page's timeline"
      alt="A time axis runs left to right from the moment the page starts loading. On it, LCP is the span from the start until the biggest item is painted, and it is good at 2.5 seconds or less. CLS is a button that jumps down when something above it loads late, and it is good at a score of 0.1 or less. INP is the gap between a tap and the next paint, and it is good at 200 milliseconds or less."
      caption="Three different moments. LCP is about the arrival, CLS is about things moving, INP is about the wait after a tap."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- PageSpeed Insights -------------------------------------------------------------

/** Where the two halves of a PageSpeed Insights report come from. */
export function FieldLabDiagram() {
  const wide: Drawing = {
    viewBox: "0 0 680 200",
    draw: (m) => (
      <>
        <Card x={8} y={20} w={210} h={66} title="Field data" sub="real visitors, 28 days" edge="survey" />
        <Card x={8} y={124} w={210} h={66} title="Lab data" sub="one simulated phone" />
        <Line x1={218} y1={53} x2={458} y2={92} head={m.accent} tone="survey" />
        <Line x1={218} y1={157} x2={458} y2={118} head={m.grey} />
        <Txt x={250} y={50} size={12.5} tone="survey">
          from CrUX
        </Txt>
        <Txt x={250} y={176} size={12.5} tone="fg2">
          from Lighthouse
        </Txt>
        <Card x={462} y={70} w={210} h={66} title="PageSpeed report" sub="both, side by side" />
      </>
    ),
  };

  const narrow: Drawing = {
    viewBox: "0 0 340 250",
    draw: (m) => (
      <>
        <Card x={12} y={12} w={150} h={58} title="Field data" sub="real visitors" edge="survey" />
        <Card x={178} y={12} w={150} h={58} title="Lab data" sub="one test phone" />
        <Line x1={87} y1={70} x2={87} y2={150} head={m.accent} tone="survey" />
        <Line x1={236} y1={70} x2={236} y2={150} head={m.grey} />
        <Txt x={97} y={100} size={12} tone="survey">
          from CrUX
        </Txt>
        <Txt x={97} y={118} size={12} tone="fg3">
          28 days
        </Txt>
        <Txt x={246} y={100} size={12} tone="fg2">
          Lighthouse
        </Txt>
        <Txt x={246} y={118} size={12} tone="fg3">
          right now
        </Txt>
        <Card x={12} y={156} w={316} h={64} title="PageSpeed report" sub="both, side by side" />
      </>
    ),
  };

  return (
    <TsFigure
      id="ots-fieldlab"
      title="Field data and lab data in a PageSpeed Insights report"
      alt="Two sources feed one report. Field data comes from the Chrome User Experience Report and describes real visitors over the previous 28 days. Lab data comes from Lighthouse, which loads the page once on a simulated phone, right now. The PageSpeed Insights report shows both, one after the other."
      caption="Field data is what happened to real people. Lab data is what one test machine saw just now."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- Typing a URL ------------------------------------------------------------------------

const steps = [
  { title: "You type", sub: "a URL" },
  { title: "DNS", sub: "name to IP" },
  { title: "Connect", sub: "TCP + TLS" },
  { title: "Request", sub: "GET /" },
  { title: "Response", sub: "HTML back" },
  { title: "Render", sub: "pixels" },
];

/** The path from an address to a painted page, one station at a time. */
export function UrlJourneyDiagram() {
  const wide: Drawing = {
    viewBox: "0 0 680 214",
    draw: (m) => {
      const xs = steps.map((_, i) => 2 + i * 116);
      return (
        <>
          <DimensionH x1={xs[1]} x2={xs[2] + 96} y={34} text="setting up the road" />
          <DimensionH x1={xs[3]} x2={xs[4] + 96} y={34} text="waiting for the server" />
          <DimensionH x1={xs[5]} x2={xs[5] + 96} y={34} text="the browser" />
          {steps.map((s, i) => (
            <Card
              key={s.title}
              x={xs[i]}
              y={52}
              w={96}
              h={62}
              title={s.title}
              sub={s.sub}
              edge={i === 5 ? "survey" : "line"}
            />
          ))}
          {xs.slice(0, 5).map((x, i) => (
            <Line key={x} x1={x + 96} y1={83} x2={xs[i + 1] - 2} y2={83} head={m.grey} />
          ))}
          <Curve d="M50 118 C 50 176, 630 176, 630 120" head={m.accent} tone="survey" dashed />
          <Txt x={340} y={200} anchor="middle" size={12.5} tone="fg3">
            a fresh cached copy skips straight to render
          </Txt>
        </>
      );
    },
  };

  const narrowSteps = [
    { title: "You type", sub: "an address" },
    { title: "DNS lookup", sub: "name to IP address" },
    { title: "Connect", sub: "TCP, then TLS" },
    { title: "Request", sub: "GET the page" },
    { title: "Response", sub: "HTML comes back" },
    { title: "Render", sub: "pixels on screen" },
  ];

  const narrow: Drawing = {
    viewBox: "0 0 340 424",
    draw: (m) => {
      const ys = narrowSteps.map((_, i) => 8 + i * 62);
      return (
        <>
          {narrowSteps.map((s, i) => (
            <Card
              key={s.title}
              x={12}
              y={ys[i]}
              w={170}
              h={44}
              title={s.title}
              sub={s.sub}
              edge={i === 5 ? "survey" : "line"}
            />
          ))}
          {ys.slice(0, 5).map((y, i) => (
            <Line key={y} x1={97} y1={y + 44} x2={97} y2={ys[i + 1] - 2} head={m.grey} />
          ))}
          <DimensionV x={204} y1={ys[1]} y2={ys[2] + 44} lines={["setting up", "the road"]} />
          <DimensionV x={204} y1={ys[3]} y2={ys[4] + 44} lines={["waiting for", "the server"]} />
          <DimensionV x={204} y1={ys[5]} y2={ys[5] + 44} lines={["the browser"]} />
          <Txt x={12} y={402} size={12} tone="fg3">
            a fresh cached copy skips
          </Txt>
          <Txt x={12} y={418} size={12} tone="fg3">
            straight to render
          </Txt>
        </>
      );
    },
  };

  return (
    <TsFigure
      id="ots-url"
      title="What happens between typing a URL and seeing the page"
      alt="Six stations in a row. You type an address. DNS turns the name into an IP address. The browser connects with TCP and TLS. It sends a request, and the server sends the HTML back. The browser then renders the page into pixels. The first three after typing are setting up the road, request and response are waiting for the server, and render is the browser's own work. A dashed line shows that a fresh cached copy skips straight to render."
      caption="Most of the wait happens before a single pixel of your page exists."
      wide={wide}
      narrow={narrow}
    />
  );
}

// --- svh, lvh and dvh --------------------------------------------------------------------

/** A phone outline: the screen, and the address bar at the top of it, shown or slid away. */
function Phone({ x, y, bar }: { x: number; y: number; bar: "shown" | "hidden" | "moving" }) {
  return (
    <g>
      <Box x={x} y={y} w={96} h={190} edge="line" />
      <Box x={x + 6} y={y + 6} w={84} h={24} edge={bar === "shown" ? "survey" : "dash"} />
      <Txt x={x + 48} y={y + 22} size={11} anchor="middle" tone={bar === "shown" ? "survey" : "fg3"}>
        address bar
      </Txt>
    </g>
  );
}

/** The three viewport heights a phone has: bar shown, bar hidden, and the one that follows. */
export function ViewportUnitsDiagram() {
  const wide: Drawing = {
    viewBox: "0 0 680 264",
    draw: () => (
      <>
        <Phone x={20} y={14} bar="shown" />
        <Phone x={250} y={14} bar="hidden" />
        <Phone x={480} y={14} bar="moving" />
        <DimensionV x={140} y1={44} y2={204} lines={["svh", "bar shown"]} />
        <DimensionV x={370} y1={14} y2={204} lines={["lvh", "bar hidden"]} />
        <DimensionV x={590} y1={14} y2={204} lines={["dvh", "follows", "the bar"]} />
        <Txt x={68} y={236} anchor="middle" size={12.5} tone="fg2">
          always fits
        </Txt>
        <Txt x={298} y={236} anchor="middle" size={12.5} tone="warn">
          overflows when the bar shows
        </Txt>
        <Txt x={528} y={236} anchor="middle" size={12.5} tone="warn">
          resizes as you scroll
        </Txt>
      </>
    ),
  };

  const row = (y: number, bar: "shown" | "hidden" | "moving", unit: string, lines: [string, string, string], tone: "fg2" | "warn") => (
    <g key={unit}>
      <Box x={20} y={y} w={64} h={108} edge="line" />
      <Box x={25} y={y + 5} w={54} h={16} edge={bar === "shown" ? "survey" : "dash"} />
      <Txt x={110} y={y + 22} size={15} tone="survey">
        {unit}
      </Txt>
      <Txt x={110} y={y + 44} size={12.5}>
        {lines[0]}
      </Txt>
      <Txt x={110} y={y + 62} size={12.5}>
        {lines[1]}
      </Txt>
      <Txt x={110} y={y + 86} size={12.5} tone={tone}>
        {lines[2]}
      </Txt>
    </g>
  );

  const narrow: Drawing = {
    viewBox: "0 0 340 384",
    draw: () => (
      <>
        {row(8, "shown", "svh", ["the visible area with", "the bar showing", "always fits"], "fg2")}
        {row(136, "hidden", "lvh", ["the visible area with", "the bar hidden", "overflows when it shows"], "warn")}
        {row(264, "moving", "dvh", ["follows the bar as it", "comes and goes", "resizes while you scroll"], "warn")}
      </>
    ),
  };

  return (
    <TsFigure
      id="ots-viewport"
      title="Three viewport heights on a phone: svh, lvh and dvh"
      alt="Three phone outlines, each with an address bar at the top. In the first the bar is showing, and the height of the visible area is svh, the small viewport; it always fits. In the second the bar has slid away, and the height is lvh, the large viewport; it overflows when the bar shows. In the third the height is dvh, the dynamic viewport, which follows the bar as it comes and goes and so resizes while you scroll."
      caption="svh is the smallest the screen gets, lvh is the largest, and dvh is whichever it is right now."
      wide={wide}
      narrow={narrow}
    />
  );
}
