// Previous combined profile retained for future sections and reference.
import { corporateProfile, investorProfile } from "./profiles";
import type { ProfilePageData } from "../types/profile";

const sections = new Map([...corporateProfile.sections, ...investorProfile.sections].map(section => [section.id, section]));
const about = sections.get("about-mtcc")!;
const story = sections.get("who-we-are")!;
if (about.type === "content" && story.type === "story") {
  sections.set(about.id, { ...about, blocks: [...about.blocks, { type: "text", title: "Our role in national development", paragraphs: story.body }] });
}
const trading = sections.get("general-trading")!;
const products = sections.get("trading-products")!;
if (trading.type === "content" && products.type === "content") {
  const productBrands = products.blocks.flatMap(block => block.type === "brands" ? block.items : []);
  sections.set(trading.id, { ...trading, blocks: trading.blocks.map(block => {
    if (block.type !== "brands") return block;
    const brands = new Map(block.items.map(brand => [brand.name, { ...brand }]));
    for (const brand of productBrands) {
      const existing = brands.get(brand.name);
      if (!existing) brands.set(brand.name, brand);
      else if (existing.product !== brand.product) existing.product += ` · ${brand.product}`;
    }
    return { ...block, items: [...brands.values()] };
  }) });
}

const highlights = sections.get("highlights")!;
if (highlights.type === "metrics") {
  sections.set(highlights.id, { ...highlights, intro: `${investorProfile.hero.description} ${highlights.intro}` });
}

// Keep the detailed corporate service copy inside its corresponding business.
const coreServices = sections.get("services");
const serviceDestinations: Record<string, string> = {
  "Dredging & Reclamation": "infrastructure",
  "Infrastructure Development": "infrastructure",
  "Public Transport": "transport-network",
  "Ship Building & Repair": "shipbuilding",
  "General Trading": "general-trading",
};
if (coreServices?.type === "services") {
  coreServices.items.forEach((service, index) => {
    const destination = sections.get(serviceDestinations[service.title]);
    if (destination?.type !== "content") throw new Error(`Missing business for ${service.title}`);
    sections.set(destination.id, { ...destination, serviceDetails: [
      ...(destination.serviceDetails ?? []), { ...service, id: `service-detail-${index + 1}` },
    ] });
  });
  const portfolio = sections.get("portfolio");
  if (portfolio?.type === "portfolio") sections.set(portfolio.id, { ...portfolio, intro: `${portfolio.intro} ${coreServices.intro}` });
}

const management = sections.get("management");
const team = sections.get("team");
if (management?.type === "leadership" && team?.type === "people") {
  sections.set(management.id, { ...management, title: "Our organisation & people", team });
}

const order = [
  "about-mtcc", "purpose", "milestones", "highlights", "financials", "portfolio",
  "infrastructure", "project-breakdown", "projects", "transport-network", "shipbuilding", "general-trading",
  "management", "competitive-differentiators", "sustainability", "strategy", "partnership",
];

export const archivedCompanyProfile: ProfilePageData = {
  ...corporateProfile,
  slug: "company-profile",
  navigationLabel: "Company Profile",
  sections: order.map(id => {
    const section = sections.get(id);
    if (!section) throw new Error(`Missing company section: ${id}`);
    return section;
  }),
};
