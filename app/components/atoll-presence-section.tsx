"use client";

import { useState } from "react";
import { Anchor, Bus, MapPin } from "lucide-react";
import { MaldivesAtollMap } from "./maldives-atoll-map";
import { allAtolls, presenceMetrics, type Atoll } from "../data/atoll-presence";
import styles from "./atoll-presence-section.module.css";

function EntryList({ atoll }: { atoll: Atoll }) {
  if (atoll.entries.length === 0) {
    return <p className={styles.quiet}>Served through our project teams and the RTL network that reaches all 20 atolls.</p>;
  }
  return (
    <ul className={styles.entries}>
      {atoll.entries.map(entry => (
        <li key={entry.detail} data-kind={entry.kind}>
          {entry.kind === "project" ? <Anchor size={15} aria-hidden="true" /> : <Bus size={15} aria-hidden="true" />}
          <span>
            {entry.detail}
            {entry.value !== undefined && <b> MVR {entry.value}M</b>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AtollPresenceSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = selected ? allAtolls.find(atoll => atoll.code === selected) ?? null : null;

  return (
    <section id="presence" className={styles.section} aria-labelledby="presence-title">
      <div className="shell">
        <div className={styles.layout}>
          <div className={styles.lead}>
            <header className={styles.heading}>
              <p className={styles.eyebrow}>Nationwide footprint</p>
              <h2 id="presence-title">Present in <span>every atoll.</span></h2>
              <p className={styles.intro}>From Haa Alif in the north to Seenu in the south, MTCC builds, dredges and carries passengers in all 20 atolls of the Maldives.</p>
            </header>

            <div className={styles.metrics}>
              {presenceMetrics.map(metric => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>

            <p className={styles.legend}>
              <span data-kind="project"><Anchor size={14} aria-hidden="true" /> Projects and construction</span>
              <span data-kind="transport"><Bus size={14} aria-hidden="true" /> Public transport</span>
            </p>
          </div>

          <figure className={styles.panel}>
            <MaldivesAtollMap selected={selected} onSelect={code => setSelected(current => (current === code ? null : code))} />
            <figcaption className={styles.readout} aria-live="polite">
              {active ? (
                <>
                  <span className={styles.readoutCode}>{active.code}</span>
                  <div>
                    <strong>{active.name}</strong>
                    <EntryList atoll={active} />
                  </div>
                </>
              ) : (
                <p className={styles.prompt}><MapPin size={16} aria-hidden="true" /> Choose a pin to see what we run in that atoll.</p>
              )}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
