"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import type { CSSProperties, KeyboardEvent } from "react";
import type { ProfileSection } from "../types/profile";

export function ProjectBreakdown({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  const tables = section.blocks.filter(block => block.type === "table");
  const counts = tables[0];
  const categories = tables.slice(1);
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 999px)");
    const update = () => setCompact(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!compact) return;
    const tab = tabs.current[active];
    if (tab?.parentElement) tab.parentElement.scrollTo({left: tab.offsetLeft - tab.parentElement.offsetLeft, behavior: "instant"});
  }, [active, compact]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const explorer = useRef<HTMLDivElement>(null);
  const scroll = useRef<ScrollTrigger | null>(null);
  const manualSelection = useRef(false);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1000px) and (min-height: 700px)" }, context => {
      if (!context.conditions?.motion || !explorer.current || !categories.length) return;
      const pinned = Boolean(context.conditions.desktop);
      explorer.current.classList.toggle("breakdown-scroll-pinned", pinned);
      const trigger = ScrollTrigger.create({
        trigger: explorer.current,
        start: pinned ? "top 80px" : "top 35%",
        end: pinned ? () => `+=${window.innerHeight * categories.length * .65}` : "bottom 65%",
        pin: pinned,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (self.isActive && !manualSelection.current) setActive(Math.min(categories.length - 1, Math.floor(self.progress * categories.length)));
        },
        onLeave: () => { manualSelection.current = false; setActive(categories.length - 1); },
        onLeaveBack: () => { manualSelection.current = false; setActive(0); },
      });
      scroll.current = trigger;
      const frame = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
      return () => { cancelAnimationFrame(frame); scroll.current = null; explorer.current?.classList.remove("breakdown-scroll-pinned"); };
    });
    return () => media.revert();
  }, [categories.length]);
  if (!counts) return null;
  const prefix = section.id;

  function select(index: number) {
    const trigger = scroll.current;
    manualSelection.current = Boolean(trigger && !trigger.vars.pin);
    if (trigger?.isActive && trigger.vars.pin) {
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * (index + .5) / categories.length, behavior: "instant" });
    }
    setActive(index);
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % categories.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index + categories.length - 1) % categories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = categories.length - 1;
    else return;
    event.preventDefault(); select(next); tabs.current[next]?.focus({ preventScroll: true });
  }

  return <section id={section.id} className="breakdown-section" aria-labelledby={`${prefix}-title`}>
    <div className="shell">
      <header className="breakdown-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id={`${prefix}-title`}>{section.title}<span>.</span></h2></header>
      <div ref={explorer} className="breakdown-explorer">
        <div className="breakdown-sidebar"><p>Explore by category</p><div className="breakdown-tabs" role="tablist" aria-label="Project categories" aria-orientation={compact ? "horizontal" : "vertical"}>
          {categories.map((category, index) => <button key={category.title} ref={el => { tabs.current[index] = el; }} type="button" id={`${prefix}-tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`${prefix}-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => onKey(event, index)}><span aria-hidden="true">0{index + 1}</span>{category.title}<span className="breakdown-tab-arrow" aria-hidden="true">↗</span></button>)}
        </div></div>
        <div className="breakdown-panels">{categories.map((category, index) => {
          const count = counts.rows.find(row => row[0] === category.title);
          const completed = Number(count?.[1] ?? 0), total = Number(count?.[3] ?? 0);
          return <article key={category.title} id={`${prefix}-panel-${index}`} role="tabpanel" aria-labelledby={`${prefix}-tab-${index}`} hidden={active !== index} tabIndex={0} className="breakdown-panel">
            <h3>{category.title}</h3>
            {count && <div className="breakdown-counts">
              <div className="breakdown-ring" style={{ "--completed": `${total ? completed / total * 100 : 0}%` } as CSSProperties}><div><strong>{count[3]}</strong><span>{counts.columns[3]} projects</span></div></div>
              <dl className="breakdown-count-legend">{count.slice(1, 3).map((value, i) => <div key={i}><dt><i aria-hidden="true" />{counts.columns[i + 1]}</dt><dd>{value}</dd></div>)}</dl>
            </div>}
            <div className="breakdown-value-grid">{category.rows.map(row => <div className="breakdown-value" key={row[0]}><h4>{row[0]}</h4><dl>{row.slice(1).map((value, i) => <div key={i}><dt>{category.columns[i + 1]}</dt><dd>{value}</dd></div>)}</dl></div>)}</div>
            {category.note && <p>{category.note}</p>}
          </article>;
        })}</div>
      </div>
      <details className="breakdown-comparison"><summary><span>{counts.title}<small>Compare all five categories</small></span><span className="breakdown-expand" aria-hidden="true">+</span></summary>
        <div className="report-table-scroll" role="region" aria-label="Project counts comparison" tabIndex={0}><table><caption className="sr-only">{counts.title}</caption><thead><tr>{counts.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{counts.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>
        {counts.note && <p>{counts.note}</p>}
      </details>
    </div>
  </section>;
}
