// Content adapted from MTCC-Digital-Transformation-Three-Section-Design_9408.pdf.
// The reference contains screenshot placeholders, so the website uses service diagrams.
export const digitalSystems = [
  {
    id: "pms", name: "PMS", audience: "Project delivery", title: "A clearer view of delivery.",
    description: "Bring project information into focus, from the portfolio overview to progress on the ground.",
    features: ["Portfolio and project monitoring", "Progress and reporting", "Centralised documentation"],
    attribution: "Enabled by PMS", group: "operations",
  },
  {
    id: "hris", name: "HRIS", audience: "Our people", title: "Connecting people and HR.",
    description: "Connect workforce information, everyday HR processes and employee services.",
    features: ["Workforce information", "Digital HR processes", "Employee services"],
    attribution: "Enabled by HRIS", group: "operations",
  },
  {
    id: "simplix", name: "Simplix", audience: "Approvals", title: "Visibility and accountability.",
    description: "A clearer view of what needs a decision, who is responsible and how long it has been pending.",
    features: ["Pending approvals", "Clear responsibility", "Pending duration"],
    attribution: "Enabled by Simplix", group: "operations",
  },
  {
    id: "sop", name: "SOP", audience: "Shareholders", title: "Shareholder services, digitally connected.",
    description: "Bring key shareholder services together through a simpler digital channel.",
    features: ["AGM services", "Director registration", "Digital voucher generation", "Share transfer services"],
    attribution: "Delivered through SOP", group: "access",
  },
  {
    id: "vendor", name: "Vendor Portal", audience: "Vendors", title: "Connecting vendors with MTCC.",
    description: "A central digital point for vendor information, communication and access to services.",
    features: ["Central digital access", "Consistent vendor information", "Digital communication and engagement", "Access to vendor services"],
    attribution: "Delivered through the Vendor Portal", group: "access",
  },
] as const;

export type DigitalSystemId = (typeof digitalSystems)[number]["id"];
