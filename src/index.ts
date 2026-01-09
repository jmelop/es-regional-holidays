import type { RegionCode, Holiday, HolidaysDataset} from './types';
import dataset2026 from "./data/boe_holidays_2026_national_regional.json";

export type { RegionCode, Holiday, HolidaysDataset } from './types';

const DATASETS: Record<number, HolidaysDataset> = {
  2026: dataset2026 as HolidaysDataset,
};

function getDataset(year?: number): HolidaysDataset | undefined {
  const y = year ?? 2026;
  return DATASETS[y];
}

export function getAllHolidays(year?: number): Holiday[] {
  const dataset = getDataset(year);
  if (!dataset) return [];

  const result: Holiday[] = [];

  // National holidays
  for (const nationalHoliday of dataset.national) {
    result.push({
      date: nationalHoliday.date,
      name: nationalHoliday.name,
      scope: nationalHoliday.scope,
      source: dataset.source,
    });
  }

  // Regional holidays
  for (const [code, regionData] of Object.entries(dataset.regions) as Array<
    [RegionCode, HolidaysDataset["regions"][RegionCode]]
  >) {
    for (const regionalHoliday of regionData.regional) {
      result.push({
        date: regionalHoliday.date,
        name: regionalHoliday.name,
        scope: regionalHoliday.scope,
        region: code,
        regionName: regionData.regionName,
        source: dataset.source,
      });
    }
  }

  // Order by date
  result.sort((a, b) =>
    a.date === b.date ? a.name.localeCompare(b.name) : a.date.localeCompare(b.date)
  );

  return result;
}

export function getAllRegionalHolidays(): Holiday[] {
    const t: Holiday[] = [];
    return t;
}

export function getNationalHolidays(): Holiday[] {
    const t: Holiday[] = [];
    return t;
}

export function getAllHolidaysByRegionCode(region: RegionCode): Holiday[] {
    const t: Holiday[] = [];
    return t;
}

export function getRegionalHolidaysByRegionCode(region: RegionCode): Holiday[] {
    const t: Holiday[] = [];
    return t;
}

export function getNationalHolidaysByRegionCode(region: RegionCode): Holiday[] {
    const t: Holiday[] = [];
    return t;
}

export function isHoliday(date: string, region?: RegionCode): boolean {
    return false;
}

export function getRegions(): RegionCode[] {
    const t: RegionCode[] = [];
    return t;
}