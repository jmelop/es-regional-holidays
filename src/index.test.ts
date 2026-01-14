import { describe, it, expect } from "vitest";
import {
  getAllHolidays,
  getNationalHolidays,
  getRegionalHolidaysByRegionCode,
  getAllHolidaysByRegionCode,
  isHoliday,
  getAllRegions,
} from "./index";

describe("es-regional-holidays (2026)", () => {
  it("returns national holidays for 2026", () => {
    const national = getNationalHolidays(2026);

    expect(national.length).toBeGreaterThan(0);
    expect(national.every(h => h.scope === "national")).toBe(true);
    expect(national.some(h => h.date === "2026-01-01" && h.name === "Año Nuevo")).toBe(true);
  });

  it("returns regional holidays for Canarias (CN)", () => {
    const cn = getRegionalHolidaysByRegionCode("CN" as any, 2026);

    expect(cn.length).toBeGreaterThan(0);
    expect(cn.every(h => h.scope === "regional")).toBe(true);
    expect(cn.every(h => h.region === "CN")).toBe(true);
    expect(cn.some(h => h.date === "2026-05-30" && h.name === "Día de Canarias")).toBe(true);
  });

  it("materializes national + regional for Canarias (CN)", () => {
    const cnAll = getAllHolidaysByRegionCode("CN" as any, 2026);

    expect(cnAll.some(h => h.date === "2026-01-01" && h.scope === "national")).toBe(true);
    expect(cnAll.some(h => h.date === "2026-05-30" && h.scope === "regional")).toBe(true);
  });

  it("getAllHolidays returns a globally sorted list", () => {
    const all = getAllHolidays(2026);
    expect(all.length).toBeGreaterThan(0);

    for (let i = 1; i < all.length; i++) {
      const prev = all[i - 1];
      const curr = all[i];

      const byDate = prev.date.localeCompare(curr.date);
      if (byDate < 0) continue;
      if (byDate > 0) throw new Error("List is not sorted by date");

      const byName = prev.name.localeCompare(curr.name);
      if (byName < 0) continue;
      if (byName > 0) throw new Error("List is not sorted by name for same date");

      const byRegion = (prev.region ?? "").localeCompare(curr.region ?? "");
      if (byRegion > 0) throw new Error("List is not sorted by region for same date and name");
    }
  });

  it("isHoliday works with string and with Date", () => {
    expect(isHoliday("2026-01-01", "CN" as any, 2026)).toBe(true);
    expect(isHoliday("2026-05-30", "CN" as any, 2026)).toBe(true);

    expect(isHoliday(new Date(2026, 0, 1), "CN" as any, 2026)).toBe(true);
  });

  it("isHoliday without region checks only national holidays", () => {
    expect(isHoliday("2026-01-01", undefined, 2026)).toBe(true);
    expect(isHoliday("2026-05-30", undefined, 2026)).toBe(false);
  });

  it("getAllRegions includes CN and MD", () => {
    const regions = getAllRegions(2026);

    expect(regions.includes("CN" as any)).toBe(true);
    expect(regions.includes("MD" as any)).toBe(true);
  });

  it("unsupported years return empty arrays / false", () => {
    expect(getAllHolidays(1900).length).toBe(0);
    expect(getNationalHolidays(1900).length).toBe(0);
    expect(getRegionalHolidaysByRegionCode("CN" as any, 1900).length).toBe(0);
    expect(isHoliday("2026-01-01", "CN" as any, 1900)).toBe(false);
  });
});
