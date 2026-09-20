type NavigationLink = { id: string; title: string };
type NavigationGroup = { id: string; title: string; target?: string; links: NavigationLink[] };

export const profileNavigation: NavigationGroup[] = [
  {
    id: "about", title: "About us", links: [
      { id: "about-mtcc", title: "Our story" },
      { id: "purpose", title: "Vision, mission and values" },
      { id: "milestones", title: "Milestones" },
      { id: "management", title: "Leadership and structure" },
      { id: "workforce", title: "Our people" },
      { id: "length-of-service", title: "Length of service" },
      { id: "management-team", title: "Management team" },
    ],
  },
  {
    id: "businesses", title: "What we do", links: [
      { id: "dredging", title: "Dredging and reclamation" },
      { id: "infrastructure", title: "Infrastructure" },
      { id: "transport-network", title: "Public transport" },
      { id: "shipbuilding", title: "Shipbuilding and engineering" },
      { id: "general-trading", title: "General trading" },
      { id: "fleet", title: "Our fleet and equipment" },
    ],
  },
  {
    id: "projects", title: "Projects", links: [
      { id: "project-breakdown", title: "Project portfolio" },
      { id: "projects", title: "Flagship projects" },
      { id: "private-projects", title: "Partner with us" },
      { id: "presence", title: "Present in every atoll" },
    ],
  },
  { id: "sustainability", title: "Sustainability", target: "sustainability", links: [] },
  {
    id: "investors", title: "Investor relations", links: [
      { id: "competitive-differentiators", title: "Why partner with MTCC" },
      { id: "financials", title: "Financial position" },
      { id: "strategy", title: "Growth strategy" },
    ],
  },
  { id: "vendors", title: "Vendors", target: "vendors", links: [] },
  { id: "contact", title: "Contact", target: "contact", links: [] },
];
