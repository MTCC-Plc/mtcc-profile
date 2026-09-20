"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { categoryTotal, machineCategories, machineHighlights, totalMachines } from "../data/fleet-equipment";
import styles from "./fleet-section.module.css";

const MACHINE_ART = [
  <><path d="M3 19h10v-5H6z" /><path d="M9 14V9l6-4 5 6" /><path d="M20 11l-1 5h-3" /><path d="M2 21h12" /></>,
  <><path d="M2 16V9h11l2 7" /><path d="M15 16v-5h4l3 3v2" /><circle cx="6.5" cy="18" r="2" /><circle cx="17.5" cy="18" r="2" /></>,
  <><path d="M8 17V10h7l2 4h3v3" /><path d="M8 13 3 11v5l3 1" /><circle cx="10" cy="18" r="2.2" /><circle cx="18" cy="18" r="2.2" /></>,
  <><path d="M6 21V4l14 5" /><path d="M6 8l8-1.5" /><path d="M17 8v6" /><path d="M15.5 14h3v2.5h-3z" /><path d="M3 21h8" /></>,
  <><path d="M4 21V11l5-3v13" /><path d="M9 21V6l6-3v18" /><path d="M15 21v-9l5 2v7" /><path d="M2 21h20" /></>,
  <><path d="M7 4h10l-2 7H9z" /><path d="M9 11v4h6v-4" /><path d="M5 21l3-6M19 21l-3-6" /><path d="M3 21h18" /></>,
];

/**
 * The owned plant register. The dredging vessels live with "Dredging and
 * reclamation" in the business explorer, so their figures are not repeated here.
 */
export function FleetSection() {
  const [category, setCategory] = useState<number | null>(null);

  return (
    <section id="fleet" className={styles.section} aria-labelledby="fleet-title">
      <div className="shell">
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Fleet and plant</p>
          <h2 id="fleet-title">Our fleet <span>and equipment.</span></h2>
          <p className={styles.intro}>Beyond the dredgers, {totalMachines} machines that MTCC owns and operates, from excavators and cranes to our own asphalt and batching plants. Projects start when you are ready, not when hired equipment becomes available.</p>
        </header>

        <div className={styles.machineHead}>
          <strong>{totalMachines}</strong>
          <p>machines on the ground as of September 2026, owned outright and maintained in house.</p>
        </div>

        <div className={styles.highlights}>
          {machineHighlights.map((highlight, index) => (
            <div key={highlight.label}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{MACHINE_ART[index]}</svg>
              <b>{highlight.count}</b>
              <span>{highlight.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.stack} data-filtered={category !== null || undefined} role="group" aria-label="Machinery by category">
          {machineCategories.map((item, index) => {
            const total = categoryTotal(item);
            return (
              <button
                type="button"
                key={item.name}
                data-hit={category === index || undefined}
                style={{ "--c": item.colour, width: `${(total / totalMachines) * 100}%` } as React.CSSProperties}
                aria-label={`${item.name}, ${total} machines`}
                aria-pressed={category === index}
                onClick={() => setCategory(current => (current === index ? null : index))}
              />
            );
          })}
        </div>
        <p className={styles.hint}>Tap a colour or a category to see every machine type inside it.</p>

        <div className={styles.categories}>
          {machineCategories.map((item, index) => {
            const total = categoryTotal(item);
            const largest = item.machines[0].count;
            const open = category === index;
            return (
              <div className={styles.category} key={item.name} data-open={open || undefined} style={{ "--c": item.colour } as React.CSSProperties}>
                <button type="button" aria-expanded={open} onClick={() => setCategory(current => (current === index ? null : index))}>
                  <span className={styles.categoryName}>{item.name}<ChevronDown size={17} aria-hidden="true" /></span>
                  <span className={styles.categoryCount}>{total}</span>
                  <span className={styles.categoryMeta}>{item.machines.length} machine types, {Math.round((total / totalMachines) * 100)}% of the fleet</span>
                </button>
                {open && (
                  <dl className={styles.rows}>
                    {item.machines.map(machine => (
                      <div key={machine.name}>
                        <dt>{machine.name}</dt>
                        <dd>{machine.count}</dd>
                        <span className={styles.bar}><i style={{ width: `${Math.max((machine.count / largest) * 100, 2.5)}%` }} /></span>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
