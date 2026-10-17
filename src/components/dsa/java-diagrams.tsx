import { Dimension, faint, Figure, Head, label } from "./diagrams";

/**
 * The Java Collections diagrams, in the same survey style as the DSA in Rust
 * ones: hairlines, plotted points, dimension lines, one accent. They share the
 * frame and helpers from `diagrams.tsx`.
 */

/** Lesson 0: from a .java file to output, with jshell as the shortcut. */
export function JavaSetupDiagram() {
  const stations = [
    { x: 100, top: "Hello.java", bottom: "the code you write" },
    { x: 360, top: "Hello.class", bottom: "javac compiles it" },
    { x: 620, top: "Hello, Java!", bottom: "java runs it" },
  ];

  return (
    <Figure
      id="java-setup"
      title="Write a .java file, compile it with javac, run it with java"
      caption="The two-step road: javac turns your file into a .class file, and java runs that file. jshell skips both steps for small experiments."
      viewBox="0 0 720 230"
    >
      <line x1={100} x2={620} y1={80} y2={80} className="stroke-survey-2" strokeWidth={1.5} />
      {stations.map((s, i) => (
        <g key={s.x}>
          <circle cx={s.x} cy={80} r={7} className="fill-panel stroke-survey" strokeWidth={1.5} />
          <text x={s.x} y={50} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
            {s.top}
          </text>
          <text x={s.x} y={112} textAnchor="middle" fontSize={12} className={label}>
            {s.bottom}
          </text>
          <text x={s.x} y={132} textAnchor="middle" fontSize={10} className={faint}>
            {`STATION ${i + 1}`}
          </text>
        </g>
      ))}
      {/* jshell: a shortcut that goes straight from an idea to an answer. */}
      <path
        d="M100 92 C 100 196, 620 196, 620 92"
        fill="none"
        strokeDasharray="4 4"
        className="stroke-fg-3"
        strokeWidth={1}
      />
      <text x={360} y={188} textAnchor="middle" fontSize={12} className="font-mono fill-survey">
        jshell: type a line, see the answer
      </text>
    </Figure>
  );
}

/** Lesson 1: interfaces as job descriptions, with the classes that fill them. */
export function InterfacesDiagram() {
  const box = (x: number, y: number, w: number, text: string, kind: "iface" | "class") => (
    <g key={`${text}-${x}`}>
      <rect
        x={x}
        y={y}
        width={w}
        height={34}
        className={kind === "iface" ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}
        strokeWidth={kind === "iface" ? 1.5 : 1}
        strokeDasharray={kind === "iface" ? undefined : "4 3"}
      />
      <text
        x={x + w / 2}
        y={y + 22}
        textAnchor="middle"
        fontSize={13}
        className={kind === "iface" ? "font-mono fill-fg" : "font-mono fill-fg-2"}
      >
        {text}
      </text>
    </g>
  );
  const line = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-line" strokeWidth={1} />
  );

  // The Collection family on the left, Map on its own on the right.
  const list = { x: 20, w: 90 };
  const set = { x: 130, w: 80 };
  const queue = { x: 230, w: 100 };
  const map = { x: 500, w: 90 };

  return (
    <Figure
      id="interfaces"
      title="The collection interfaces and the classes that fill them"
      caption="Interfaces are the job descriptions (solid boxes). Classes are the people who fill them (dashed outline). Map is a separate family, because it holds pairs."
      viewBox="0 0 720 340"
    >
      {box(130, 20, 130, "Collection", "iface")}
      {line(195, 54, list.x + list.w / 2, 100, "c-l")}
      {line(195, 54, set.x + set.w / 2, 100, "c-s")}
      {line(195, 54, queue.x + queue.w / 2, 100, "c-q")}
      {box(list.x, 100, list.w, "List", "iface")}
      {box(set.x, 100, set.w, "Set", "iface")}
      {box(queue.x, 100, queue.w, "Queue", "iface")}

      {line(list.x + list.w / 2, 134, list.x + list.w / 2, 190, "l-1")}
      {box(list.x - 10, 190, 110, "ArrayList", "class")}
      {box(list.x - 10, 238, 110, "LinkedList", "class")}
      {line(set.x + set.w / 2, 134, set.x + set.w / 2, 190, "s-1")}
      {box(set.x + 5, 190, 100, "HashSet", "class")}
      {box(set.x + 5, 238, 100, "TreeSet", "class")}
      {line(queue.x + queue.w / 2, 134, queue.x + queue.w / 2, 190, "q-1")}
      {box(queue.x + 20, 190, 110, "ArrayDeque", "class")}
      {box(queue.x + 20, 238, 130, "PriorityQueue", "class")}

      {box(map.x, 20, map.w, "Map", "iface")}
      {line(map.x + map.w / 2, 54, map.x + map.w / 2, 190, "m-1")}
      {box(map.x - 10, 190, 110, "HashMap", "class")}
      {box(map.x - 10, 238, 110, "TreeMap", "class")}

      <text x={20} y={304} fontSize={11} className={faint}>
        INTERFACE = WHAT THE JOB IS
      </text>
      <text x={20} y={324} fontSize={11} className={faint}>
        CLASS = WHO DOES IT, AND HOW
      </text>
      <Dimension x1={500} x2={600} y={304} text="pairs, not items" />
    </Figure>
  );
}

/** Lesson 2: a list that only accepts one kind of thing, and boxing. */
export function GenericsDiagram() {
  const names = ["Asha", "Ravi", "Meera"];

  return (
    <Figure
      id="generics"
      title="A List of String accepts words and refuses a number"
      caption="List<String> is a box labelled for words. Add a word and it goes in. Add a number and the compiler stops you before the program runs."
      viewBox="0 0 720 230"
    >
      <rect x={200} y={50} width={320} height={80} className="fill-panel-2 stroke-survey" strokeWidth={1.5} />
      <text x={200} y={40} fontSize={12} className="font-mono fill-survey">
        List&lt;String&gt;
      </text>
      {names.map((n, i) => (
        <g key={n}>
          <rect x={216 + i * 100} y={72} width={88} height={36} className="fill-ground stroke-line" strokeWidth={1} />
          <text x={260 + i * 100} y={95} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
            {n}
          </text>
        </g>
      ))}

      {/* A word goes in. */}
      <text x={60} y={95} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
        &quot;Kiran&quot;
      </text>
      <line x1={104} x2={194} y1={90} y2={90} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={196} y={90} />

      {/* A number is turned away at the door. */}
      <text x={60} y={176} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
        42
      </text>
      <line x1={86} x2={170} y1={172} y2={172} strokeDasharray="4 3" className="stroke-warn" strokeWidth={1.4} />
      <line x1={178} x2={178} y1={160} y2={184} className="stroke-warn" strokeWidth={2} />
      <text x={200} y={177} fontSize={12} className="font-mono fill-warn">
        compile error: int cannot be converted to String
      </text>
    </Figure>
  );
}

/** Lesson 3: slots in a row. Size counts the used ones, capacity all of them. */
export function ArrayListDiagram() {
  const left = 56;
  const w = 56;
  const used = ["Asha", "Ravi", "Meera", "Kiran"];

  return (
    <Figure
      id="arraylist"
      title="An ArrayList with four items in a backing array of ten slots"
      caption="Inside an ArrayList is a plain array. size() counts the slots in use. The spare slots are room to grow into, like empty coaches already hooked to the train."
      viewBox="0 0 720 210"
    >
      <Dimension x1={left} x2={left + used.length * w} y={44} text="size = 4" />
      {Array.from({ length: 10 }, (_, i) => {
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
              <text x={x + w / 2} y={93} textAnchor="middle" fontSize={11} className="font-mono fill-fg">
                {used[i]}
              </text>
            )}
            <text x={x + w / 2} y={137} textAnchor="middle" fontSize={12} className={faint}>
              {i}
            </text>
          </g>
        );
      })}
      <text x={left} y={160} fontSize={10} className={faint}>
        INDEX
      </text>
      <Dimension x1={left} x2={left + 10 * w} y={190} text="capacity = 10" />
    </Figure>
  );
}

/** Lesson 3: inserting in the middle moves everything after it. */
export function ArrayListShiftDiagram() {
  const left = 90;
  const w = 76;
  const before = ["A", "B", "C", "D"];
  const after = ["A", "NEW", "B", "C", "D"];

  const row = (items: string[], y: number, highlight: number) =>
    items.map((v, i) => (
      <g key={`${y}-${i}`}>
        <rect
          x={left + i * w}
          y={y}
          width={w}
          height={40}
          className={i === highlight ? "fill-panel-2 stroke-survey" : "fill-panel stroke-line"}
          strokeWidth={i === highlight ? 1.8 : 1}
        />
        <text x={left + i * w + w / 2} y={y + 25} textAnchor="middle" fontSize={14} className="font-mono fill-fg">
          {v}
        </text>
      </g>
    ));

  return (
    <Figure
      id="arraylist-shift"
      title="Adding at index 1 shifts B, C and D one slot to the right"
      caption="list.add(1, &quot;NEW&quot;) cannot just squeeze in. Every item from index 1 onwards moves one place right first, and that is why inserting near the front is slow."
      viewBox="0 0 720 230"
    >
      <text x={20} y={48} fontSize={10} className={faint}>
        BEFORE
      </text>
      {row(before, 28, -1)}
      <text x={20} y={178} fontSize={10} className={faint}>
        AFTER
      </text>
      {row(after, 158, 1)}
      {[1, 2, 3].map((i) => (
        <g key={i}>
          <line
            x1={left + i * w + w / 2}
            x2={left + (i + 1) * w + w / 2}
            y1={74}
            y2={150}
            className="stroke-warn"
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
        </g>
      ))}
      <text x={left + 5 * w} y={112} fontSize={12} className="font-mono fill-warn">
        3 items move
      </text>
    </Figure>
  );
}

/** Lesson 4: a chain of nodes, linked both ways. */
export function JavaLinkedListDiagram() {
  const xs = [150, 330, 510];
  const values = ["Asha", "Ravi", "Meera"];
  const top = 80;
  const mid = top + 28;

  return (
    <Figure
      id="javalist"
      title="Three nodes in a chain, each linked to the one before and the one after"
      caption="A LinkedList keeps a first and a last. Each node holds an item and two links, one to the node before and one to the node after, so it can walk either way."
      viewBox="0 0 720 230"
    >
      <text x={xs[0]} y={44} fontSize={13} className="font-mono fill-fg">
        first
      </text>
      <line x1={xs[0] + 40} x2={xs[0] + 40} y1={50} y2={top - 2} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={xs[0] + 40} y={top - 2} dir="down" />
      <text x={xs[2] + 85} y={44} fontSize={13} className="font-mono fill-fg">
        last
      </text>
      <line x1={xs[2] + 60} x2={xs[2] + 60} y1={50} y2={top - 2} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={xs[2] + 60} y={top - 2} dir="down" />

      {xs.map((x, i) => (
        <g key={x}>
          <rect x={x} y={top} width={120} height={56} className="fill-panel-2 stroke-survey" strokeWidth={1.5} />
          <line x1={x + 22} x2={x + 22} y1={top} y2={top + 56} className="stroke-line" strokeWidth={1} />
          <line x1={x + 98} x2={x + 98} y1={top} y2={top + 56} className="stroke-line" strokeWidth={1} />
          <text x={x + 60} y={mid + 5} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
            {values[i]}
          </text>
          <circle cx={x + 11} cy={mid} r={3.5} className="fill-survey" />
          <circle cx={x + 109} cy={mid} r={3.5} className="fill-survey" />
          {i < xs.length - 1 && (
            <>
              <line x1={x + 109} x2={xs[i + 1] - 2} y1={mid - 8} y2={mid - 8} className="stroke-survey-2" strokeWidth={1.4} />
              <Head x={xs[i + 1] - 2} y={mid - 8} />
              <line x1={xs[i + 1] + 11} x2={x + 122} y1={mid + 10} y2={mid + 10} className="stroke-fg-3" strokeWidth={1.2} />
              <path
                d={`M${x + 122} ${mid + 10} l8 -4 l0 8 z`}
                className="fill-fg-3"
              />
            </>
          )}
        </g>
      ))}

      <text x={xs[0] + 11} y={top + 76} textAnchor="middle" fontSize={11} className={faint}>
        prev
      </text>
      <text x={xs[0] + 60} y={top + 76} textAnchor="middle" fontSize={11} className={faint}>
        item
      </text>
      <text x={xs[0] + 109} y={top + 76} textAnchor="middle" fontSize={11} className={faint}>
        next
      </text>
      <text x={xs[0] + 11} y={top + 94} textAnchor="middle" fontSize={11} className="font-mono fill-warn">
        null
      </text>
      <text x={xs[2] + 109} y={top + 94} textAnchor="middle" fontSize={11} className="font-mono fill-warn">
        null
      </text>
      <Dimension x1={xs[0]} x2={xs[2] + 120} y={206} text="two links per node, so two ways to walk" />
    </Figure>
  );
}

/** Lesson 5: an iterator remembers the list's version, and notices a change. */
export function IteratingDiagram() {
  const left = 90;
  const w = 100;
  const items = ["Asha", "Ravi", "Meera", "Kiran"];

  return (
    <Figure
      id="iterating"
      title="An iterator keeps a copy of the list's version and compares it on every step"
      caption="The iterator wrote down the list's version when it started. Remove an item behind its back and the two numbers disagree, so the next step stops with a ConcurrentModificationException."
      viewBox="0 0 720 260"
    >
      <text x={left} y={34} fontSize={10} className={faint}>
        THE LIST
      </text>
      {items.map((v, i) => (
        <g key={v}>
          <rect
            x={left + i * w}
            y={46}
            width={w}
            height={42}
            className={i === 1 ? "fill-panel-2 stroke-survey" : "fill-panel stroke-line"}
            strokeWidth={i === 1 ? 1.8 : 1}
          />
          <text x={left + i * w + w / 2} y={72} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
            {v}
          </text>
        </g>
      ))}
      <line x1={left + w * 1.5} x2={left + w * 1.5} y1={128} y2={94} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={left + w * 1.5} y={92} dir="up" />
      <text x={left + w * 1.5} y={146} textAnchor="middle" fontSize={12} className="font-mono fill-survey">
        iterator is here
      </text>

      <rect x={left} y={176} width={190} height={44} className="fill-panel stroke-line" strokeWidth={1} />
      <text x={left + 95} y={196} textAnchor="middle" fontSize={11} className={label}>
        list version
      </text>
      <text x={left + 95} y={212} textAnchor="middle" fontSize={13} className="font-mono fill-warn">
        5
      </text>
      <text x={left + 224} y={204} textAnchor="middle" fontSize={20} className="font-mono fill-warn">
        !=
      </text>
      <rect x={left + 258} y={176} width={190} height={44} className="fill-panel stroke-line" strokeWidth={1} />
      <text x={left + 353} y={196} textAnchor="middle" fontSize={11} className={label}>
        iterator&apos;s copy
      </text>
      <text x={left + 353} y={212} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
        4
      </text>
      <text x={left + 480} y={202} fontSize={11} className="font-mono fill-warn">
        next() stops here
      </text>
      <Dimension x1={left} x2={left + 4 * w} y={244} text="someone removed an item behind the loop's back" />
    </Figure>
  );
}

/** Lesson 6: a key is turned into a bucket number; a bucket can hold a short chain. */
export function JavaHashDiagram() {
  const top = 28;
  const rowH = 26;
  const bx = 400;
  // Real bucket numbers from "name".hashCode() with 8 buckets.
  const chains: Record<number, string[]> = {
    1: ["Kiran", "Divya"],
    2: ["Ravi"],
    3: ["Asha"],
    4: ["Meera"],
  };

  return (
    <Figure
      id="java-hash"
      title="A key is turned into a bucket number, and each bucket holds a short chain"
      caption="The key's hashCode, squeezed into the number of buckets, picks the bucket at once. Kiran and Divya land in the same bucket, so that bucket keeps a short chain and checks them one by one with equals."
      viewBox="0 0 720 270"
    >
      <text x={20} y={top + 62} fontSize={13} className="font-mono fill-fg">
        &quot;Asha&quot;
      </text>
      <line x1={86} x2={150} y1={top + 58} y2={top + 58} className="stroke-survey-2" strokeWidth={1.5} />
      <Head x={152} y={top + 58} />
      <rect x={156} y={top + 36} width={136} height={44} className="fill-panel-2 stroke-survey" strokeWidth={1.5} />
      <text x={224} y={top + 55} textAnchor="middle" fontSize={11} className={label}>
        hashCode()
      </text>
      <text x={224} y={top + 72} textAnchor="middle" fontSize={12} className="font-mono fill-fg">
        2050251
      </text>
      <line x1={292} x2={bx - 54} y1={top + 58} y2={top + 3 * rowH + 13} className="stroke-survey-2" strokeWidth={1.5} />
      <text x={330} y={top + 112} fontSize={11} className={faint}>
        2050251 mod 8 = 3
      </text>

      {Array.from({ length: 8 }, (_, i) => {
        const y = top + i * rowH;
        const chain = chains[i] ?? [];
        return (
          <g key={i}>
            <rect
              x={bx - 50}
              y={y}
              width={50}
              height={rowH}
              className={i === 3 ? "fill-panel-2 stroke-survey" : "fill-panel stroke-line"}
              strokeWidth={i === 3 ? 1.8 : 1}
            />
            <text x={bx - 25} y={y + 17} textAnchor="middle" fontSize={12} className={faint}>
              {i}
            </text>
            {chain.map((name, j) => (
              <g key={name}>
                <rect
                  x={bx + 14 + j * 112}
                  y={y + 2}
                  width={92}
                  height={rowH - 4}
                  className="fill-ground stroke-line"
                  strokeWidth={1}
                />
                <text x={bx + 60 + j * 112} y={y + 17} textAnchor="middle" fontSize={12} className="font-mono fill-fg">
                  {name}
                </text>
                <line
                  x1={j === 0 ? bx : bx + 106 + (j - 1) * 112}
                  x2={bx + 14 + j * 112}
                  y1={y + rowH / 2}
                  y2={y + rowH / 2}
                  className="stroke-fg-3"
                  strokeWidth={1}
                />
              </g>
            ))}
          </g>
        );
      })}
      <text x={bx - 50} y={top + 8 * rowH + 20} fontSize={10} className={faint}>
        BUCKET NUMBER
      </text>
    </Figure>
  );
}

/** Lesson 7: twins that must agree. Equal objects must send you to the same shelf. */
export function TwinsDiagram() {
  const shelf = (x: number, n: number, hit: boolean, key: string) => (
    <g key={key}>
      <rect
        x={x}
        y={150}
        width={70}
        height={34}
        className={hit ? "fill-panel-2 stroke-survey" : "fill-panel stroke-line"}
        strokeWidth={hit ? 1.8 : 1}
      />
      <text x={x + 35} y={172} textAnchor="middle" fontSize={12} className={hit ? "font-mono fill-fg" : faint}>
        {`shelf ${n}`}
      </text>
    </g>
  );

  return (
    <Figure
      id="twins"
      title="Two equal objects must hash to the same shelf, or the lookup misses"
      caption="Left: a broken pair. a and b are equal, but their hash codes differ, so b goes to shelf 6 while a sits on shelf 11. Right: a fixed pair. Equal objects share a hash code, so b finds a on shelf 11."
      viewBox="0 0 720 250"
    >
      <text x={20} y={30} fontSize={10} className={faint}>
        BROKEN
      </text>
      <text x={20} y={70} fontSize={13} className="font-mono fill-fg">
        a (1, &quot;Asha&quot;)
      </text>
      <text x={20} y={100} fontSize={13} className="font-mono fill-fg">
        b (1, &quot;Asha K&quot;)
      </text>
      <line x1={150} x2={265} y1={66} y2={150} className="stroke-survey-2" strokeWidth={1.4} />
      <line x1={150} x2={195} y1={96} y2={150} strokeDasharray="4 3" className="stroke-warn" strokeWidth={1.4} />
      {shelf(160, 6, false, "b6")}
      {shelf(230, 11, true, "a11")}
      <text x={20} y={204} fontSize={12} className="font-mono fill-warn">
        equals says yes, hashCode says no
      </text>

      <line x1={360} x2={360} y1={24} y2={226} className="stroke-line" strokeWidth={1} />

      <text x={390} y={30} fontSize={10} className={faint}>
        FIXED
      </text>
      <text x={390} y={70} fontSize={13} className="font-mono fill-fg">
        a (1, &quot;Asha&quot;)
      </text>
      <text x={390} y={100} fontSize={13} className="font-mono fill-fg">
        b (1, &quot;Asha&quot;)
      </text>
      <line x1={520} x2={560} y1={66} y2={150} className="stroke-survey-2" strokeWidth={1.4} />
      <line x1={520} x2={570} y1={96} y2={150} className="stroke-survey-2" strokeWidth={1.4} />
      {shelf(530, 11, true, "ab11")}
      <text x={390} y={204} fontSize={12} className="font-mono fill-survey">
        equal objects, equal hashCode
      </text>
    </Figure>
  );
}

/** Lesson 8: a sorted tree. Smaller to the left, bigger to the right, and reading left to right is sorted. */
export function SortedIndexDiagram() {
  const node = (cx: number, cy: number, text: string, key: string, root = false) => (
    <g key={key}>
      <rect
        x={cx - 44}
        y={cy - 18}
        width={88}
        height={36}
        className={root ? "fill-panel-2 stroke-survey" : "fill-panel stroke-line"}
        strokeWidth={root ? 1.8 : 1}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
        {text}
      </text>
    </g>
  );
  const edge = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-fg-3" strokeWidth={1.2} />
  );

  return (
    <Figure
      id="sorted-index"
      title="A sorted tree: smaller names go left, bigger names go right"
      caption="Looking for Meera, you start at Kiran. Meera comes after Kiran, so go right, and the whole left side is ignored. Reading the tree from left to right gives the names in alphabetical order."
      viewBox="0 0 720 270"
    >
      {edge(360, 52, 200, 108, "e1")}
      {edge(360, 52, 520, 108, "e2")}
      {edge(520, 126, 430, 182, "e3")}
      {node(360, 34, "Kiran", "n1", true)}
      {node(200, 126, "Asha", "n2")}
      {node(520, 126, "Ravi", "n3")}
      {node(430, 200, "Meera", "n4")}

      <text x={60} y={126} fontSize={11} className={faint}>
        BEFORE KIRAN
      </text>
      <text x={580} y={130} fontSize={11} className={faint}>
        AFTER KIRAN
      </text>
      <Dimension x1={140} x2={600} y={252} text="read left to right: Asha, Kiran, Meera, Ravi" />
    </Figure>
  );
}

/** Lesson 9: a min-heap as a tree and as the array it is really stored in. */
export function HeapQueueDiagram() {
  const values = [1, 2, 8, 5, 3, 9];
  // Slot i sits at these tree positions.
  const pos = [
    { x: 360, y: 40 },
    { x: 240, y: 100 },
    { x: 480, y: 100 },
    { x: 180, y: 160 },
    { x: 300, y: 160 },
    { x: 540, y: 160 },
  ];
  const parentOf = (i: number) => Math.floor((i - 1) / 2);
  const left = 150;
  const w = 70;

  return (
    <Figure
      id="heap-queue"
      title="A priority queue is a heap: the smallest item is always at the top"
      caption="Every parent is smaller than its children, so the top is the smallest and poll() takes it first. The same tree lives in a plain array: the children of slot i are slots 2i+1 and 2i+2."
      viewBox="0 0 720 300"
    >
      {pos.map((p, i) =>
        i === 0 ? null : (
          <line
            key={`e${i}`}
            x1={pos[parentOf(i)].x}
            y1={pos[parentOf(i)].y + 16}
            x2={p.x}
            y2={p.y - 16}
            className="stroke-fg-3"
            strokeWidth={1.2}
          />
        ),
      )}
      {pos.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={17}
            className={i === 0 ? "fill-panel-2 stroke-survey" : "fill-panel stroke-line"}
            strokeWidth={i === 0 ? 1.8 : 1}
          />
          <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
            {values[i]}
          </text>
        </g>
      ))}
      <text x={392} y={30} fontSize={11} className="font-mono fill-survey">
        poll() takes this
      </text>

      <text x={left} y={222} fontSize={10} className={faint}>
        THE SAME HEAP IN AN ARRAY
      </text>
      {values.map((v, i) => (
        <g key={`a${i}`}>
          <rect
            x={left + i * w}
            y={232}
            width={w}
            height={34}
            className={i === 0 ? "fill-panel-2 stroke-survey" : "fill-panel stroke-line"}
            strokeWidth={i === 0 ? 1.8 : 1}
          />
          <text x={left + i * w + w / 2} y={254} textAnchor="middle" fontSize={13} className="font-mono fill-fg">
            {v}
          </text>
          <text x={left + i * w + w / 2} y={286} textAnchor="middle" fontSize={11} className={faint}>
            {i}
          </text>
        </g>
      ))}
    </Figure>
  );
}

/** Lesson 10: binary search halves the part still in play at every step. */
export function BinarySearchDiagram() {
  const values = [10, 20, 30, 40, 50, 60, 70, 80];
  const left = 80;
  const w = 70;

  // lo and hi are inclusive; mid is the item looked at.
  const row = (y: number, lo: number, hi: number, mid: number, note: string, key: string) => (
    <g key={key}>
      {values.map((v, i) => {
        const inPlay = i >= lo && i <= hi;
        return (
          <g key={i}>
            <rect
              x={left + i * w}
              y={y}
              width={w}
              height={38}
              className={i === mid ? "fill-panel-2 stroke-survey" : inPlay ? "fill-panel stroke-line" : "fill-ground stroke-line"}
              strokeWidth={i === mid ? 1.8 : 1}
              strokeDasharray={inPlay ? undefined : "4 3"}
            />
            <text
              x={left + i * w + w / 2}
              y={y + 24}
              textAnchor="middle"
              fontSize={13}
              className={inPlay ? "font-mono fill-fg" : faint}
            >
              {v}
            </text>
          </g>
        );
      })}
      <text x={left} y={y + 62} fontSize={12} className={label}>
        {note}
      </text>
    </g>
  );

  return (
    <Figure
      id="binary-search"
      title="Binary search for 60 in a sorted row of eight takes two looks"
      caption="Look at the middle. If it is too small, the whole left half is out. Each look throws away half of what is left, so even a million items need only about twenty looks. It only works if the row is sorted."
      viewBox="0 0 720 240"
    >
      <text x={left} y={26} fontSize={10} className={faint}>
        LOOK 1: THE MIDDLE IS 40, TOO SMALL
      </text>
      {row(34, 0, 7, 3, "so everything up to 40 is out", "r1")}
      <text x={left} y={146} fontSize={10} className={faint}>
        LOOK 2: THE MIDDLE OF WHAT IS LEFT IS 60
      </text>
      {row(154, 4, 7, 5, "found at index 5", "r2")}
    </Figure>
  );
}

/** Lesson 11: the decision guide as a flow. Three questions lead to one class. */
export function ChoosingDiagram() {
  const question = (cx: number, cy: number, w: number, text: string, key: string) => (
    <g key={key}>
      <rect x={cx - w / 2} y={cy - 18} width={w} height={36} className="fill-panel-2 stroke-survey" strokeWidth={1.5} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={12} className="font-mono fill-fg">
        {text}
      </text>
    </g>
  );
  const leaf = (x: number, y: number, name: string, hint: string) => (
    <g key={name}>
      <rect x={x} y={y} width={200} height={40} className="fill-ground stroke-line" strokeWidth={1} />
      <text x={x + 10} y={y + 17} fontSize={13} className="font-mono fill-fg">
        {name}
      </text>
      <text x={x + 10} y={y + 32} fontSize={10} className={label}>
        {hint}
      </text>
    </g>
  );
  const line = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-fg-3" strokeWidth={1.2} />
  );

  const top = 246;
  const col = { map: 20, set: 250, list: 480 };

  return (
    <Figure
      id="choosing"
      title="Which collection? Answer up to three questions"
      caption="Start at the top. Do you look things up by a key? If not, must each item appear once? If not, how will the items be used? The class at the end of the path is your first choice."
      viewBox="0 0 720 400"
    >
      {question(360, 34, 290, "Do you look things up by a key?", "q1")}
      {line(300, 52, 120, top - 22, "q1-yes")}
      <text x={190} y={120} fontSize={11} className="font-mono fill-survey">
        yes
      </text>
      {line(420, 52, 470, 88, "q1-no")}
      <text x={456} y={74} fontSize={11} className="font-mono fill-survey">
        no
      </text>

      {question(470, 106, 240, "Each item only once?", "q2")}
      {line(420, 124, 350, top - 22, "q2-yes")}
      <text x={366} y={170} fontSize={11} className="font-mono fill-survey">
        yes
      </text>
      {line(540, 124, 600, 162, "q2-no")}
      <text x={582} y={150} fontSize={11} className="font-mono fill-survey">
        no
      </text>

      {question(600, 180, 230, "How is it used?", "q3")}
      {line(600, 198, 580, top - 22, "q3-go")}

      <text x={col.map} y={top - 8} fontSize={10} className={faint}>
        A MAP, WHEN ORDER IS...
      </text>
      {leaf(col.map, top, "HashMap", "any order, fastest lookup")}
      {leaf(col.map, top + 50, "LinkedHashMap", "the order you added")}
      {leaf(col.map, top + 100, "TreeMap", "keys sorted")}

      <text x={col.set} y={top - 8} fontSize={10} className={faint}>
        A SET, WHEN ORDER IS...
      </text>
      {leaf(col.set, top, "HashSet", "any order, fastest check")}
      {leaf(col.set, top + 50, "LinkedHashSet", "the order you added")}
      {leaf(col.set, top + 100, "TreeSet", "items sorted")}

      <text x={col.list} y={top - 8} fontSize={10} className={faint}>
        A LIST OR QUEUE, WHEN YOU...
      </text>
      {leaf(col.list, top, "ArrayList", "read by position")}
      {leaf(col.list, top + 50, "ArrayDeque", "work at the ends: stack, queue")}
      {leaf(col.list, top + 100, "PriorityQueue", "need the most urgent first")}
    </Figure>
  );
}

/** Lesson 12: fail-fast stops on a change; fail-safe reads a private snapshot. */
export function FailFastDiagram() {
  const cell = (x: number, y: number, text: string, kind: "live" | "snap" | "new", key: string) => (
    <g key={key}>
      <rect
        x={x}
        y={y}
        width={64}
        height={34}
        className={kind === "new" ? "fill-panel-2 stroke-survey" : "fill-panel stroke-line"}
        strokeWidth={kind === "new" ? 1.8 : 1}
        strokeDasharray={kind === "snap" ? "4 3" : undefined}
      />
      <text x={x + 32} y={y + 22} textAnchor="middle" fontSize={12} className="font-mono fill-fg">
        {text}
      </text>
    </g>
  );

  return (
    <Figure
      id="fail-fast"
      title="Fail-fast stops when the list changes. Fail-safe reads a private snapshot."
      caption="Left: an ArrayList iterator reads the live list, so a change makes it stop. Right: a CopyOnWriteArrayList iterator holds the old array, and a change builds a new array beside it, so the loop never notices."
      viewBox="0 0 720 270"
    >
      <text x={20} y={26} fontSize={10} className={faint}>
        FAIL-FAST: ARRAYLIST
      </text>
      {["Asha", "Ravi", "Meera"].map((n, i) => cell(20 + i * 70, 44, n, "live", `l${i}`))}
      <text x={20} y={108} fontSize={12} className="font-mono fill-survey">
        loop reads the live list
      </text>
      <line x1={20} x2={230} y1={134} y2={134} className="stroke-warn" strokeWidth={1.4} strokeDasharray="4 3" />
      <text x={20} y={156} fontSize={12} className="font-mono fill-fg">
        someone removes Ravi
      </text>
      <text x={20} y={190} fontSize={12} className="font-mono fill-warn">
        next step: ConcurrentModificationException
      </text>

      <line x1={360} x2={360} y1={20} y2={250} className="stroke-line" strokeWidth={1} />

      <text x={390} y={26} fontSize={10} className={faint}>
        FAIL-SAFE: COPYONWRITEARRAYLIST
      </text>
      <text x={390} y={64} fontSize={11} className={label}>
        loop holds
      </text>
      {["Asha", "Ravi", "Meera"].map((n, i) => cell(480 + i * 70, 44, n, "snap", `s${i}`))}
      <text x={390} y={124} fontSize={11} className={label}>
        list now
      </text>
      {["Asha", "Ravi", "Meera", "Kiran"].map((n, i) =>
        cell(390 + i * 70, 134, n, i === 3 ? "new" : "live", `n${i}`),
      )}
      <text x={390} y={196} fontSize={12} className="font-mono fill-survey">
        an add copies the array first
      </text>
      <text x={390} y={218} fontSize={12} className="font-mono fill-fg-2">
        the loop finishes on the old one
      </text>
    </Figure>
  );
}
