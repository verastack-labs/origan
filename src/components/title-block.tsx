import { site } from "@/data/site";

/**
 * The title block: the ruled table in the corner of every technical drawing
 * that says what the sheet is, who drew it, at what scale, from what datum.
 *
 * It closes the page the way a drawing closes, and it is the detail that makes
 * technical work read as expensive. Every field here is true. There is no
 * client line, because there is no client yet.
 */
const fields = [
  { k: "Project", v: site.name },
  { k: "Sheet", v: "Institutional prospectus" },
  { k: "Drawn", v: site.studio },
  { k: "Datum", v: "First semester" },
  { k: "Scale", v: "Four years" },
  { k: "Location", v: site.location },
] as const;

export function TitleBlock() {
  return (
    <div className="mt-[clamp(44px,6vw,80px)] overflow-hidden rounded-panel border border-line">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {fields.map((f) => (
          <div
            key={f.k}
            className="border-b border-r border-line-2 px-4 py-3.5 last:border-r-0 lg:border-b-0"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.13em] text-fg-3">{f.k}</div>
            <div className="mt-1.5 text-[14px] text-fg">{f.v}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-ground-2 px-4 py-3">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.11em] text-fg-3">
          Rev A · Preliminary · Not for construction
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.11em] text-fg-3">
          {site.name} · {site.studio}
        </span>
      </div>
    </div>
  );
}
