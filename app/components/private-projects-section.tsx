"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { currencyMetrics } from "../../lib/currency";
import { useCurrency } from "./currency-toggle";
import { CurrencyText } from "./currency-symbol";
import { ProjectContactDialog } from "./project-contact-dialog";
import styles from "./private-projects-section.module.css";

const capabilities = [
  ["6", "Dredgers: five cutter suction and one trailing suction hopper"],
  ["38,000 m³", "Of sand moved per day at full fleet capacity"],
  ["2,500 m", "Of rock boulder profiling capacity for revetments and breakwaters"],
  ["400", "L-blocks cast per month in our own yards"],
  ["300", "L-blocks installed per month for quay walls"],
  ["20+ years", "As the leading shore protection contractor in the Maldives"],
  ["In house", "Bathymetric, geotechnical and aerial survey teams"],
  ["One team", "Engineers, designers, environmental consultants and project managers"],
];

const deliverySteps = [
  ["Survey and design", "Our hydrographic and land surveyors map the lagoon. Our engineers and architects shape the island, the channel and the coastal defences."],
  ["Environmental approvals", "In-house environmental consultancy prepares the assessment and sees it through."],
  ["Dredge and reclaim", "The right dredger for the site, from shallow lagoon work to deep borrow areas, backed by our own pipelines, barges and excavators."],
  ["Protect and build", "Rock revetments and breakwaters profiled by dedicated teams and machines, L-block quay walls, sheet piling, beach replenishment and jetties."],
  ["Handover", "As-built surveys, quality records and a single point of accountability throughout."],
];

const works = [
  { id: "reclamation", title: "Dredging and land reclamation", detail: "Six dredgers, with up to 38,000 m³ of daily fleet capacity, backed by our own pipelines, barges and excavators." },
  { id: "shore", title: "Shore protection", detail: "Dedicated teams for rock revetments and breakwaters, with 2,500 m of rock boulder profiling capacity." },
  { id: "quay", title: "Quay walls", detail: "Our own concrete yards cast 400 L-blocks a month, with teams installing 300 a month for quay walls." },
  { id: "jetties", title: "Jetties and harbours", detail: "Marine construction, sheet piling and engineering teams for jetties and harbours." },
  { id: "beach", title: "Beach replenishment", detail: "Dredging equipment and coastal engineering teams for beach replenishment." },
  { id: "survey", title: "Survey and design", detail: "In-house bathymetric, geotechnical and aerial surveys, with engineers and architects to shape your project." },
  { id: "environment", title: "Environmental assessment", detail: "In-house environmental consultants prepare the assessment and see it through approvals." },
  { id: "buildings", title: "Buildings and roads", detail: "Civil engineering and construction teams for buildings and roads." },
] as const;

export function PrivateProjectsSection() {
  const [selected, setSelected] = useState<string[]>([]);
  const [contactOpen, setContactOpen] = useState(false);
  const { currency } = useCurrency();
  useEffect(() => {
    if (contactOpen) return;
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [selected, contactOpen]);
  const selectedWorks = works.filter(work => selected.includes(work.id));
  const projectValue = (value: string, usd: string) => currencyMetrics([
    { value: `MVR ${value}M`, label: "Contract value" },
    { value: `USD ${usd}M`, label: "Contract value" },
  ], currency)[0].value;

  function toggle(id: string) {
    setSelected(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
  }

  return <section id="private-projects" className={styles.section} aria-labelledby="private-projects-title">
    <div className="shell">
      <header className={styles.heading}>
        <p className={styles.eyebrow}><span aria-hidden="true" />Now taking on private projects</p>
        <h2 id="private-projects-title">Partner with us<br />on your reclamation project<span>.</span></h2>
        <p>Resort developers, investors and island owners: MTCC is actively looking for private projects. You get the country&apos;s largest dredging fleet, our own rock and concrete works, and survey, design and engineering teams under one contract, from first sounding to handover.</p>
      </header>

      <dl className={styles.capabilities}>{capabilities.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>

      <div className={styles.delivery}>
        <div className={styles.process}>
          <h3>How a project runs with us</h3>
          <ol>{deliverySteps.map(([title, description], index) => <li key={title}>
            <span className={styles.step} aria-hidden="true">{index + 1}</span>
            <div><h4>{title}</h4><p>{description}</p></div>
          </li>)}</ol>
        </div>

        <div className={styles.enquiry}>
          <fieldset>
            <legend>Tell us what you need</legend>
            <p className={styles.enquiryIntro}>Select the works in your project, then contact our team. Your choices will be included in the contact form.</p>
            <div className={styles.checklist}>{works.map(work => <label key={work.id}>
              <input type="checkbox" checked={selected.includes(work.id)} onChange={() => toggle(work.id)} />
              <span>{work.title}</span>
            </label>)}</div>
          </fieldset>

          <div className={styles.selection} aria-live="polite" aria-atomic="true">
            {selectedWorks.length ? <>
              <p className={styles.selectionHeading}>What MTCC brings to your project</p>
              <ul>{selectedWorks.map(work => <li key={work.id}><strong>{work.title}</strong><p>{work.detail}</p></li>)}</ul>
            </> : <p>Nothing ticked yet. Most resort projects start with reclamation, shore protection and a jetty.</p>}
          </div>

          <div className={styles.actions}>
            <button className={styles.contact} type="button" aria-haspopup="dialog" aria-expanded={contactOpen} aria-controls="project-contact-dialog" onClick={() => setContactOpen(true)}><Mail size={17} aria-hidden="true" />Contact us<ArrowRight size={17} aria-hidden="true" /></button>
            <a className={styles.phone} href="tel:+9603326822"><Phone size={16} aria-hidden="true" />Call +960 332 6822</a>
          </div>
          <p className={styles.contactNote}>Add your contact details and tell us more about your project.</p>
        </div>
      </div>

      <div className={styles.references} aria-label="Private project experience">
        <article><span>Private project experience</span><h3>Centara new resort</h3><p>Reclamation of three islands, <strong><CurrencyText value={projectValue("383", "25")} /></strong></p></article>
        <article><span>Private project experience</span><h3>Maxx Royal resort, phase 1</h3><p>Dredging, reclamation and shore protection, <strong><CurrencyText value={projectValue("283", "18")} /></strong></p></article>
      </div>
    </div>
    <ProjectContactDialog open={contactOpen} onClose={() => setContactOpen(false)} works={works} selected={selected} onSelectionChange={setSelected} />
  </section>;
}
