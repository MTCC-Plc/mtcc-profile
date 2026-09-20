"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProfileSection } from "../types/profile";
import { annualReport2025 } from "../data/annual-report-2025";
import { currencySymbols, MVR_PER_USD, type Currency } from "../../lib/currency";
import { useCurrency } from "./currency-toggle";
import { CurrencyText } from "./currency-symbol";
import { registerDate, registerSectors, registerTotals, recordSectors } from "../data/project-register";
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

/** Register figures are held in MVR millions; convert only for display. */
function millions(mvr: number, currency: Currency) {
  const amount = currency === "MVR" ? mvr : mvr / MVR_PER_USD;
  const prefix = currency === "MVR" ? "" : "≈ ";
  return `${prefix}${currencySymbols[currency]} ${amount.toLocaleString("en-GB", { maximumFractionDigits: amount < 100 ? 2 : 0 })}M`;
}

type PortfolioView = "register" | "record";

type ProjectPortfolioProps = {
  projects: Extract<ProfileSection, { type: "projects" }>;
};

export function ProjectPortfolio({ projects }: ProjectPortfolioProps) {
  const { currency } = useCurrency();
  const [view, setView] = useState<PortfolioView>("register");
  const largestProjectValue = Math.max(1, ...projects.projects.map(project => Number(project.mvr)));

  const widestRegister = Math.max(...registerSectors.map(sector => sector.value));
  const recordTotals = recordSectors.reduce((sum, sector) => ({
    onHandProjects: sum.onHandProjects + sector.onHandProjects,
    onHandValue: sum.onHandValue + sector.onHandValue,
    completedProjects: sum.completedProjects + sector.completedProjects,
    completedValue: sum.completedValue + sector.completedValue,
  }), { onHandProjects: 0, onHandValue: 0, completedProjects: 0, completedValue: 0 });
  const widestRecord = Math.max(...recordSectors.map(sector => sector.onHandValue + sector.completedValue));

  return <section id="project-breakdown" className={styles.section} aria-labelledby="portfolio-title">
    <div className="shell">
      <header className={styles.heading}>
        <h2 id="portfolio-title">The project<br /><span>portfolio</span></h2>
        <p>Two ways to read it: the full register as it stood on {registerDate}, or work on hand against work completed since 2021.</p>
      </header>

      <div className={styles.viewSwitch} role="group" aria-label="Portfolio view">
        <button type="button" aria-pressed={view === "register"} onClick={() => setView("register")}>Register, Sep 2026</button>
        <button type="button" aria-pressed={view === "record"} onClick={() => setView("record")}>On hand vs completed</button>
      </div>

      {view === "register" ? (
        <div id="portfolio-view" role="region" aria-label={`Project register as at ${registerDate}`}>
          <dl className={styles.totals}>
            <div><dt>projects, signed and in the pipeline</dt><dd>{registerTotals.projects}</dd></div>
            <div><dt>total contract value</dt><dd><CurrencyText value={millions(registerTotals.value, currency)} /></dd></div>
          </dl>
          <div className={styles.sectors}>
            {registerSectors.map(sector => (
              <details className={styles.sector} key={sector.name}>
                <summary>
                  <span className={styles.sectorName}>
                    <strong>{sector.name}<ChevronDown className={styles.chevron} size={17} aria-hidden="true" /></strong>
                    <small>{sector.projects.toLocaleString("en-GB")} projects · {Math.round(sector.value / registerTotals.value * 100)}% of value</small>
                  </span>
                  <span className={styles.sectorValue}><strong><CurrencyText value={millions(sector.value, currency)} /></strong></span>
                  <span className={styles.sectorBar} aria-hidden="true"><span style={{ width: `${sector.value / widestRegister * 100}%` }} /></span>
                </summary>
                <dl className={styles.projectTypes}>
                  {sector.types.map(type => <div key={type.name}><dt>{type.name}</dt><dd>{type.count}</dd></div>)}
                </dl>
              </details>
            ))}
          </div>
          <p className={styles.note}>Tap a sector to see the project types inside it. The register is a wider scope than the {annualReport2025.governmentProjects} government projects underway in Annual Report {annualReport2025.year}.</p>
        </div>
      ) : (
        <div id="portfolio-view" role="region" aria-label="Work on hand against work completed since 2021">
          <dl className={styles.totals}>
            <div><dt>on hand across {recordTotals.onHandProjects} projects</dt><dd><CurrencyText value={millions(recordTotals.onHandValue, currency)} /></dd></div>
            <div><dt>completed since 2021 across {recordTotals.completedProjects} projects</dt><dd><CurrencyText value={millions(recordTotals.completedValue, currency)} /></dd></div>
          </dl>
          <div className={styles.sectors}>
            {recordSectors.map(sector => (
              <details className={styles.sector} key={sector.name}>
                <summary>
                  <span className={styles.sectorName}>
                    <strong>{sector.name}<ChevronDown className={styles.chevron} size={17} aria-hidden="true" /></strong>
                    <small>{sector.onHandProjects} on hand, {sector.completedProjects} completed</small>
                  </span>
                  <span className={styles.sectorValue}><strong><CurrencyText value={millions(sector.onHandValue + sector.completedValue, currency)} /></strong></span>
                  <span className={styles.sectorBar} aria-hidden="true">
                    <span style={{ width: `${Math.max(sector.onHandValue / widestRecord * 100, .8)}%` }} />
                    <span data-completed style={{ width: `${Math.max(sector.completedValue / widestRecord * 100, .8)}%` }} />
                  </span>
                </summary>
                <dl className={styles.projectTypes}>
                  <div><dt>on hand, {sector.onHandProjects} projects</dt><dd><CurrencyText value={millions(sector.onHandValue, currency)} /></dd></div>
                  <div><dt>completed since 2021, {sector.completedProjects} projects</dt><dd><CurrencyText value={millions(sector.completedValue, currency)} /></dd></div>
                </dl>
              </details>
            ))}
          </div>
          <p className={styles.note}><i className={styles.keyOnHand} aria-hidden="true" /> On hand <i className={styles.keyDone} aria-hidden="true" /> Completed since 2021</p>
        </div>
      )}

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
