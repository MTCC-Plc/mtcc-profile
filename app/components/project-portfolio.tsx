"use client";

import type { ProfileSection } from "../types/profile";
import { annualReport2025 } from "../data/annual-report-2025";
import { currencySymbols } from "../../lib/currency";
import { useCurrency } from "./currency-toggle";
import { CurrencyText } from "./currency-symbol";
import styles from "./project-portfolio.module.css";

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
  projects: Extract<ProfileSection, { type: "projects" }>;
};

export function ProjectPortfolio({ projects }: ProjectPortfolioProps) {
  const { currency } = useCurrency();
  const largestProjectValue = Math.max(1, ...projects.projects.map(project => Number(project.mvr)));

  return <section id="project-breakdown" className={styles.section} aria-labelledby="portfolio-title">
    <div className="shell">
      <header className={styles.heading}>
        <h2 id="portfolio-title">The project<br /><span>portfolio</span></h2>
        <p>Delivering government projects across the Maldives.</p>
      </header>

      <div id="portfolio-view" className={styles.annualSummary} role="region" aria-label="Government projects, Annual Report 2025">
        <p className={styles.reportYear}>Annual Report {annualReport2025.year}</p>
        <dl className={styles.totals}><div><dt>Government projects underway</dt><dd>{annualReport2025.governmentProjects}</dd></div></dl>
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
