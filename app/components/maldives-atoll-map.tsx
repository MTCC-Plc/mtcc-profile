"use client";

import SiteImage from "./site-image";
import { allAtolls, type Atoll } from "../data/atoll-presence";
import styles from "./maldives-atoll-map.module.css";

/**
 * The atoll map used across MTCC's project portal: cyan atolls on a navy field,
 * with a pin on every atoll. The islands, labels and leader lines are the shared
 * artwork in public/assets/maldives-atolls.svg; the pins are drawn here so they
 * can be hovered, focused and selected. Both use the same viewBox, so a pin sits
 * exactly where its atoll does.
 */
const VIEW_BOX = "110 -6 400.28 815";

/** The pin artwork is authored once, at Kaafu, and translated to every other atoll. */
const PIN_ORIGIN = { x: 332.79, y: 302.99 };

function Pin({ atoll, selected, onSelect }: { atoll: Atoll; selected: boolean; onSelect: (code: string) => void }) {
  const dx = atoll.x - PIN_ORIGIN.x;
  const dy = atoll.y - PIN_ORIGIN.y;
  const count = atoll.entries.length;
  const summary = count === 0
    ? `${atoll.name}: served through project teams and the RTL network`
    : `${atoll.name}: ${count} ${count === 1 ? "entry" : "entries"}`;

  return (
    /*
     * Two nested groups on purpose. The outer one carries the `transform`
     * attribute that puts the pin on its atoll; the inner one carries every CSS
     * transform. A CSS `transform` overrides the presentation attribute, so
     * scaling the outer group would drop all 20 pins back onto Kaafu.
     */
    <g
      className={styles.pinPos}
      transform={`translate(${dx} ${dy})`}
      data-selected={selected || undefined}
      data-quiet={count === 0 || undefined}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={summary}
      onClick={() => onSelect(atoll.code)}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(atoll.code);
        }
      }}
    >
      <g className={styles.pin}>
        {/* A generous transparent target so the pin is easy to hit on touch screens. */}
        <circle className={styles.pinTarget} cx={PIN_ORIGIN.x} cy={PIN_ORIGIN.y - 24} r="19" />
        <circle className={styles.pinRing} cx={PIN_ORIGIN.x} cy={PIN_ORIGIN.y - 23.65} r="13.5" />
        <path className={styles.pinBody} d="M332.79,302.99s-11.56-17.32-11.56-23.71,5.17-11.56,11.56-11.56,11.56,5.17,11.56,11.56-11.56,23.71-11.56,23.71" />
        <path className={styles.pinDisc} d="M342.08,279.34c0,5.13-4.16,9.29-9.29,9.29s-9.29-4.16-9.29-9.29,4.16-9.29,9.29-9.29,9.29,4.16,9.29,9.29Z" />
        <g className={styles.pinMark}>
          <polygon points="329.82 280.66 331.46 280.66 331.46 281.09 330.91 281.09 330.91 282.41 330.37 282.41 330.37 281.09 329.82 281.09 329.82 280.66" />
          <path d="M335.67,281.69l.47,.14c-.03,.13-.08,.24-.15,.33-.07,.09-.15,.16-.25,.2-.1,.05-.23,.07-.39,.07-.19,0-.34-.03-.46-.08-.12-.06-.22-.15-.31-.29-.09-.14-.13-.32-.13-.53,0-.29,.08-.51,.23-.67,.15-.16,.37-.23,.65-.23,.22,0,.39,.04,.52,.13,.13,.09,.22,.23,.28,.41l-.48,.11c-.02-.05-.03-.09-.05-.12-.03-.04-.07-.07-.11-.09-.04-.02-.09-.03-.15-.03-.12,0-.22,.05-.28,.15-.05,.07-.07,.19-.07,.35,0,.2,.03,.33,.09,.41,.06,.07,.14,.11,.25,.11s.19-.03,.24-.09c.05-.06,.09-.15,.12-.26Z" fillRule="evenodd" />
          <path d="M332.24,280.66h.71l.27,1.07,.27-1.07h.71v1.75h-.44v-1.34l-.34,1.34h-.4l-.34-1.34v1.34h-.44v-1.75Z" fillRule="evenodd" />
          <polygon points="334.6 276.35 336.24 276.35 336.24 276.78 335.69 276.78 335.69 278.1 335.15 278.1 335.15 276.78 334.6 276.78 334.6 276.35" />
          <path d="M329.19,276.35h.71l.27,1.07,.27-1.07h.71v1.75h-.44v-1.34l-.34,1.34h-.4l-.34-1.34v1.34h-.44v-1.75Z" fillRule="evenodd" />
        </g>
      </g>
    </g>
  );
}

export function MaldivesAtollMap({ selected, onSelect }: { selected: string | null; onSelect: (code: string) => void }) {
  return (
    <div className={styles.map}>
      <SiteImage
        className={styles.base}
        src="/assets/maldives-atolls.svg"
        width={401}
        height={815}
        alt="Map of the Maldives showing all 20 atolls from Haa Alif in the north to Seenu in the south"
      />
      <svg className={styles.pins} viewBox={VIEW_BOX} role="group" aria-label="MTCC presence by atoll. Choose an atoll to see its projects and services.">
        {allAtolls.map(atoll => (
          <Pin key={atoll.code} atoll={atoll} selected={selected === atoll.code} onSelect={onSelect} />
        ))}
      </svg>
    </div>
  );
}
