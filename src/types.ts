export type RegionCode = string;

export interface Holiday {
  date: string; // "2026-01-06"
  name: string; // "Día de Reyes"
  region?: RegionCode; // "MD"
  regionName?: string; // "Comunidad de Madrid"
  national?: boolean;
}
