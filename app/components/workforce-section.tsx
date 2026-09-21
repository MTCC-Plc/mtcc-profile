"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, ChevronDown, HardHat, Ship, Users, BriefcaseBusiness, Waypoints } from "lucide-react";
import { annualReport2025 } from "../data/annual-report-2025";
import styles from "./workforce-section.module.css";

const skillGroups = [
  {
    name: "Construction crews",
    icon: HardHat,
    description: "Site teams for marine, civil and building works, enough to run many islands at once.",
    roles: ["Construction workers"],
  },
  {
    name: "Machineries",
    icon: Ship,
    description: "The people who run and maintain the dredgers, vessels, cranes and heavy machines.",
    roles: ["Machine and vehicle operators", "Mechanics", "Maritime professionals"],
  },
  {
    name: "Operations and services",
    icon: Waypoints,
    description: "Transport, terminal, yard and service staff who keep daily operations moving.",
    roles: ["Service and support staff", "Operational staff"],
  },
  {
    name: "Corporate and professional",
    icon: BriefcaseBusiness,
    description: "Finance, audit, IT, data and administration behind every contract.",
    roles: ["Administrative and clerical", "IT professionals", "Auditors", "Accountants", "Data analysts"],
  },
  {
    name: "Project leadership",
    icon: Users,
    description: "Project managers and management professionals accountable for delivery.",
    roles: ["Management professionals", "Project managers"],
  },
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
            <h2 id="workforce-title">{annualReport2025.employees} employees,<br /><span>one delivery team</span></h2>
            <p className={styles.employeeDate}>As at {annualReport2025.employeeDate} · Annual Report 2025</p>
          </div>
          <p className={styles.intro}>Clients and investors get more than equipment. They get crews, operators, engineers and managers who already work together, with the depth to staff several large sites at once.</p>
        </header>

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
                    <span className={styles.groupTop}><group.icon size={25} strokeWidth={1.5} aria-hidden="true" /></span>
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                    <span className={styles.groupAction}><span>Explore roles</span><ChevronDown size={19} aria-hidden="true" /></span>
                  </summary>
                  <ul className={styles.roleNames}>
                    {group.roles.map(role => <li key={role}>{role}</li>)}
                  </ul>
                </details>
              ))}
            </div>
          ) : (
            <div className={styles.credentials}>
              <article>
                <Award size={31} strokeWidth={1.4} aria-hidden="true" />
                <h3>Diploma, degree, master&apos;s or professional certificates</h3>
                <p>People who hold a diploma, degree, master&apos;s and professional certificates</p>
              </article>
              <article>
                <HardHat size={31} strokeWidth={1.4} aria-hidden="true" />
                <h3>Operator licence holders</h3>
                <p>Machine and vehicle operators with professional licences.</p>
              </article>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
