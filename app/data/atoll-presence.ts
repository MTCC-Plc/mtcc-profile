// Nationwide footprint, grouped the way the atoll chain reads on the map.
// `code` matches the pin ids on the Maldives map in public/assets/maldives-atolls.svg;
// `x` and `y` are the pin tip in that file's viewBox ("110 -6 400.28 815"), taken from
// the atoll map published on projects.mtcc.com.mv so the pins land on the same islands.
// Atolls with no listed work are still served through project teams and the RTL network.

export type PresenceKind = "project" | "transport";

export type AtollEntry = {
  kind: PresenceKind;
  detail: string;
  /** Contract value in MVR millions, where the figure is public. */
  value?: number;
};

export type Atoll = {
  code: string;
  name: string;
  x: number;
  y: number;
  entries: AtollEntry[];
};

export type AtollRegion = {
  name: string;
  atolls: Atoll[];
};

export const atollRegions: AtollRegion[] = [
  {
    name: "Northern atolls",
    atolls: [
      {
        code: "HA", name: "Haa Alif", x: 278.98, y: 52.08,
        entries: [
          { kind: "project", detail: "HA. Hoarafushi Airport, completed in 2019" },
          { kind: "transport", detail: "RTL buses in Dhidhdhoo and high-speed ferries since 2020" },
        ],
      },
      {
        code: "HDh", name: "Haa Dhaalu", x: 292.94, y: 90.19,
        entries: [{ kind: "transport", detail: "RTL buses in Kulhudhuffushi City and high-speed ferries since 2020" }],
      },
      { code: "Sh", name: "Shaviyani", x: 299.91, y: 141.6, entries: [] },
      {
        code: "N", name: "Noonu", x: 316.3, y: 171.67,
        entries: [{ kind: "project", detail: "Maafaru Airport development and expansion, phase 2", value: 419 }],
      },
      {
        code: "R", name: "Raa", x: 273.92, y: 192.57,
        entries: [{ kind: "transport", detail: "RTL buses in Dhuvaafaru since 2025" }],
      },
      {
        code: "B", name: "Baa", x: 272.64, y: 241.04,
        entries: [{ kind: "project", detail: "Eydhafushi swimming area extended by 30 metres, a community project" }],
      },
      { code: "Lh", name: "Lhaviyani", x: 340.41, y: 214.83, entries: [] },
    ],
  },
  {
    name: "Central atolls",
    atolls: [
      {
        code: "K", name: "Kaafu", x: 332.79, y: 302.99,
        entries: [
          { kind: "project", detail: "Malé road development: north Boduthakurufaanu Magu, phase 1 completed in 2026", value: 134 },
          { kind: "project", detail: "Thilafushi boatyard, the largest docking capacity in the country" },
          { kind: "transport", detail: "Greater Malé buses and ferries, over 15 million passengers a year" },
          { kind: "transport", detail: "Malé Taxi Line, 150 electric cars" },
        ],
      },
      { code: "AA", name: "Alif Alif", x: 255.24, y: 329.74, entries: [] },
      { code: "ADh", name: "Alif Dhaal", x: 263.22, y: 382.19, entries: [] },
      { code: "V", name: "Vaavu", x: 345.08, y: 401.62, entries: [] },
      {
        code: "F", name: "Faafu", x: 267.93, y: 425.04,
        entries: [{ kind: "transport", detail: "RTL ferries from 2026" }],
      },
      {
        code: "Dh", name: "Dhaalu", x: 266.96, y: 463.42,
        entries: [{ kind: "transport", detail: "RTL ferries from 2026" }],
      },
      {
        code: "M", name: "Meemu", x: 327.45, y: 449.42,
        entries: [{ kind: "project", detail: "M. Muli Airport, design and build", value: 202 }],
      },
    ],
  },
  {
    name: "Southern atolls",
    atolls: [
      {
        code: "Th", name: "Thaa", x: 288.35, y: 501.8,
        entries: [
          { kind: "project", detail: "Th. Kinbidhoo dredging and land reclamation", value: 137 },
          { kind: "project", detail: "Thimarafushi runway, our first airport project, 2012" },
        ],
      },
      {
        code: "L", name: "Laamu", x: 316.65, y: 543.23,
        entries: [
          { kind: "project", detail: "160 housing units in L. Gan, 2007" },
          { kind: "transport", detail: "RTL buses in Gan and Isdhoo" },
        ],
      },
      { code: "GA", name: "Gaafu Alif", x: 309.68, y: 667.47, entries: [] },
      {
        code: "GDh", name: "Gaafu Dhaalu", x: 278.51, y: 700.83,
        entries: [{ kind: "project", detail: "GDh. Faresmaathodaa Airport, design and build", value: 207 }],
      },
      {
        code: "Gn", name: "Gnaviyani", x: 310.87, y: 763.26,
        entries: [
          { kind: "project", detail: "Fuvahmulah City internal roads, design and build", value: 303 },
          { kind: "transport", detail: "RTL buses in Fuvahmulah City" },
        ],
      },
      {
        code: "S", name: "Seenu", x: 282.99, y: 790.48,
        entries: [{ kind: "transport", detail: "RTL buses in Addu City" }],
      },
    ],
  },
];

export const presenceMetrics = [
  { value: "20", label: "atolls with MTCC projects and services" },
  { value: "868", label: "projects in the national portfolio" },
  { value: "151", label: "scheduled ferry and bus routes" },
  { value: "17.6M", label: "passengers carried a year" },
];

export const allAtolls = atollRegions.flatMap(region => region.atolls);
