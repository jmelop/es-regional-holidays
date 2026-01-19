# es-regional-holidays

es-regional-holidays es una librería ligera, TypeScript-first, que proporciona los festivos oficiales en España por año y comunidad autónoma, con soporte opcional para festivos locales (municipales).

Es agnóstica al framework y funciona con React, Angular, Vue y Node.js puro.

## Características

- Festivos nacionales, autonómicos y locales (municipales)
- Un único dataset normalizado por año
- Datos opcionales a nivel de provincia y municipio
- Totalmente tipada con TypeScript
- Compatible con bundlers modernos (ESM y CJS)
- Cero dependencias en tiempo de ejecución

## Instalación

El paquete está disponible en npm.

Usando npm:
npm install es-regional-holidays

Usando yarn:
yarn add es-regional-holidays

Usando pnpm:
pnpm add es-regional-holidays

## Uso

### Obtener todos los festivos de una comunidad

Devuelve los festivos **nacionales + autonómicos + locales** para una comunidad y un año.

```ts
import { getAllHolidaysByRegionCode } from "es-regional-holidays";

const holidays = getAllHolidaysByRegionCode("CN", 2026);
```

Ejemplo de resultado:

```ts
[
  { date: "2026-01-01", name: "Año Nuevo", scope: "national" },
  { date: "2026-01-06", name: "Epifanía del Señor", scope: "regional", region: "CN" },
  { date: "2026-05-30", name: "Día de Canarias", scope: "regional", region: "CN" }
]
```

### Solo festivos nacionales

```ts
import { getNationalHolidays } from "es-regional-holidays";

const national = getNationalHolidays(2026);
```

### Solo festivos autonómicos

```ts
import { getRegionalHolidaysByRegionCode } from "es-regional-holidays";

const regional = getRegionalHolidaysByRegionCode("MD", 2026);
```

### Festivos locales (municipales)

```ts
import { getLocalHolidaysByProvince } from "es-regional-holidays";

const valenciaLocal = getLocalHolidaysByProvince("VC", "Valencia", 2026);
```

### Comprobar si una fecha es festivo

```ts
import { isHoliday } from "es-regional-holidays";

isHoliday("2026-01-01");           // true (nacional)
isHoliday("2026-05-30", "CN");     // true (autonómico)
isHoliday("2026-05-30", "MD");     // false
```

Acepta tanto strings `YYYY-MM-DD` como objetos `Date`.

### Comprobar solo festivos locales

```ts
import { isLocalHoliday } from "es-regional-holidays";

isLocalHoliday("2026-01-22", "VC", "Valencia", "VALENCIA");
```

### Listar comunidades soportadas

```ts
import { getAllRegions } from "es-regional-holidays";

const regions = getAllRegions(2026);
```

Los códigos de comunidad siguen las abreviaturas oficiales del BOE.

## Modelo de datos

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

## Clasificación nacional vs autonómica

La clasificación de festivos sigue la práctica administrativa real, no solo el origen legal.

En el BOE, los festivos se marcan como:
- `*` -> Festivo nacional no sustituible
- `**` -> Festivo nacional sustituible por la comunidad autónoma
- `***` -> Festivo autonómico

En esta librería se exponen como:
- `*` -> Nacional
- `**` -> Autonómico
- `***` -> Autonómico

Algunos festivos son de origen nacional pero están gestionados por las comunidades autónomas. Para reflejar los calendarios reales, estos festivos se exponen como autonómicos en la API.

## Fuente de datos

Los datos se obtienen principalmente del calendario oficial de la Seguridad Social y se contrastan con la resolución anual publicada en el BOE.
Por ejemplo, BOE-A-2025-21667 para el año 2026.

Los datos en bruto se conservan internamente para trazabilidad y reproducibilidad.

## Años soportados

- 2026

Se añadirán más años de forma incremental.

## Licencia

MIT License  
Copyright (c) Juan Melo

## Contribuir

Issues y pull requests son bienvenidos.  
El objetivo del proyecto es mantenerse pequeño, predecible y sin dependencias.
