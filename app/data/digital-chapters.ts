// Copy and capability groupings from the supplied September 2026 screenshots.
export const digitalChapters = [
  {
    id: "foundations",
    label: "Digital Foundations",
    eyebrow: "Building digital foundations",
    title: "Building the capabilities for lasting transformation.",
    description: "Digital workplace tools, organized information and shared services provide the foundations for more connected ways of working.",
    capabilities: [
      { title: "People & workplace", description: "Supporting employee access to information and everyday services." },
      { title: "Information & records", description: "Strengthening how documents and organizational information are managed." },
      { title: "Data & shared services", description: "Developing reusable capabilities that support digital initiatives." },
    ],
    platforms: ["HRIS", "MyMTCC", "EDMS", "Data Gudhan"],
    outcome: "A foundation for consistent processes and scalable digital services.",
  },
  {
    id: "operations",
    label: "Smarter Operations",
    eyebrow: "Transforming how we work",
    title: "Turning digital capability into better ways of working.",
    description: "Digital platforms support clearer project information, structured workflows and operational oversight across MTCC.",
    capabilities: [
      { title: "Delivery visibility", description: "Bringing project progress and delivery information into clearer view." },
      { title: "Operational coordination", description: "Supporting maintenance activities and day-to-day operational workflows." },
      { title: "Review & accountability", description: "Structuring approvals and oversight activities around clear responsibilities." },
    ],
    platforms: ["PMS", "CMMS", "Simplix", "AMT"],
    outcome: "Greater visibility and control to support disciplined execution.",
  },
  {
    id: "services",
    label: "Connected Services",
    eyebrow: "Connecting people & services",
    title: "Extending digital access across the MTCC ecosystem.",
    description: "Digital channels support how customers, shareholders, partners and the public access information and engage with MTCC.",
    capabilities: [
      { title: "Customers & public", description: "Access to services, transport information and project information." },
      { title: "Shareholders", description: "Access to registration and shareholder-related processes." },
      { title: "Business partners", description: "Digital channels for supplier engagement and collaboration." },
    ],
    platforms: ["Customer Portal", "RTL", "Project Dashboard", "SOP", "Vendor Portal"],
    outcome: "Broader access and more convenient stakeholder engagement.",
  },
] as const;
