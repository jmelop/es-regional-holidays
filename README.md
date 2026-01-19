# es-regional-holidays

es-regional-holidays is a lightweight, TypeScript-first library that provides official public holidays in Spain by year and autonomous community, with optional support for local (municipal) holidays.

It is framework-agnostic and works with React, Angular, Vue, and plain Node.js.

## Features

- National, regional, and local (municipal) holidays
- Single normalized dataset per year
- Optional province and locality-level data
- Fully typed with TypeScript
- Compatible with modern bundlers (ESM and CJS)
- Zero runtime dependencies

## Installation

The package is available on npm.

Using npm:
npm install es-regional-holidays

Using yarn:
yarn add es-regional-holidays

Using pnpm:
pnpm add es-regional-holidays

## Usage

### Get all holidays for a region

Returns **national + regional + local** holidays for a region and year.

```ts
import { getAllHolidaysByRegionCode } from "es-regional-holidays";

const holidays = getAllHolidaysByRegionCode("CN", 2026);
```

Example result:

```ts
[
  { date: "2026-01-01", name: "Año Nuevo", scope: "national" },
  { date: "2026-01-06", name: "Epifanía del Señor", scope: "regional", region: "CN" },
  { date: "2026-05-30", name: "Día de Canarias", scope: "regional", region: "CN" }
]
```

### National holidays only

```ts
import { getNationalHolidays } from "es-regional-holidays";

const national = getNationalHolidays(2026);
```

### Regional holidays only

```ts
import { getRegionalHolidaysByRegionCode } from "es-regional-holidays";

const regional = getRegionalHolidaysByRegionCode("MD", 2026);
```

### Local (municipal) holidays

```ts
import { getLocalHolidaysByProvince } from "es-regional-holidays";

const valenciaLocal = getLocalHolidaysByProvince("VC", "Valencia", 2026);
```

### Check if a date is a holiday

```ts
import { isHoliday } from "es-regional-holidays";

isHoliday("2026-01-01");           // true (national)
isHoliday("2026-05-30", "CN");     // true (regional)
isHoliday("2026-05-30", "MD");     // false
```

Accepts both `YYYY-MM-DD` strings and `Date` objects.

### Check local holidays only

```ts
import { isLocalHoliday } from "es-regional-holidays";

isLocalHoliday("2026-01-22", "VC", "Valencia", "VALENCIA");
```

### List supported regions

```ts
import { getAllRegions } from "es-regional-holidays";

const regions = getAllRegions(2026);
```

Region codes follow official BOE abbreviations.

## Data model

```ts
export interface Holiday {
  date: string;
  name: string;
  scope: "national" | "regional" | "local";
  region?: string;
  regionName?: string;
  province?: string;
  locality?: string;
}
```

## National vs regional classification

Holiday classification follows administrative practice, not just legal origin.

In the BOE, holidays are marked as:
- `*` -> National holiday, not substitutable
- `**` -> National holiday, substitutable by the autonomous community
- `***` -> Regional holiday

In this library, holidays are classified as:
- `*` -> National holiday
- `**` -> Regional holiday
- `***` -> Regional holiday

Some holidays are national in origin but managed by autonomous communities. To reflect real regional calendars, these holidays are exposed as regional in the API.

## Data source

All holiday data is extracted from the official BOE resolution published each year.
For example, BOE-A-2025-21667 for the year 2026.

Raw BOE data is preserved internally for traceability and reproducibility.

## Supported years

- 2026

Additional years will be added incrementally.

## License

MIT License
Copyright (c) Juan Melo

## Contributing

Issues and pull requests are welcome.
The project aims to remain small, predictable, and dependency-free.
