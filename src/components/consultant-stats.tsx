import { consultant } from "@/data/content";
import { Reveal } from "./reveal";

/**
 * Four readings. They arrive with the same fade as everything else: an
 * earlier version counted them up, and "5 to 10" counting from "5 to 0", or
 * "1 college" from "0 college", was a visible lie for a few hundred
 * milliseconds. A number with nothing to count is just printed.
 */
export function ConsultantStats() {
  return (
    <Reveal className="mt-[clamp(24px,3.4vw,44px)] grid grid-cols-2 rounded-panel border border-line bg-panel md:grid-cols-4">
      {consultant.stats.map((stat) => (
        <div
          key={stat.label}
          className="border-b border-line-2 p-[22px] last:border-r-0 md:border-b-0 md:border-r [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r"
        >
          <div className="font-mono text-[clamp(22px,3.2vw,34px)] font-semibold tabular-nums tracking-[-0.02em] text-survey">
            {stat.value}
          </div>
          <div className="mt-[7px] text-[13.5px] leading-[1.35] text-fg-3">{stat.label}</div>
        </div>
      ))}
    </Reveal>
  );
}
