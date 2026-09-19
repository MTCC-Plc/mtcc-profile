"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, ChevronDown, HardHat, Ship, Users, BriefcaseBusiness, Ruler, Waypoints } from "lucide-react";
import styles from "./workforce-section.module.css";

const skillGroups = [
  {
    name: "Construction crews",
    count: "2,765",
    icon: HardHat,
    description: "Site teams for marine, civil and building works, enough to run many islands at once.",
    roles: [["Construction workers", "2,765"]],
  },
  {
    name: "Plant and fleet",
    count: "1,318",
    icon: Ship,
    description: "The people who run and maintain the dredgers, vessels, cranes and heavy machines.",
    roles: [["Machine and vehicle operators", "1,149"], ["Mechanics", "129"], ["Maritime professionals", "40"]],
  },
  {
    name: "Operations and services",
    count: "1,279",
    icon: Waypoints,
    description: "Transport, terminal, yard and service staff who keep daily operations moving.",
    roles: [["Service and support staff", "958"], ["Operational staff", "321"]],
  },
  {
    name: "Corporate and professional",
    count: "1,033",
    icon: BriefcaseBusiness,
    description: "Finance, audit, IT, data and administration behind every contract.",
    roles: [["Administrative and clerical", "995"], ["IT professionals", "27"], ["Auditors", "7"], ["Accountants", "2"], ["Data analysts", "2"]],
  },
  {
    name: "Project leadership",
    count: "163",
    icon: Users,
    description: "Project managers and management professionals accountable for delivery.",
    roles: [["Management professionals", "120"], ["Project managers", "43"]],
  },
  {
    name: "Engineers and specialists",
    count: "114",
    icon: Ruler,
    description: "Design, survey, quality and engineering talent, all in house.",
    roles: [
      ["Civil engineers", "43"],
      ["Mechanical engineers", "13"],
      ["Surveyors", "12"],
      ["Architects", "9"],
      ["Environmental engineers and specialists", "9"],
      ["Class welding professionals", "8"],
      ["Quality control engineers", "6"],
      ["Quantity surveyors", "6"],
      ["Electrical engineers", "3"],
      ["Marine engineers", "2"],
      ["Dredging professionals", "2"],
      ["Coastal engineer", "1"],
    ],
  },
];

const metrics = [
  { value: "6,672", label: "people across seven business areas" },
  { value: "3,735", label: "Maldivians employed, from Haa Alif to Addu" },
  { value: "516", label: "hold a diploma, degree or master's" },
  { value: "1,149", label: "machine and vehicle operators, 140 of them licence holders" },
];

export function WorkforceSection() {
  const [view, setView] = useState<"skills" | "credentials">("skills");
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
          {metrics.map(metric => (
            <div key={metric.value}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.toolbar}>
          <div className={styles.views} role="group" aria-label="Explore our workforce">
            <button type="button" aria-pressed={view === "skills"} aria-controls="workforce-explorer" onClick={() => setView("skills")}>By skill</button>
            <button type="button" aria-pressed={view === "credentials"} aria-controls="workforce-explorer" onClick={() => setView("credentials")}>Credentials</button>
          </div>
          <p>{view === "skills" ? "Tap a group to see the roles inside it." : "Qualifications across our team."}</p>
        </div>

        <div id="workforce-explorer">
          {view === "skills" ? (
            <div className={styles.groups}>
              {skillGroups.map(group => (
                <details className={styles.group} key={group.name}>
                  <summary>
                    <span className={styles.groupTop}><group.icon size={25} strokeWidth={1.5} aria-hidden="true" /><span className={styles.groupCount}>{group.count}</span></span>
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                    <span className={styles.groupAction}><span>Explore roles</span><ChevronDown size={19} aria-hidden="true" /></span>
                  </summary>
                  <dl className={styles.roles}>
                    {group.roles.map(([role, count]) => (
                      <div key={role}><dt>{role}</dt><dd>{count}</dd></div>
                    ))}
                  </dl>
                </details>
              ))}
            </div>
          ) : (
            <div className={styles.credentials}>
              <article>
                <Award size={31} strokeWidth={1.4} aria-hidden="true" />
                <strong>516</strong>
                <h3>Diploma, degree or master&apos;s</h3>
                <p>People who hold a diploma, degree or master&apos;s.</p>
              </article>
              <article>
                <HardHat size={31} strokeWidth={1.4} aria-hidden="true" />
                <strong>140</strong>
                <h3>Operator licence holders</h3>
                <p>Among our 1,149 machine and vehicle operators.</p>
              </article>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
