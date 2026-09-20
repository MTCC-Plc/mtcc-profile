// Owned fleet and plant, as at September 2026. Machine counts are the equipment
// register, a different scope from the Annual Report 2025 headcount figures.

export type DredgerType = {
  id: "tshd" | "csd";
  name: string;
  count: number;
  summary: string;
  description: string;
};

export const dredgerCapacity = { perDay: "38,000", unit: "m³ per day", vessels: 6 };

export const dredgerTypes: DredgerType[] = [
  {
    id: "tshd",
    name: "Trailing suction hopper dredger",
    count: 1,
    summary: "3,700 m³ hopper",
    description:
      "Collects sand from deep borrow areas offshore and carries it to site, so your reclamation does not depend on sand inside the lagoon.",
  },
  {
    id: "csd",
    name: "Cutter suction dredgers",
    count: 5,
    summary: "Five vessels, several sites at once",
    description:
      "Cut and pump sand through floating pipelines straight onto the fill area. Suited to lagoons, harbours and entrance channels.",
  },
];

/** Headline machine counts, called out ahead of the full register. */
export const machineHighlights = [
  { count: 181, label: "excavators, from mini to long reach" },
  { count: 100, label: "dump trucks" },
  { count: 56, label: "wheel loaders" },
  { count: 12, label: "cranes, plus 3 crane lorries" },
  { count: 6, label: "asphalt plants of our own" },
  { count: 4, label: "concrete batching plants" },
];

export type MachineCategory = {
  name: string;
  colour: string;
  machines: { name: string; count: number }[];
};

export const machineCategories: MachineCategory[] = [
  {
    name: "Earthmoving", colour: "#0b6fc2",
    machines: [
      { name: "Excavators", count: 153 }, { name: "Wheel loaders", count: 56 },
      { name: "Mini excavators", count: 24 }, { name: "Bulldozers", count: 8 },
      { name: "Motor graders", count: 6 }, { name: "Skid steer loaders", count: 3 },
      { name: "Highbed excavators", count: 2 }, { name: "Long reach excavator", count: 1 },
      { name: "Wheel excavator", count: 1 },
    ],
  },
  {
    name: "Haulage", colour: "#0fa89c",
    machines: [
      { name: "Dump trucks", count: 100 }, { name: "Articulated trucks", count: 10 },
      { name: "Dumpers", count: 7 }, { name: "Water bowsers", count: 7 },
    ],
  },
  {
    name: "Power and welding", colour: "#6d4fd6",
    machines: [
      { name: "Welding gensets", count: 81 }, { name: "Power generators", count: 29 },
      { name: "Light generators", count: 7 },
    ],
  },
  {
    name: "Site vehicles", colour: "#5b7590",
    machines: [
      { name: "Motorcycles", count: 58 }, { name: "Pick-ups", count: 9 },
      { name: "Double cabs", count: 7 }, { name: "Forklift", count: 1 },
    ],
  },
  {
    name: "Concrete", colour: "#d9572e",
    machines: [
      { name: "Concrete mixers", count: 48 }, { name: "Batching plants", count: 4 },
      { name: "Concrete mixer trucks", count: 4 }, { name: "Concrete boom pump truck", count: 1 },
      { name: "Concrete mixer pump", count: 1 },
    ],
  },
  {
    name: "Roads and asphalt", colour: "#0b2f55",
    machines: [
      { name: "Soil compactors", count: 11 }, { name: "Rollers", count: 9 },
      { name: "Asphalt plants", count: 6 }, { name: "Double drum asphalt compactors", count: 5 },
      { name: "Pneumatic rollers", count: 5 }, { name: "Bitumen sprayers", count: 5 },
      { name: "Asphalt pavers", count: 4 }, { name: "Road marking machines", count: 3 },
      { name: "Road sweeper truck", count: 1 },
    ],
  },
  {
    name: "Lifting and piling", colour: "#35a7f0",
    machines: [
      { name: "Cranes", count: 12 }, { name: "Vibro hammers", count: 4 },
      { name: "Crane lorries", count: 3 }, { name: "Spun pile hammer", count: 1 },
    ],
  },
];

export const categoryTotal = (category: MachineCategory) =>
  category.machines.reduce((sum, machine) => sum + machine.count, 0);

export const totalMachines = machineCategories.reduce((sum, category) => sum + categoryTotal(category), 0);
