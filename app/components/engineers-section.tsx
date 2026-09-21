"use client";

import { useState } from "react";
import { ChevronDown, DraftingCompass, Flame, LandPlot, Waves } from "lucide-react";
import Image from "./site-image";
import styles from "./engineers-section.module.css";

type Scope = "all" | "local" | "expat";
/** Headcount as [local, expat]. */
type Count = [number, number];

// Engineering and technical professionals by discipline, from the HR register.
const disciplines: { name: string; description: string; icon: typeof Waves; roles: [string, Count][] }[] = [
  {
    name: "Engineering & design",
    description: "Engineering, architecture, environment and quality control",
    icon: DraftingCompass,
    roles: [
      ["Architects", [10, 0]],
      ["Civil engineers", [8, 1]],
      ["Mechanical engineers", [5, 4]],
      ["Environmental engineers and specialists", [6, 0]],
      ["Quality control engineers", [0, 6]],
      ["Electrical engineers", [4, 0]],
      ["Marine engineers", [2, 1]],
      ["Coastal engineers", [1, 0]],
    ],
  },
  {
    name: "Surveying & quantity surveying",
    description: "Surveyors and quantity surveyors",
    icon: LandPlot,
    roles: [["Surveyors", [13, 10]], ["Quantity surveyors", [4, 2]]],
  },
  {
    name: "Dredging professionals",
    description: "Specialist dredging expertise",
    icon: Waves,
    roles: [["Dredging professionals", [27, 14]]],
  },
  {
    name: "Class welding professionals",
    description: "Specialist welding expertise",
    icon: Flame,
    roles: [["Class welding professionals", [0, 8]]],
  },
];

const divisions: [string, Count][] = [
  ["Construction & Dredging", [70, 33]],
  ["Engineering & Repair", [7, 10]],
  ["Trading", [2, 2]],
  ["Corporate Bureau & Administration", [1, 1]],
];

const pick = ([local, expat]: Count, scope: Scope) => scope === "local" ? local : scope === "expat" ? expat : local + expat;
const sum = (counts: Count[]): Count => counts.reduce<Count>((total, [local, expat]) => [total[0] + local, total[1] + expat], [0, 0]);

const totals = sum(disciplines.flatMap(discipline => discipline.roles.map(([, count]) => count)));
const scopes: { id: Scope; label: string }[] = [{ id: "all", label: "All" }, { id: "local", label: "Local" }, { id: "expat", label: "Expat" }];

export function EngineersSection() {
  const [scope, setScope] = useState<Scope>("all");
  const total = pick(totals, scope);
  const localShare = Math.round(totals[0] / (totals[0] + totals[1]) * 100);

  return (
    <section id="engineers" className={styles.section} aria-labelledby="engineers-title">
      <div className="shell">
        <header className={styles.heading}>
          <div>
            <p className="eyebrow">Our people</p>
            <h2 id="engineers-title">Engineers and specialists</h2>
            <p className={styles.intro}>Expertise spanning engineering, surveying, dredging and specialist fabrication, all in house.</p>
          </div>
          <div className={styles.scopes} role="group" aria-label="Filter by nationality">
            {scopes.map(option => <button key={option.id} type="button" aria-pressed={scope === option.id} aria-controls="engineers-breakdown" onClick={() => setScope(option.id)}>{option.label}</button>)}
          </div>
        </header>

        <div id="engineers-breakdown" className={styles.layout} aria-live="polite">
          <article className={styles.feature}>
            <Image className={styles.featureImage} src="/assets/team-engineering.webp" alt="" fill sizes="(max-width: 900px) 100vw, 480px" />
            <div className={styles.featureBody}>
              <p className={styles.featureLabel}>{scope === "all" ? "Total professionals" : scope === "local" ? "Local professionals" : "Expat professionals"}</p>
              <strong className={styles.featureValue}>{total}</strong>
              <p className={styles.featureText}>Engineering &amp; technical professionals</p>

              <div className={styles.split}>
                <div className={styles.splitBar} aria-hidden="true">
                  <span data-dim={scope === "expat"} style={{ width: `${localShare}%` }} />
                  <span data-dim={scope === "local"} style={{ width: `${100 - localShare}%` }} />
                </div>
                <dl className={styles.splitLegend}>
                  <div data-dim={scope === "expat"}><dt>Local</dt><dd>{totals[0]}</dd></div>
                  <div data-dim={scope === "local"}><dt>Expat</dt><dd>{totals[1]}</dd></div>
                </dl>
              </div>

              <dl className={styles.divisions}>
                {divisions.map(([name, count]) => <div key={name}><dt>{name}</dt><dd>{pick(count, scope)}</dd></div>)}
              </dl>
            </div>
          </article>

          <div className={styles.disciplines}>
            {disciplines.map(discipline => {
              const count = pick(sum(discipline.roles.map(([, value]) => value)), scope);
              const share = total ? count / total * 100 : 0;
              const expandable = discipline.roles.length > 1;
              const Card = expandable ? "details" : "article";
              const Top = expandable ? "summary" : "div";
              return (
                <Card className={styles.discipline} key={discipline.name} data-empty={count === 0}>
                  <Top className={styles.summary}>
                    <span className={styles.icon}><discipline.icon size={26} strokeWidth={1.5} aria-hidden="true" /></span>
                    <strong className={styles.count}>{count}</strong>
                    <h3>{discipline.name}</h3>
                    <p>{discipline.description}</p>
                    <span className={styles.share} aria-hidden="true"><span style={{ width: `${share}%` }} /></span>
                    <span className={styles.shareMeta}><span>{Math.round(share)}% of {scope === "all" ? "total" : scope}</span>{expandable && <span className={styles.toggle}>Roles <ChevronDown size={16} aria-hidden="true" /></span>}</span>
                  </Top>
                  {expandable && <dl className={styles.roles}>
                    {discipline.roles.map(([role, value]) => <div key={role} data-empty={pick(value, scope) === 0}><dt>{role}</dt><dd>{pick(value, scope)}</dd></div>)}
                  </dl>}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
