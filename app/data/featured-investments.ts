export const economicHub = {
  id: "economic-hub",
  title: "Integrated Economic Hub",
  subtitle: "Gaadhoo Integrated Economic Destination",
  overview: [
    "Strategically located in the Maldives near the One-and-a-Half Degree Channel, the Integrated Economic Hub is envisioned as a large-scale, multi-sector destination bringing together maritime, logistics, tourism, hospitality, commercial, sports and entertainment activities.",
    "The development comprises several independently investable projects, creating opportunities for international investors, developers, operators and strategic partners to participate across multiple sectors.",
  ],
  projects: [
    {
      id: "transshipment-port",
      title: "International Transshipment Port",
      image: { src: "/assets/investments/transshipment-port.webp", alt: "Container cranes and cargo vessels at a transshipment terminal", position: "center" },
      overview:
        "An integrated maritime and logistics platform designed to serve regional and international shipping and trade, incorporating port, cargo, warehousing, fuel storage and bunkering facilities.",
      scale: "30.5 ha",
      investment: { currency: "USD", amount: "293" },
    },
    {
      id: "ship-repair-dockyard",
      title: "International Ship Repair & Dockyard",
      image: { src: "/assets/investments/ship-repair.webp", alt: "Ships in a dry dock beneath shipyard cranes", position: "center" },
      overview:
        "An international-standard ship repair, dry docking and marine engineering facility serving domestic, regional and international vessels.",
      scale: "Approx. 30 ha",
      investment: { currency: "USD", amount: "100" },
    },
    {
      id: "racing-entertainment-circuit",
      title: "Motor Racing & Entertainment Circuit",
      image: { src: "/assets/investments/racing-circuit.webp", alt: "A motor racing circuit beside a tropical coastline", position: "center" },
      overview:
        "A year-round motorsport, hospitality and entertainment destination featuring an international-standard racing circuit, karting, hospitality, hotels, retail, F&B and event facilities.",
      scale: "Approx. 63 ha",
      investment: { currency: "USD", amount: "205" },
    },
    {
      id: "eco-resort-developments",
      title: "Sustainable Eco-Resort Developments",
      image: { src: "/assets/investments/eco-resort.webp", alt: "Resort villas among palm trees beside a Maldivian lagoon", position: "center" },
      overview:
        "Environmentally responsible resort developments combining premium hospitality with sustainable and nature-based tourism experiences.",
      scale: "Approx. 78 ha",
      investment: { currency: "USD", amount: "161" },
    },
    {
      id: "tourism-hospitality-development",
      title: "Integrated Tourism & Hospitality Development",
      image: { src: "/assets/investments/tourism-hospitality.webp", alt: "Overwater villas linked by curved walkways across a turquoise lagoon", position: "center" },
      overview:
        "A mixed-use tourism, hospitality and commercial destination incorporating hotels, private villas, retail, dining, entertainment, recreation and event facilities.",
      scale: "Approx. 86 ha",
      investment: { currency: "USD", amount: "202" },
    },
  ],
  opportunities: [
    "The Integrated Economic Hub provides flexible opportunities for participation by strategic investors, infrastructure developers, international operators, hospitality brands, private equity investors, technology providers and other sector-specific partners.",
    "Individual components may be developed through project-specific investment and partnership structures, allowing investors and operators to participate in opportunities aligned with their expertise and investment strategy.",
  ],
} as const;

export const staffHousing = {
  id: "staff-housing",
  title: "MTCC Hiya Housing Project",
  image: { src: "/assets/investments/staff-housing.webp", alt: "Contemporary residential apartments in Malé", position: "center 45%" },
  overview:
    "The proposed MTCC Hiya Housing Project is a residential development aimed at providing quality and affordable home ownership opportunities for eligible MTCC employees. The initiative is designed to enhance employee welfare, strengthen workforce retention and establish a sustainable long-term employee housing programme",
  scale:
    "The preliminary concept comprises two residential apartment blocks of approximately 10 storeys each, providing an estimated 104 housing units catering to different household requirements.",
  components: [
    "Two-Bedroom Apartments",
    "Two + One-Bedroom Apartments",
    "Three-Bedroom Apartments",
    "Three + One-Bedroom Apartments",
    "Commercial Spaces",
    "Children’s Play Areas",
    "Parking Facilities",
    "Landscaped Open Spaces",
    "Utility and Supporting Facilities",
  ],
  investment: { currency: "MVR", amount: "268.40" },
  strategicValue:
    "The project supports MTCC’s commitment to employee welfare and long-term workforce stability, while creating a sustainable housing model that has the potential to support future staff housing developments.",
} as const;
