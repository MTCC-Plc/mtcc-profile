"use client";

import { useState } from "react";
import { dredgerCapacity, dredgerTypes, type DredgerType } from "../data/fleet-equipment";
import styles from "./dredging-fleet.module.css";

/** Side elevations of the two dredger classes, drawn to read at badge size. */
const DREDGER_ART: Record<DredgerType["id"], React.ReactNode> = {
  tshd: (
    <svg viewBox="0 0 96 34" aria-hidden="true">
      <path d="M2 18h92l-7 11H10z" /><path d="M66 18V8h16v10z" /><path d="M71 8V2h6v6z" />
      <path className={styles.line} d="M14 14h44" /><path className={styles.line} d="M22 14V9M34 14V9M46 14V9" />
      <path className={styles.line} d="M26 24l14 8" />
    </svg>
  ),
  csd: (
    <svg viewBox="0 0 64 34" aria-hidden="true">
      <path d="M14 18h40v9H14z" /><path d="M32 18V10h13v8z" />
      <path className={styles.line} d="M14 18l7-10 5 10" /><path className={styles.line} d="M14 22 3 31" />
      <circle cx="3" cy="31" r="2.2" />
      <path className={styles.line} d="M49 5v26M53 5v26" />
    </svg>
  ),
};

/**
 * The dredging vessels: capacity, one badge per hull, and the two classes.
 * This lives with "Dredging and reclamation" rather than the fleet section, so
 * the vessel figures are stated once on the page.
 */
export function DredgingFleet() {
  const [selected, setSelected] = useState<DredgerType["id"] | null>(null);
  const hulls = dredgerTypes.flatMap(type => Array.from({ length: type.count }, (_, index) => ({ type, index })));

  return (
    <div className={styles.dredging}>
      <div className={styles.capacity}>
        <span className={styles.kicker}>Dredging fleet</span>
        <strong>{dredgerCapacity.perDay}<small>{dredgerCapacity.unit}</small></strong>
        <p>Total dredging capacity with all {dredgerCapacity.vessels} vessels working, the largest in the Maldives, backed by 20+ years as the country&apos;s leading shore protection contractor.</p>
        <div className={styles.hulls} data-filtered={selected !== null || undefined} role="group" aria-label="The six dredgers in service">
          {hulls.map(({ type, index }) => (
            <button
              type="button"
              key={`${type.id}-${index}`}
              className={styles.hull}
              data-hit={selected === type.id || undefined}
              aria-label={type.count === 1 ? type.name : `${type.name.replace(/s$/, "")} ${index + 1} of ${type.count}`}
              aria-pressed={selected === type.id}
              onClick={() => setSelected(current => (current === type.id ? null : type.id))}
            >
              {DREDGER_ART[type.id]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.types}>
        {dredgerTypes.map(type => (
          <button
            type="button"
            key={type.id}
            className={styles.type}
            data-hit={selected === type.id || undefined}
            aria-pressed={selected === type.id}
            onClick={() => setSelected(current => (current === type.id ? null : type.id))}
          >
            <b>{type.name}<em>&times; {type.count}</em></b>
            <span className={styles.typeSummary}>{type.summary}</span>
            <span className={styles.typeDetail}>{type.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
