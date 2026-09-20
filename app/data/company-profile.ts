import { archivedCompanyProfile } from "./archived-company-profile";
import { managementContacts } from "./management-contacts";
import { annualReport2025 } from "./annual-report-2025";
import type { ProfilePageData, ProfileSection } from "../types/profile";

function original<T extends ProfileSection["type"]>(id: string, type: T): Extract<ProfileSection, { type: T }> {
  const section = archivedCompanyProfile.sections.find(section => section.id === id);
  if (!section || section.type !== type) throw new Error(`Missing ${type} section: ${id}`);
  return section as Extract<ProfileSection, { type: T }>;
}

// The supplied 2026 profile is supplemented by MTCC's Annual Report 2025 figures.
// Earlier layouts and data remain in archived-company-profile.ts and retained components.
export const businessSections = ["infrastructure", "transport-network", "shipbuilding", "general-trading"]
  .map(id => {
    const section = original(id, "content");
    if (id === "infrastructure") return { ...section, blocks: section.blocks.filter(block =>
      !(block.type === "metrics" && block.title === "Project statistics")
    ) };
    if (id !== "transport-network") return section;
    return { ...section, blocks: section.blocks.filter(block => block.type !== "bars").map(block => {
      if (block.type === "metrics" && block.title === "RTL network") return {
        ...block,
        title: `Passenger journeys, ${annualReport2025.year}`,
        metrics: [{ value: annualReport2025.passengers, label: "Passengers carried in 2025", note: "Annual Report 2025" }],
      };
      return block;
    }) };
  });

export const companyProfile: ProfilePageData = {
  ...archivedCompanyProfile,
  hero: {
    ...archivedCompanyProfile.hero,
    image: "/assets/hero-background.webp",
    title: "Building a connected nation since 1980",
    description: "Maldives Transport and Contracting Company reclaims land, builds harbours, airports and roads, runs the country's public ferries, buses and taxis, repairs its vessels and supplies its marine engines.",
    metrics: [
      { value: annualReport2025.governmentProjects, label: "Government projects underway · Annual Report 2025" },
      { value: annualReport2025.totalAssets, label: "Total assets · 2025" },
      { value: annualReport2025.passengers, label: "Passengers carried in 2025" },
      { value: annualReport2025.employees, label: `Employees as at ${annualReport2025.employeeDate}` },
    ],
  },
  sections: [
    {
      type: "content", id: "about-mtcc", eyebrow: "Since 1980", title: "Forty-five years alongside the nation",
      blocks: [
        { type: "text", paragraphs: [
          "MTCC was incorporated in December 1980, when the Maldives was opening its doors to tourism and modernising its fisheries. The first job was practical: deliver essential infrastructure and keep the fishing fleet running with engines, parts and service.",
          "Harbours came first. Airports, roads, buildings, causeways and large dredging and reclamation works followed. So did a land and sea transport network that now connects communities across the archipelago, a boatyard with the largest docking capacity in the country, and a trading arm that brings leading marine brands to the Maldivian market.",
          "Today MTCC is the longest-serving public company in the Maldives, 64.2% government owned and ISO 9001:2015 certified.",
        ] },
        { type: "metrics", metrics: [
          { value: annualReport2025.governmentProjects, label: "Government projects underway · 2025" },
          { value: "6", label: "Dredgers, the largest fleet in the country" },
          { value: "20", label: "Atolls with MTCC operations" },
          { value: "64.2%", label: "Government ownership" },
        ] },
      ],
    },
    original("purpose", "values"),
    { ...original("portfolio", "portfolio"), title: "Our businesses, one national platform", intro: `${annualReport2025.businessAreas}. Explore the services delivered across MTCC.` },
    { ...original("project-breakdown", "content"), title: "The project portfolio" },
    original("projects", "projects"),
    { type: "content", id: "private-projects", eyebrow: "Now taking on private projects", title: "Partner with us on your reclamation project", blocks: [] },
    { ...original("milestones", "timeline"), title: "The voyage so far", items: original("milestones", "timeline").items.map(item => {
      if (item.year === "1999") return { year: "1995", title: "Dredging begins", detail: "MTCC started dredging with a few excavators." };
      if (item.year === "1980") return { ...item, detail: "MTCC was incorporated in December 1980." };
      if (item.year === "2026") return { ...item, title: "This year", detail: "Malé Taxi Line introduced. Boduthakurufaanu Magu phase 1 completed. RTL ferries begin in F and Dh atolls." };
      return item;
    }) },
    { type: "content", id: "competitive-differentiators", eyebrow: "Why MTCC", title: "Why partner with MTCC", blocks: [{ type: "text", items: [
      "Longest-serving public company in the Maldives, incorporated in 1980",
      "Largest fleet of dredging and construction equipment in the country",
      "ISO 9001:2015 certified",
      "The only company operating an integrated nationwide land and sea transport network",
      "Trading and transport revenue reduces reliance on the government project cycle",
      "First contractor to bring rock boulder breakwaters, revetments and L-section concrete quay walls to the Maldives",
    ] }] },
    { type: "content", id: "sustainability", eyebrow: "Our commitments", title: "Sustainability", blocks: [
      { type: "metrics", metrics: [{ value: annualReport2025.communitySpending, label: "CSR and community spending · 2025" }] },
      { type: "text", items: ["Electric vehicle fleet for Malé Taxi Line", "Electric bus service introduced", "Free public transport for elders and people with disabilities", "30-metre extension of the swimming area at B. Eydhafushi", "Jumhooree fountain redevelopment"] },
    ] },
    { type: "content", id: "financials", eyebrow: "Financial position", title: "Financial position, 2025", blocks: [{ type: "metrics", metrics: [
      { value: annualReport2025.totalAssets, label: "Total assets" },
      { value: annualReport2025.proposedDividendPerShare, label: "Proposed dividend per share" },
      { value: "Leading", label: "Marine contractor in the Maldives" },
      { value: "Largest", label: "Public transport provider" },
    ] }] },
    { ...original("strategy", "strategy"), title: "Where growth comes from next", pillars: [
      { title: "Sustainable growth", items: ["Target a 28% gross profit margin", "Expand high-growth revenue streams"] },
      { title: "Infrastructure leadership", items: ["Capture the national dredging pipeline", "Deliver 12 projects per quarter"] },
      { title: "Tourism expansion", items: ["Resorts, marinas and strategic partnerships", "New USD revenue opportunities"] },
      { title: "Logistics transformation", items: ["Modernise RTL and Malé Taxi Line", "Explore air cargo solutions"] },
      { title: "Digital innovation", items: ["Launch digital commerce platforms", "Automate operations"] },
      { title: "Trading growth", items: ["Expand warehousing and island-level reach", "Introduce high-demand product lines"] },
    ] },
    { type: "content", id: "digital-transformation", eyebrow: "Digital transformation", title: "Transforming MTCC for a digitally connected Maldives", blocks: [] },
    { type: "content", id: "workforce", eyebrow: "Our people", title: `${annualReport2025.employees} employees, one delivery team`, blocks: [] },
    { ...original("management", "leadership"), title: "Leadership and structure", people: managementContacts, team: undefined },
    { type: "content", id: "potential-partnerships", eyebrow: "POTENTIAL PARTNERSHIPS", title: "Opportunities to build together", intro: "MTCC welcomes strategic partnerships that combine development opportunities with national-scale delivery capability.", blocks: [] },
  ],
};
