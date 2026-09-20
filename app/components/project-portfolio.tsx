"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import type { ProfileSection } from "../types/profile";
import { currencyMetrics, currencySymbols } from "../../lib/currency";
import { useCurrency } from "./currency-toggle";
import { CurrencyText } from "./currency-symbol";
import { ProjectBreakdown } from "./project-breakdown";
import styles from "./project-portfolio.module.css";

const sectors = [
  {
    title: "Reclamation and private developments", count: 97, value: "11.44", share: 35,
    types: [[86, "Reclamation"], [11, "Private developments"]],
  },
  {
    title: "Coastal and marine works", count: 250, value: "9.81", share: 30,
    types: [[137, "Harbours"], [87, "Shore protection"], [14, "Beaches and swimming areas"], [8, "Jetties"], [3, "Channel dredging"], [1, "Survey"]],
  },
  {
    title: "Buildings", count: 455, value: "5.77", share: 18,
    types: [[165, "Sports facilities"], [71, "Education"], [63, "Health"], [60, "Police"], [44, "Waste management centres"], [24, "Mosques"], [22, "Civic buildings"], [6, "Industrial"]],
  },
  {
    title: "Roads, airports and causeways", count: 66, value: "5.34", share: 17,
    types: [[37, "Roads"], [16, "Airports"], [7, "Causeways and bridges"], [4, "Utilities"], [2, "Ferry terminals"]],
  },
] as const;

const flagshipNames = [
  "Maafaru Airport development and expansion, phase 2",
  "Centara new resort: reclamation of three islands",
  "Fuvahmulah City internal roads, design and build",
  "Maxx Royal resort: dredging, reclamation and shore protection, phase 1",
  "GDh. Faresmaathodaa Airport, design and build",
  "M. Muli Airport, design and build",
  "Th. Kinbidhoo dredging and land reclamation",
  "Malé road development: north Boduthakurufaanu Magu, design and build",
  "North Boduthakurufaanu Magu, phase 2",
];

type ProjectPortfolioProps = {
  comparison: Extract<ProfileSection, { type: "content" }>;
  projects: Extract<ProfileSection, { type: "projects" }>;
};

export function ProjectPortfolio({ comparison, projects }: ProjectPortfolioProps) {
  const [view, setView] = useState<"register" | "comparison">("register");
  const { currency } = useCurrency();
  const money = (value: string) => currencyMetrics([{ value: `MVR ${value}B`, label: "Contract value" }], currency)[0].value;
  const largestSectorValue = Math.max(...sectors.map(sector => Number(sector.value)));
  const largestProjectValue = Math.max(1, ...projects.projects.map(project => Number(project.mvr)));
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [view]);

  return <section id="project-breakdown" className={styles.section} aria-labelledby="portfolio-title">
    <div className="shell">
      <header className={styles.heading}>
        <h2 id="portfolio-title">The project<br /><span>portfolio</span></h2>
        <p>Two ways to read it: the full register as it stood on 9 September 2026, or work on hand against work completed since 2021.</p>
      </header>

      <div className={styles.viewSwitch} role="group" aria-label="Portfolio view">
        <button type="button" aria-pressed={view === "register"} aria-controls="portfolio-view" onClick={() => setView("register")}>Register, Sep 2026</button>
        <button type="button" aria-pressed={view === "comparison"} aria-controls="portfolio-view" onClick={() => setView("comparison")}>On hand vs completed</button>
      </div>

      <div id="portfolio-view" role="region" aria-label={view === "register" ? "September 2026 project register" : "Work on hand and completed since 2021"}>
        {view === "register" ? <>
          <dl className={styles.totals}>
            <div><dt>Projects, signed and in the pipeline</dt><dd>868</dd></div>
            <div><dt>Total contract value</dt><dd><CurrencyText value={money("32.35")} /></dd></div>
          </dl>
          <div className={styles.sectors}>
            {sectors.map(sector => <details className={styles.sector} key={sector.title} open>
              <summary>
                <span className={styles.sectorName}><strong>{sector.title} <ChevronDown size={18} className={styles.chevron} aria-hidden="true" /></strong><small>{sector.count} projects</small></span>
                <span className={styles.sectorValue}><strong><CurrencyText value={money(sector.value)} /></strong><small>{sector.share}% of value</small></span>
                <span className={styles.sectorBar} aria-hidden="true"><span style={{ width: `${Number(sector.value) / largestSectorValue * 100}%` }} /></span>
              </summary>
              <dl className={styles.projectTypes}>{sector.types.map(([count, label]) => <div key={label}><dt>{label}</dt><dd>{count}</dd></div>)}</dl>
            </details>)}
          </div>
          <p className={styles.note}>Tap a sector to see the project types inside it.{currency === "USD" && " USD values are approximate equivalents at MVR 15.42 to USD 1."}</p>
        </> : <div className={styles.comparison}>
          <ProjectBreakdown section={{ ...comparison, id: "project-comparison", title: "On hand vs completed", eyebrow: "Work since 2021" }} />
        </div>}
      </div>

      <section id="projects" className={styles.flagships} aria-labelledby="flagship-list-title">
        <header><h3 id="flagship-list-title">Flagship projects</h3></header>
        <ol className={styles.flagshipList}>{projects.projects.map((project, index) => <li key={project.name}>
          <span className={styles.projectName}>{flagshipNames[index] ?? project.name}</span>
          <strong><CurrencyText value={`${currencySymbols[currency]} ${currency === "MVR" ? project.mvr : project.usd}M`} /></strong>
          <span className={styles.projectBar} aria-hidden="true"><span style={{ width: `${Number(project.mvr) / largestProjectValue * 100}%` }} /></span>
        </li>)}</ol>
        <p className={styles.note}>Contract values excluding GST.</p>
      </section>
    </div>
  </section>;
}
