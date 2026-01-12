# es-regional-holidays

es-regional-holidays is a lightweight, TypeScript-first library that provides official public holidays in Spain by year and autonomous community, based on data published in the Boletín Oficial del Estado (BOE).

The library is framework-agnostic and can be used with React, Angular, Vue, or plain Node.js projects.

## Features

- Official holiday data sourced from the BOE
- Clear distinction between national and regional holidays
- Zero runtime dependencies
- Fully typed with TypeScript
- Compatible with modern bundlers (ESM and CJS)

## Installation

The package is available on npm.

Using npm:
npm install es-regional-holidays

Using yarn:
yarn add es-regional-holidays

Using pnpm:
pnpm add es-regional-holidays

## Basic usage

### Get all holidays for a region

Returns all applicable holidays for a given region and year, including national common holidays and region-managed holidays.

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

## Check if a date is a holiday

```ts
import { isHoliday } from "es-regional-holidays";

isHoliday("2026-05-30", "CN");
isHoliday("2026-05-30", "MD");
```

The function accepts both YYYY-MM-DD strings and Date objects.

## National holidays only

```ts
import { getNationalHolidays } from "es-regional-holidays";

const nationalHolidays = getNationalHolidays(2026);
```

## Regional holidays only

```ts
import { getRegionalHolidaysByRegionCode } from "es-regional-holidays";

const regionalHolidays = getRegionalHolidaysByRegionCode("MD", 2026);
```

## List supported regions

```ts
import { getRegions } from "es-regional-holidays";

const regions = getRegions();
```

Region codes follow the official BOE abbreviations.

## Holiday data model

```ts
export interface Holiday {
  date: string;
  name: string;
  region?: string;
  regionName?: string;
  scope: "national" | "regional";
  source?: string;
}
```

## National vs regional classification

Holiday classification follows administrative practice, not just legal origin.

In the BOE, holidays are marked as:
- `*` National holiday, not substitutable
- `**` National holiday, substitutable by the autonomous community
- `***` Regional holiday

In this library, holidays are classified as:
- `*` -> national
- `**` -> regional
- `***` -> regional

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
