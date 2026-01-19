// src/index.ts
import type {
  RegionCode,
  Holiday,
  HolidaysDataset,
  ProvinceSource,
  HolidayEntry,
} from "./types";
import dataset2026 from "./data/es_holidays_2026.json";

export type { RegionCode, Holiday, HolidaysDataset } from "./types";

const DEFAULT_YEAR = 2026;

const DATASETS: Record<number, HolidaysDataset> = {
  2026: dataset2026 as HolidaysDataset,
};

function getDataset(year?: number): HolidaysDataset | undefined {
  const y = year ?? DEFAULT_YEAR;
  return DATASETS[y];
}

function toIsoDate(date: string | Date): string {
  if (typeof date === "string") return date;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function sortHolidays(left: Holiday, right: Holiday): number {
  return (
    left.date.localeCompare(right.date) ||
    left.scope.localeCompare(right.scope) ||
    left.name.localeCompare(right.name) ||
    (left.region ?? "").localeCompare(right.region ?? "") ||
    (left.province ?? "").localeCompare(right.province ?? "") ||
    (left.locality ?? "").localeCompare(right.locality ?? "")
  );
}

function flattenProvinces(region: RegionCode, regionName: string, provinces?: Record<string, ProvinceSource>): Holiday[] {
  if (!provinces) return [];

  const result: Holiday[] = [];

  for (const [province, provinceData] of Object.entries(provinces)) {
    result.push(
      ...flattenLocalities(region, regionName, province, provinceData.localities)
    );
  }

  return result;
}

function flattenLocalities(region: RegionCode, regionName: string, province: string, localities: Record<string, HolidayEntry[]>): Holiday[] {
  const result: Holiday[] = [];

  for (const [locality, holidays] of Object.entries(localities)) {
    for (const h of holidays) {
      result.push({
        date: h.date,
        name: h.name,
        scope: "local",
        region,
        regionName,
        province,
        locality,
      });
    }
  }

  return result;
}

function flattenLocalHolidays(region: RegionCode, regionName: string, provinces?: Record<string, ProvinceSource>): Holiday[] {
  return flattenProvinces(region, regionName, provinces);
}

export function getAllHolidays(year?: number): Holiday[] {
  const dataset = getDataset(year);
  if (!dataset) return [];

  const holidays: Holiday[] = [];

  // National
  for (const h of dataset.national) {
    holidays.push({ date: h.date, name: h.name, scope: "national" });
  }

  // Regional + Local
  for (const regionKey in dataset.regions) {
    const region = regionKey as RegionCode;
    const regionData = dataset.regions[region];

    for (const h of regionData.regional) {
      holidays.push({
        date: h.date,
        name: h.name,
        scope: "regional",
        region,
        regionName: regionData.regionName,
      });
    }

    holidays.push(
      ...flattenLocalHolidays(region, regionData.regionName, regionData.provinces)
    );
  }

  return holidays.sort(sortHolidays);
}

export function getNationalHolidays(year?: number): Holiday[] {
  const dataset = getDataset(year);
  if (!dataset) return [];

  return dataset.national
    .map((h) => ({ date: h.date, name: h.name, scope: "national" as const }))
    .sort(sortHolidays);
}

export function getRegionalHolidaysByRegionCode(region: RegionCode, year?: number): Holiday[] {
  const dataset = getDataset(year);
  if (!dataset) return [];

  const regionData = dataset.regions[region];
  if (!regionData) return [];

  return regionData.regional
    .map((h) => ({
      date: h.date,
      name: h.name,
      scope: "regional" as const,
      region,
      regionName: regionData.regionName,
    }))
    .sort(sortHolidays);
}

/**
 * Local holidays for a region (resolved from provinces/localities)
 */
export function getLocalHolidaysByRegionCode(region: RegionCode, year?: number): Holiday[] {
  const dataset = getDataset(year);
  if (!dataset) return [];

  const regionData = dataset.regions[region];
  if (!regionData?.provinces) return [];

  return flattenLocalHolidays(region, regionData.regionName, regionData.provinces).sort(
    sortHolidays
  );
}

/**
 * Local holidays filtered by province (province key as stored in the dataset).
 */
export function getLocalHolidaysByProvince(region: RegionCode, province: string, year?: number): Holiday[] {
  const dataset = getDataset(year);
  if (!dataset) return [];

  const regionData = dataset.regions[region];
  const provinceData = regionData?.provinces?.[province];
  if (!regionData || !provinceData) return [];

  return flattenLocalities(region, regionData.regionName, province, provinceData.localities).sort(
    sortHolidays
  );
}

/**
 * Checks if a date is a holiday in Spain.
 * - Without region: checks only national holidays.
 * - With region: checks national + regional + local holidays for that region.
 */
export function isHoliday(date: string | Date, region?: RegionCode, year?: number): boolean {
  const iso = toIsoDate(date);

  if (!region) {
    return getNationalHolidays(year).some((h) => h.date === iso);
  }

  return getAllHolidaysByRegionCode(region, year).some((h) => h.date === iso);
}

/**
 * Checks if a date is a LOCAL (municipal) holiday.
 * Province and locality must match the dataset keys exactly.
 */
export function isLocalHoliday(date: string | Date, region: RegionCode, province: string, locality: string, year?: number): boolean {
  const iso = toIsoDate(date);

  const dataset = getDataset(year);
  if (!dataset) return false;

  const localityHolidays =
    dataset.regions[region]?.provinces?.[province]?.localities?.[locality];

  if (!localityHolidays) return false;

  return localityHolidays.some((h) => h.date === iso);
}

export function getAllHolidaysByRegionCode(region: RegionCode, year?: number): Holiday[] {
  const holidays = [
    ...getNationalHolidays(year),
    ...getRegionalHolidaysByRegionCode(region, year),
    ...getLocalHolidaysByRegionCode(region, year),
  ];

  return holidays.sort(sortHolidays);
}

export function getAllRegions(year?: number): RegionCode[] {
  const dataset = getDataset(year);
  if (!dataset) return [];
  return Object.keys(dataset.regions).sort() as RegionCode[];
}
