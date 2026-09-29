import { alongside } from "@/data/content";
import { Reveal } from "./reveal";

function Dash() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-1 shrink-0">
      <path d="M3.5 7h7" stroke="currentColor" strokeWidth={1.4} />
    </svg>
  );
}

function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mt-1 shrink-0">
      <path d="M3 7.4l2.8 2.8L11 4.6" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

/**
 * Two readings taken from the same point. The left column is deliberately the
 * quieter surface: this section is not an attack on campus trainers, it is a
 * statement that the two measure different things.
 */
export function Alongside() {
  return (
    <section
      id="alongside"
      className="border-y border-line bg-ground-2 py-[clamp(60px,8.5vw,120px)]"
    >
      <div className="mx-auto max-w-[1240px] px-[clamp(18px,4vw,60px)]">
        <Reveal variant="label" className="notation">
          Two readings from the same point
        </Reveal>
        <Reveal
          as="h2"
          variant="plot"
          className="mt-3.5 max-w-[17ch] text-[clamp(27px,4.6vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]"
        >
          {alongside.heading.before}
          <em className="not-italic text-survey">{alongside.heading.accent}</em>
          {alongside.heading.after}
        </Reveal>
        <Reveal as="p" className="mt-4 max-w-[52ch] text-fg-2">
          {alongside.body}
        </Reveal>

        <Reveal className="mt-[clamp(24px,3.4vw,44px)] grid grid-cols-1 overflow-hidden rounded-panel border border-line md:grid-cols-2">
          <div className="border-b border-line bg-ground-2 p-[clamp(20px,2.8vw,32px)] md:border-b-0 md:border-r">
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.11em] text-fg-3">
              {alongside.training.label}
            </h4>
            <ul>
              {alongside.training.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 border-b border-line-2 py-2.5 text-[15.5px] text-fg-2 last:border-b-0"
                >
                  <Dash />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-panel p-[clamp(20px,2.8vw,32px)]">
            <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.11em] text-survey">
              {alongside.origan.label}
            </h4>
            <ul>
              {alongside.origan.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 border-b border-line-2 py-2.5 text-[15.5px] text-fg last:border-b-0"
                >
                  <span className="text-survey">
                    <Check />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
