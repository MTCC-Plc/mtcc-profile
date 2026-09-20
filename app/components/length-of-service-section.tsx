"use client";

import { useState } from "react";
import { serviceThresholds, serviceTiers } from "../data/length-of-service";
import styles from "./length-of-service-section.module.css";

export function LengthOfServiceSection() {
  const [threshold, setThreshold] = useState(serviceThresholds[0]);

  return (
    <section id="length-of-service" className={styles.section} aria-labelledby="length-of-service-title">
      <div className="shell">
        <div className={styles.layout}>
          <div className={styles.lead}>
            <p className={styles.eyebrow}>Length of service</p>
            <h2 id="length-of-service-title">Experience you <span>cannot hire overnight.</span></h2>

            <div className={styles.total}>
              <strong>{threshold.total.toLocaleString("en-GB")}</strong>
              <span aria-live="polite">{threshold.label}</span>
            </div>

            <div className={styles.segments} role="group" aria-label="Show people with at least">
              {serviceThresholds.map(option => (
                <button
                  type="button"
                  key={option.min}
                  aria-pressed={threshold.min === option.min}
                  onClick={() => setThreshold(option)}
                >
                  {option.option}
                </button>
              ))}
            </div>

            <p className={styles.summary}>
              Between them, more than <b>{threshold.years}</b> of hands-on MTCC experience, on the same reefs, harbours and routes your project will depend on.
            </p>
          </div>

          <ol className={styles.tiers}>
            {serviceTiers.map(tier => (
              <li key={tier.min} className={styles.tier} data-dim={tier.min < threshold.min || undefined} style={{ "--c": tier.colour } as React.CSSProperties}>
                <span className={styles.badge}>{tier.badge}<small>years</small></span>
                <div>
                  <p className={styles.tierCount}><b>{tier.count.toLocaleString("en-GB")}</b><span>{tier.label}</span></p>
                  <p className={styles.tierNote}>{tier.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
