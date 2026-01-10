import type { RegionCode, Holiday, HolidaysDataset } from './types';
import dataset2026 from "./data/boe_holidays_2026_national_regional.json";

export type { RegionCode, Holiday, HolidaysDataset } from './types';

const DATASETS: Record<number, HolidaysDataset> = {
  2026: dataset2026 as HolidaysDataset,
};

function getDataset(year?: number): HolidaysDataset | undefined {
  const y = year ?? 2026;
  return DATASETS[y];
}

function sortHolidaysByDate(a: Holiday, b: Holiday): number {
  const byDate = a.date.localeCompare(b.date);
  if (byDate !== 0) return byDate;

  const byName = a.name.localeCompare(b.name);
  if (byName !== 0) return byName;

  return (a.region ?? "").localeCompare(b.region ?? "");
}

export function getAllHolidays(year?: number): Holiday[] {
  const dataset = getDataset(year);
  if (!dataset) return [];

  const result: Holiday[] = [];

  for (const nationalHoliday of dataset.national) {
    result.push({
      date: nationalHoliday.date,
      name: nationalHoliday.name,
      scope: "national",
      source: dataset.source,
    });
  }

  for (const [code, regionData] of Object.entries(dataset.regions) as Array<
    [RegionCode, HolidaysDataset["regions"][RegionCode]]
  >) {
    for (const regionalHoliday of regionData.regional) {
      result.push({
        date: regionalHoliday.date,
        name: regionalHoliday.name,
        scope: "regional",
        region: code,
        regionName: regionData.regionName,
        source: dataset.source,
      });
    }
  }

  return result.sort(sortHolidaysByDate);
}

export function getNationalHolidays(year?: number): Holiday[] {
  const dataset = getDataset(year);
  if (!dataset) return [];
  return dataset.national.map(nationalHoliday => ({
    date: nationalHoliday.date,
    name: nationalHoliday.name,
    scope: "national",
    source: dataset.source,
  }));
}

export function getRegionalHolidaysByRegionCode(region: RegionCode, year?: number): Holiday[] {
  const dataset = getDataset(year);
  if (!dataset) return [];

  const regionData = dataset.regions[region];
  if (!regionData) return [];

  return regionData.regional.map(regionalHoliday => ({
    date: regionalHoliday.date,
    name: regionalHoliday.name,
    scope: "regional",
    region,
    regionName: regionData.regionName,
    source: dataset.source,
  }));
}

export function getAllHolidaysByRegionCode(
  region: RegionCode,
  year?: number
): Holiday[] {
  const holidays = [
    ...getNationalHolidays(year),
    ...getRegionalHolidaysByRegionCode(region, year),
  ];

  return holidays.sort(sortHolidaysByDate);
}


export function isHoliday(date: string | Date, region?: RegionCode, year?: number): boolean {
  const iso = date instanceof Date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : date;

  if (region) return getAllHolidaysByRegionCode(region, year).some(h => h.date === iso);
  return getNationalHolidays(year).some(h => h.date === iso);
}

export function getAllRegions(year?: number): RegionCode[] {
  const dataset = getDataset(year);
  if (!dataset) return [];
  return Object.keys(dataset.regions).sort() as RegionCode[];
}