import { fourProblems } from "@/data/content";
import { Reveal } from "./reveal";
import { glyphs, type GlyphName } from "./survey-glyphs";

/**
 * The four problems the hero names, each read against its fix. One bordered
 * panel ruled into four cells, the same instrument as the Coach's readings,
 * so the row reads as one statement rather than four cards. The problem sits
 * quiet above the rule; the fix carries the weight below it.
 */
export function FourProblems() {
  return (
    <section id="four" className="border-b border-line-2 py-[clamp(40px,5.5vw,72px)]">
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,4vw,60px)]">
        <Reveal variant="label" className="notation">
          {fourProblems.notation}
        </Reveal>

        <Reveal className="mt-[clamp(18px,2.4vw,28px)] grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {fourProblems.items.map((item, i) => {
            const Mark = glyphs[item.glyph as GlyphName];
            return (
              <div key={item.fix} className="flex flex-col bg-panel p-[clamp(18px,2vw,24px)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-3">
                    Problem {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-survey">
                    <Mark size={18} />
                  </span>
                </div>
                {/* Two lines held at the widest layout, so the rule under every
                    problem sits at one height across the row. */}
                <p className="mt-2.5 text-[15.5px] leading-[1.4] text-fg-2 lg:min-h-[2.8em]">{item.problem}</p>
                <div className="mt-4 border-t border-line-2 pt-4">
                  <h3 className="text-[clamp(19px,1.8vw,22px)] font-semibold leading-[1.2] tracking-[-0.022em]">
                    {item.fix}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.45] text-fg-2">{item.body}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
