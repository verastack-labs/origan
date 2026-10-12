import { Reveal } from "./reveal";
import { coachPage } from "@/data/coach";

/**
 * A page from a surveyor's field book, used for a Campus Coach's day.
 *
 * A field book is ruled into columns and every reading is booked on the day it
 * is taken, which is exactly the point being made: what a Coach hears on
 * campus has a destination before they leave. The entries are invented, and
 * the page says so on its face.
 *
 * Wide, it is a ruled table. Narrow, each entry stacks, with time and station
 * on one line, because four columns at 343px is a table nobody can read.
 */
export function FieldBook() {
  const { day } = coachPage;

  return (
    <Reveal className="mt-[clamp(24px,3.4vw,44px)] overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-[11px]">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-2">
          {day.caption}
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-warn">
          {day.disclaimer}
        </span>
      </div>

      <table className="w-full border-collapse text-left">
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-line">
            {day.columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-[clamp(14px,2vw,22px)] py-3 font-mono text-[9.5px] font-normal uppercase tracking-[0.1em] text-fg-3 first:w-[84px] last:w-[120px] [&:nth-child(2)]:w-[190px]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {day.entries.map((entry) => (
            <tr
              key={entry.time}
              className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 border-b border-line-2 px-[clamp(14px,2vw,22px)] py-4 last:border-b-0 md:table-row md:p-0"
            >
              <td className="font-mono text-[12px] tabular-nums text-survey md:px-[clamp(14px,2vw,22px)] md:py-4 md:align-top">
                {entry.time}
              </td>
              <td className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-2 md:px-[clamp(14px,2vw,22px)] md:py-4 md:align-top md:leading-[1.6]">
                {entry.station}
              </td>
              <td className="col-span-2 text-[15px] text-fg md:col-span-1 md:px-[clamp(14px,2vw,22px)] md:py-4 md:align-top">
                {entry.observation}
              </td>
              <td className="col-span-2 md:col-span-1 md:px-[clamp(14px,2vw,22px)] md:py-4 md:align-top">
                <span className="inline-block rounded-control border border-survey-2 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.09em] text-survey">
                  <span className="md:sr-only">Booked to </span>
                  {entry.booked}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="border-t border-line bg-ground-2 px-[clamp(14px,2vw,22px)] py-4 text-[14.5px] text-fg-2">
        {day.close}
      </p>
    </Reveal>
  );
}
