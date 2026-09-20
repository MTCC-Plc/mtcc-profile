// The project register, two ways to read it. Values are MVR millions.
//
// "Register" is the full portfolio as it stood on 9 September 2026 — a different
// scope from the Annual Report 2025 government-projects count, which is why the
// two totals do not reconcile. "Record" splits work on hand from work completed
// since 2021.

export type RegisterSector = {
  name: string;
  projects: number;
  /** Contract value, MVR millions. */
  value: number;
  types: { name: string; count: number }[];
};

export type RecordSector = {
  name: string;
  onHandProjects: number;
  /** On-hand value, MVR millions. */
  onHandValue: number;
  completedProjects: number;
  /** Value completed since 2021, MVR millions. */
  completedValue: number;
};

export const registerDate = "9 September 2026";

export const registerSectors: RegisterSector[] = [
  {
    name: "Reclamation and private developments", projects: 97, value: 11440,
    types: [{ name: "Reclamation", count: 86 }, { name: "Private developments", count: 11 }],
  },
  {
    name: "Coastal and marine works", projects: 250, value: 9810,
    types: [
      { name: "Harbours", count: 137 }, { name: "Shore protection", count: 87 },
      { name: "Beaches and swimming areas", count: 14 }, { name: "Jetties", count: 8 },
      { name: "Channel dredging", count: 3 }, { name: "Survey", count: 1 },
    ],
  },
  {
    name: "Buildings", projects: 455, value: 5770,
    types: [
      { name: "Sports facilities", count: 165 }, { name: "Education", count: 71 },
      { name: "Health", count: 63 }, { name: "Police", count: 60 },
      { name: "Waste management centres", count: 44 }, { name: "Mosques", count: 24 },
      { name: "Civic buildings", count: 22 }, { name: "Industrial", count: 6 },
    ],
  },
  {
    name: "Roads, airports and causeways", projects: 66, value: 5340,
    types: [
      { name: "Roads", count: 37 }, { name: "Airports", count: 16 },
      { name: "Causeways and bridges", count: 7 }, { name: "Utilities", count: 4 },
      { name: "Ferry terminals", count: 2 },
    ],
  },
];

/** Signed and in the pipeline. Stated rather than summed: it counts projects the
 *  sector breakdown does not itemise. */
export const registerTotals = { projects: 868, value: 32350 };

export const recordSectors: RecordSector[] = [
  { name: "Reclamation and shore protection", onHandProjects: 126, onHandValue: 13130, completedProjects: 19, completedValue: 1200 },
  { name: "Harbour and marine infrastructure", onHandProjects: 119, onHandValue: 7230, completedProjects: 19, completedValue: 628.89 },
  { name: "Airports, roads and causeways", onHandProjects: 33, onHandValue: 3590, completedProjects: 8, completedValue: 970.42 },
  { name: "Buildings and other infrastructure", onHandProjects: 173, onHandValue: 4310, completedProjects: 13, completedValue: 78.97 },
  { name: "Outdoor spaces and facilities", onHandProjects: 54, onHandValue: 154.91, completedProjects: 20, completedValue: 24.23 },
];
