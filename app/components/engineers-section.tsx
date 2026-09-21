"use client";

import { DraftingCompass, Flame, LandPlot, Waves } from "lucide-react";
import Image from "./site-image";
import styles from "./engineers-section.module.css";

// Engineering and technical professionals by discipline.
const disciplines: { name: string; description: string; icon: typeof Waves; count: number }[] = [
  { name: "Engineering & design", description: "Engineering, architecture, environment and quality control", icon: DraftingCompass, count: 86 },
  { name: "Surveying & quantity surveying", description: "12 surveyors and 6 quantity surveyors", icon: LandPlot, count: 18 },
  { name: "Dredging professionals", description: "Specialist dredging expertise", icon: Waves, count: 2 },
  { name: "Class welding professionals", description: "Specialist welding expertise", icon: Flame, count: 8 },
];

const total = disciplines.reduce((sum, discipline) => sum + discipline.count, 0);

export function EngineersSection() {
  return (
    <section id="engineers" className={styles.section} aria-labelledby="engineers-title">
      <div className="shell">
        <header className={styles.heading}>
          <div>
            <p className="eyebrow">Our Strength</p>
            <h2 id="engineers-title">Engineers and specialists</h2>
            <p className={styles.intro}>Expertise spanning engineering, surveying, dredging and specialist fabrication, all in house.</p>
          </div>
        </header>

        <div className={styles.layout}>
          <article className={styles.feature}>
            <Image className={styles.featureImage} src="/assets/team-engineering.webp" alt="" fill sizes="(max-width: 900px) 100vw, 480px" />
            <div className={styles.featureBody}>
              <p className={styles.featureLabel}>Total professionals</p>
              <strong className={styles.featureValue}>{total}</strong>
              <p className={styles.featureText}>Engineering &amp; technical professionals</p>
            </div>
          </article>

          <div className={styles.disciplines}>
            {disciplines.map(discipline => {
              const share = discipline.count / total * 100;
              return (
                <article className={styles.discipline} key={discipline.name}>
                  <div className={styles.summary}>
                    <span className={styles.icon}><discipline.icon size={26} strokeWidth={1.5} aria-hidden="true" /></span>
                    <strong className={styles.count}>{discipline.count}</strong>
                    <h3>{discipline.name}</h3>
                    <p>{discipline.description}</p>
                    <span className={styles.share} aria-hidden="true"><span style={{ width: `${share}%` }} /></span>
                    <span className={styles.shareMeta}>{share.toFixed(1)}% of total</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
