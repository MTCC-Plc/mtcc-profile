"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BriefcaseBusiness, ChevronDown, DraftingCompass, HardHat, Ship, Users, Waypoints } from "lucide-react";
import styles from "./workforce-section.module.css";

const metrics = [
  ["6,672", "people across seven business areas"],
  ["3,735", "Maldivians employed, from Haa Alif to Addu"],
  ["516", "hold a diploma, degree or master's"],
  ["1,149", "machine and vehicle operators, 140 of them licence holders"],
];

const skillGroups: { name: string; icon: typeof Ship; count: number; description: string; roles: [string, number][] }[] = [
  { name: "Construction crews", icon: HardHat, count: 2765, description: "Site teams for marine, civil and building works, enough to run many islands at once.", roles: [["Construction workers", 2765]] },
  { name: "Plant and fleet", icon: Ship, count: 1318, description: "The people who run and maintain the dredgers, vessels, cranes and heavy machines.", roles: [["Machine and vehicle operators", 1149], ["Mechanics", 129], ["Maritime professionals", 40]] },
  { name: "Operations and services", icon: Waypoints, count: 1279, description: "Transport, terminal, yard and service staff who keep daily operations moving.", roles: [["Service and support staff", 958], ["Operational staff", 321]] },
  { name: "Corporate and professional", icon: BriefcaseBusiness, count: 1033, description: "Finance, audit, IT, data and administration behind every contract.", roles: [["Administrative and clerical", 995], ["IT professionals", 27], ["Auditors", 7], ["Accountants", 2], ["Data analysts", 2]] },
  { name: "Project leadership", icon: Users, count: 163, description: "Project managers and management professionals accountable for delivery.", roles: [["Management professionals", 120], ["Project managers", 43]] },
  { name: "Engineers and specialists", icon: DraftingCompass, count: 114, description: "Design, survey, quality and engineering talent, all in house.", roles: [["Civil engineers", 43], ["Mechanical engineers", 13], ["Surveyors", 12], ["Architects", 9], ["Environmental engineers and specialists", 9], ["Class welding professionals", 8], ["Quality control engineers", 6], ["Quantity surveyors", 6], ["Electrical engineers", 3], ["Marine engineers", 2], ["Dredging professionals", 2], ["Coastal engineer", 1]] },
];

/** Headcount by business area as [Maldivian, international]. */
const businesses: [string, number, number][] = [
  ["Construction project management", 1187, 1768],
  ["Shared services and support", 1200, 951],
  ["Transport services", 1131, 2],
  ["Docking", 58, 102],
  ["Repair and maintenance", 73, 57],
  ["Dredging", 47, 57],
  ["Trading", 39, 0],
];
const largestBusiness = businesses[0][1] + businesses[0][2];

type Origin = "all" | "local" | "international";
const origins: { id: Origin; label: string }[] = [
  { id: "all", label: "Everyone: 6,672" },
  { id: "local", label: "Maldivian: 3,735" },
  { id: "international", label: "International: 2,937" },
];

const credentials: [number, string][] = [
  [68, "master's degrees"],
  [275, "bachelor's degrees"],
  [173, "diplomas and associate degrees"],
  [140, "licensed machine and vehicle operators"],
  [68, "maritime certificates"],
  [100, "advanced and trade certificates"],
  [11, "chartered and professional certifications"],
  [43, "civil engineers, with 43 project managers beside them"],
];

const views = [
  { id: "skills", label: "By skill", note: "Tap a group to see the roles inside it." },
  { id: "business", label: "By business", note: "Nearly three thousand people work in construction project delivery alone, supported by a 2,151-strong shared services base. Local knowledge and international skills sit side by side on every site." },
  { id: "credentials", label: "Credentials", note: "Professional certifications held include ACCA, CIMA, SHRM-SCP and chartered marketing and quality qualifications (MCIM, CQP MCQI)." },
] as const;

const format = (value: number) => value.toLocaleString("en-US");

export function WorkforceSection() {
  const [view, setView] = useState<(typeof views)[number]["id"]>("skills");
  const [origin, setOrigin] = useState<Origin>("all");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    let height = 0;
    const observer = new ResizeObserver(() => {
      const nextHeight = section.getBoundingClientRect().height;
      if (nextHeight === height) return;
      height = nextHeight;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(section);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} id="workforce" className={styles.section} aria-labelledby="workforce-title">
      <div className="shell">
        <header className={styles.heading}>
          <div>
            <p className="eyebrow">Our workforce</p>
            <h2 id="workforce-title">6,672 people,<br /><span>one delivery team</span></h2>
          </div>
          <p className={styles.intro}>Clients and investors get more than equipment. They get crews, operators, engineers and managers who already work together, with the depth to staff several large sites at once.</p>
        </header>

        <dl className={styles.metrics}>
          {metrics.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>

        <div className={styles.toolbar}>
          <div className={styles.views} role="group" aria-label="Explore our workforce">
            {views.map(option => <button key={option.id} type="button" aria-pressed={view === option.id} aria-controls="workforce-explorer" onClick={() => setView(option.id)}>{option.label}</button>)}
          </div>
        </div>

        <div id="workforce-explorer">
          {view === "skills" && (
            <div className={styles.groups}>
              {skillGroups.map(group => (
                <details className={styles.group} key={group.name}>
                  <summary>
                    <span className={styles.groupTop}><group.icon size={25} strokeWidth={1.5} aria-hidden="true" /><strong className={styles.groupCount}>{format(group.count)}</strong></span>
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                    <span className={styles.groupAction}><span>Explore roles</span><ChevronDown size={19} aria-hidden="true" /></span>
                  </summary>
                  <dl className={styles.roles}>
                    {group.roles.map(([role, count]) => <div key={role}><dt>{role}</dt><dd>{format(count)}</dd></div>)}
                  </dl>
                </details>
              ))}
            </div>
          )}
          {view === "business" && (
            <div className={styles.business}>
              <div className={styles.origins} role="group" aria-label="Highlight workforce origin">
                {origins.map(option => <button key={option.id} type="button" aria-pressed={origin === option.id} onClick={() => setOrigin(option.id)}>{option.label}</button>)}
              </div>
              {businesses.map(([name, local, international]) => {
                const total = local + international;
                return (
                  <div className={styles.businessRow} key={name}>
                    <div className={styles.businessTop}><span>{name}</span><b>{format(total)}</b></div>
                    <div className={styles.businessBar} style={{ width: `${Math.max(total / largestBusiness * 100, 6)}%` }} aria-hidden="true">
                      <i data-dim={origin === "international"} style={{ width: `${local / total * 100}%` }} />
                      <i data-dim={origin === "local"} style={{ width: `${international / total * 100}%` }} />
                    </div>
                    <span className={styles.businessSplit}>{format(local)} Maldivian{international ? `, ${format(international)} international` : ""}</span>
                  </div>
                );
              })}
            </div>
          )}
          {view === "credentials" && (
            <div className={styles.credentials}>
              {credentials.map(([count, label]) => <article key={label}><strong>{format(count)}</strong><p>{label}</p></article>)}
            </div>
          )}
          <p className={styles.note}>{views.find(option => option.id === view)?.note}</p>
        </div>
      </div>
    </section>
  );
}
