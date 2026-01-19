// src/types.ts

export type RegionCode =
  | "AN" | "AR" | "AS" | "CB" | "CE" | "CL" | "CM" | "CN" | "CT"
  | "EX" | "GA" | "IB" | "MC" | "MD" | "ML" | "NC" | "PV" | "RI" | "VC";

export type HolidayScope = "national" | "regional" | "local";

/** Entry as stored in the source dataset */
export interface HolidayEntry {
  date: string; // YYYY-MM-DD
  name: string;
}

/** Resolved holiday returned by the API */
export interface Holiday {
  date: string;
  name: string;
  scope: HolidayScope;

  region?: RegionCode;
  regionName?: string;

  province?: string;
  locality?: string;
}

/** Local holidays grouped by province */
export interface ProvinceSource {
  localities: Record<string, HolidayEntry[]>;
}

/** Region source data */
export interface RegionSource {
  regionName: string;
  regional: HolidayEntry[];
  provinces?: Record<string, ProvinceSource>;
}

/** Source dataset for a given year */
export interface HolidaysDataset {
  year: number;
  generated_at?: string;

  national: HolidayEntry[];
  regions: Record<RegionCode, RegionSource>;
}
