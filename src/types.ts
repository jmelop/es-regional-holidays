// src/types.ts
export type RegionCode = | "AN" | "AR" | "AS" | "CB" | "CE" | "CL" | "CM" | "CN" | "CT" | "EX" | "GA" | "IB" | "MC" | "MD" | "ML" | "NC" | "PV" | "RI" | "VC";

export type HolidayScope = "national" | "regional";

export interface Holiday {
  /** ISO date: YYYY-MM-DD */
  date: string;
  /** Holiday name in Spanish (as in BOE) */
  name: string;
  /** Region code if scoped to a region (e.g. "CN"). */
  region?: RegionCode;
  /** Region name (e.g. "Canarias") */
  regionName?: string;
  /** "national" = common to all regions. "regional" = chosen/managed by the region. */
  scope: HolidayScope;
  /** BOE id (useful for traceability) */
  source?: string;
}

export interface Region {
  code: RegionCode;
  name: string;
}

export interface HolidaysDataset {
  source: string;
  year: number;
  generated_at?: string;
  national: Array<{
    date: string;
    name: string;
    scope: "national";
  }>;
  regions: Record<
    RegionCode,
    {
      regionName: string;
      regional: Array<{
        date: string;
        name: string;
        scope: "regional";
      }>;
    }
  >;
}
