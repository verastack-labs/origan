import { describe, expect, it } from "vitest";
import { fit, lvh, PHONE, svh, units, visible } from "./viewport-demo";

describe("the phone demo", () => {
  it("has a small viewport that is the large one less the address bar", () => {
    expect(svh).toBe(PHONE.large - PHONE.bar);
    expect(lvh).toBe(PHONE.large);
    expect(svh).toBeLessThan(lvh);
  });

  it("sees the small viewport while the bar shows, and the large one once it is gone", () => {
    expect(visible("shown")).toBe(svh);
    expect(visible("hidden")).toBe(lvh);
  });

  it("makes plain vh the large viewport, whatever the bar is doing, and dvh the one in view", () => {
    for (const bar of ["shown", "hidden"] as const) {
      const u = units(bar);
      expect(u.vh).toBe(u.lvh);
      expect(u.svh).toBe(svh);
      expect(u.dvh).toBe(visible(bar));
    }
  });

  it("makes a 100vh box too tall with the bar showing, by exactly the bar's height", () => {
    expect(fit(units("shown").vh, "shown")).toEqual({ overflow: PHONE.bar, spare: 0 });
    expect(fit(units("hidden").vh, "hidden")).toEqual({ overflow: 0, spare: 0 });
  });

  it("makes a 100svh box fit with the bar showing, and leave the bar's height spare once it is gone", () => {
    expect(fit(units("shown").svh, "shown")).toEqual({ overflow: 0, spare: 0 });
    expect(fit(units("hidden").svh, "hidden")).toEqual({ overflow: 0, spare: PHONE.bar });
  });

  it("makes a 100dvh box fit in both, which is why it also moves", () => {
    for (const bar of ["shown", "hidden"] as const) {
      expect(fit(units(bar).dvh, bar)).toEqual({ overflow: 0, spare: 0 });
    }
    expect(units("shown").dvh).not.toBe(units("hidden").dvh);
  });
});
