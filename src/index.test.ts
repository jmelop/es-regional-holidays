import { describe, it, expect } from "vitest";
import {
  getAllHolidays,
  getNationalHolidays,
  getRegionalHolidaysByRegionCode,
  getLocalHolidaysByRegionCode,
  getLocalHolidaysByProvince,
  getAllHolidaysByRegionCode,
  isHoliday,
  isLocalHoliday,
  getAllRegions,
  Holiday,
} from "./index";

const Y = 2026 as const;

function isSorted<T>(items: T[], compare: (previous: T, current: T) => number): boolean {
  for (let index = 1; index < items.length; index++) {
    const previous = items[index - 1];
    const current = items[index];

    if (compare(previous, current) > 0) {
      return false;
    }
  }

  return true;
}

function cmpHoliday(a: Holiday, b: Holiday) {
  return (
    a.date.localeCompare(b.date) ||
    a.scope.localeCompare(b.scope) ||
    a.name.localeCompare(b.name) ||
    (a.region ?? "").localeCompare(b.region ?? "") ||
    (a.province ?? "").localeCompare(b.province ?? "") ||
    (a.locality ?? "").localeCompare(b.locality ?? "")
  );
}

describe("es-regional-holidays (2026)", () => {
  it("national holidays exist and include Año Nuevo", () => {
    const national = getNationalHolidays(Y);

    expect(national.length).toBeGreaterThan(0);
    expect(national.every((h) => h.scope === "national")).toBe(true);
    expect(national).toContainEqual({
      date: "2026-01-01",
      name: "Año Nuevo",
      scope: "national",
    });
  });

  it("regional holidays for CN include Día de Canarias", () => {
    const cn = getRegionalHolidaysByRegionCode("CN" as any, Y);

    expect(cn.length).toBeGreaterThan(0);
    expect(cn.every((h) => h.scope === "regional" && h.region === "CN")).toBe(true);
    expect(cn.some((h) => h.date === "2026-05-30" && h.name === "Día de Canarias")).toBe(true);
  });

  it("getAllHolidaysByRegionCode materializes national + regional (+ local)", () => {
    const cnAll = getAllHolidaysByRegionCode("CN" as any, Y);

    expect(cnAll.some((h) => h.date === "2026-01-01" && h.scope === "national")).toBe(true);
    expect(cnAll.some((h) => h.date === "2026-05-30" && h.scope === "regional")).toBe(true);
    expect(cnAll.every((h) => ["national", "regional", "local"].includes(h.scope))).toBe(true);
  });

  it("local holidays APIs return well-shaped data (when available)", () => {
    const cnLocal = getLocalHolidaysByRegionCode("CN" as any, Y);
    expect(cnLocal.every((h) => h.scope === "local" && h.region === "CN")).toBe(true);
    if (cnLocal.length) {
      expect(cnLocal.some((h) => h.province && h.locality)).toBe(true);
    }

    const vcValencia = getLocalHolidaysByProvince("VC" as any, "Valencia", Y);
    expect(vcValencia.every((h) => h.scope === "local" && h.region === "VC" && h.province === "Valencia")).toBe(true);
  });

  it("isHoliday works (string + Date) and without region checks only national", () => {
    expect(isHoliday("2026-01-01", "CN" as any, Y)).toBe(true);
    expect(isHoliday(new Date(2026, 0, 1), "CN" as any, Y)).toBe(true);

    expect(isHoliday("2026-01-01", undefined, Y)).toBe(true);
    expect(isHoliday("2026-05-30", undefined, Y)).toBe(false);
  });

  it("isLocalHoliday returns false for unknown province/locality", () => {
    expect(isLocalHoliday("2026-01-01", "VC" as any, "NOPE", "NOPE", Y)).toBe(false);
  });

  it("getAllHolidays and getAllRegions look sane", () => {
    const all = getAllHolidays(Y);
    expect(all.length).toBeGreaterThan(0);
    expect(isSorted(all, cmpHoliday)).toBe(true);

    const regions = getAllRegions(Y);
    expect(regions).toEqual([...regions].sort());
    expect(regions).toContain("CN" as any);
    expect(regions).toContain("MD" as any);
  });

  it("unsupported years return empty arrays / false", () => {
    expect(getAllHolidays(1900)).toEqual([]);
    expect(getNationalHolidays(1900)).toEqual([]);
    expect(getRegionalHolidaysByRegionCode("CN" as any, 1900)).toEqual([]);
    expect(getLocalHolidaysByRegionCode("CN" as any, 1900)).toEqual([]);
    expect(getLocalHolidaysByProvince("VC" as any, "Valencia", 1900)).toEqual([]);
    expect(isHoliday("2026-01-01", "CN" as any, 1900)).toBe(false);
    expect(isLocalHoliday("2026-01-22", "VC" as any, "Valencia", "VALENCIA", 1900)).toBe(false);
  });
});
