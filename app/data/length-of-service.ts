// Length of service across the workforce. Tier counts nest: everyone in the 25+
// tier is also counted in 15+ and 5+, so the cumulative totals below are the sum
// of every tier at or above the threshold.

export type ServiceTier = {
  /** Lower bound of the tier, in years. */
  min: number;
  badge: string;
  count: number;
  label: string;
  note: string;
  colour: string;
};

export const serviceTiers: ServiceTier[] = [
  {
    min: 25, badge: "25+", count: 51, label: "25 years and above", colour: "#8ccbff",
    note: "Our veterans. They were here before MTCC's first cutter dredger arrived in 2002.",
  },
  {
    min: 15, badge: "15+", count: 289, label: "15 to 25 years", colour: "#5fe0d2",
    note: "On the team when we completed our first airport runway, and every airport since.",
  },
  {
    min: 5, badge: "5+", count: 1421, label: "5 to 15 years", colour: "#c4b2ff",
    note: "The people who launched the RTL network and deliver today's national portfolio.",
  },
];

export type ServiceThreshold = {
  min: number;
  option: string;
  total: number;
  label: string;
  /** Combined years of MTCC service held by everyone at or above this threshold. */
  years: string;
};

export const serviceThresholds: ServiceThreshold[] = [
  { min: 5, option: "5+ years", total: 1761, label: "people with five years or more at MTCC", years: "12,700 years" },
  { min: 15, option: "15+ years", total: 340, label: "people with fifteen years or more at MTCC", years: "5,600 years" },
  { min: 25, option: "25+ years", total: 51, label: "people with more than twenty-five years at MTCC", years: "1,270 years" },
];
