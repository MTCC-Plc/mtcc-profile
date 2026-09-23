export const economicHub = {
  id: "economic-hub",
  title: "Gaadhoo Integrated Economic Hub",
  subtitle: "Gaadhoo Integrated Economic Destination",
  overview: [
    "Strategically located in the Maldives near the One-and-a-Half Degree Channel, the Gaadhoo Integrated Economic Hub is envisioned as a large-scale, multi-sector destination bringing together maritime, logistics, tourism, hospitality, commercial, sports and entertainment activities.",
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
    "The Gaadhoo Integrated Economic Hub provides flexible opportunities for participation by strategic investors, infrastructure developers, international operators, hospitality brands, private equity investors, technology providers and other sector-specific partners.",
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

/** Projects 06 and 07 of the Investment Booklet 2026. */
export const bookletProjects = [
  {
    id: "villingili-ferry-terminal",
    title: "Villingili Ferry Terminal Mixed-Use Commercial Development",
    kicker: "Transport-oriented commercial development",
    detail: "Ferry terminal, hotel, retail and offices in Malé",
    overview: [
      "The proposed Villingili Ferry Terminal Mixed-Use Commercial Development will transform the existing ferry terminal site into a modern transport-oriented, mixed-use commercial destination integrating passenger transport infrastructure with hospitality, retail, office, dining and leisure facilities.",
      "The project will integrate transport services with complementary commercial and hospitality uses, creating a vibrant and accessible mixed-use destination.",
    ],
    components: [
      "Modern Ferry Terminal",
      "Commercial & Retail Space",
      "Office Space",
      "Hotel",
      "Restaurants & Cafés",
      "Entertainment & Leisure Facilities",
      "Passenger Amenities",
    ],
    investment: { currency: "USD", amount: "32" },
    opportunity: [
      "The project presents an opportunity for real estate developers, commercial property investors, hotel operators, retail developers, contractors, financiers and strategic partners to participate in the redevelopment of a strategically located MTCC transport and commercial asset.",
      "The mixed-use nature of the development provides opportunities for participation across transport infrastructure, hospitality, retail, office, dining and leisure components, with the potential to generate diversified and recurring commercial revenues.",
    ],
  },
  {
    id: "cargo-ferry-network",
    title: "Cargo Ferry Network Enhancement",
    kicker: "Nationwide cargo transport",
    detail: "26 purpose-built cargo ferries across six zones",
    overview: [
      "The proposed Cargo Ferry Network Enhancement will establish a modern, cargo-focused maritime transport network across the Maldives, improving the efficient movement of goods between islands, atoll capitals, urban centres and cities.",
      "The network will operate across six operational zones with 26 purpose-built cargo ferries, providing reliable nationwide cargo connectivity while complementing the RTL Ferry Services and reducing duplication of resources.",
      "The proposed vessels are expected to be approximately 70–85 feet in length, with side and rear access for loading and boarding and limited seating for up to 30 passengers.",
    ],
    scale: "Nationwide coverage across 6 operational zones.",
    stats: [
      { label: "Purpose-built cargo ferries", value: "26" },
      { label: "Operational ferries", value: "20" },
      { label: "Backup ferries", value: "6" },
    ],
    components: [
      "26 Purpose-Built Cargo Ferries",
      "Nationwide Cargo Transport Network",
      "Connections to Atoll Capitals, Urban Centres & Cities",
      "Compartmentalised Cargo Storage",
      "Air-Conditioned Cargo Compartments",
      "Limited Passenger Capacity",
      "Minimum Operating Speed of 12 Knots",
    ],
    investment: { currency: "USD", amount: "15" },
    opportunity: [
      "The project presents an opportunity for shipbuilders, marine equipment and engine suppliers, vessel financing institutions, infrastructure investors, contractors and strategic partners to participate in the development and financing of a modern nationwide cargo ferry fleet.",
      "The proposed network provides an opportunity to support the modernisation of inter-island cargo transportation while improving connectivity between communities and key regional centres and creating a more efficient and reliable national cargo distribution network.",
    ],
  },
] as const;
