"use client";

import { CurrencyText } from "./currency-symbol";


import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCurrency } from "./currency-toggle";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import type { CSSProperties, KeyboardEvent } from "react";
import type { ProfileSection } from "../types/profile";

function AnimatedFigure({ value }: { value: string }) {
  return <><span className="sr-only">{value}</span><span aria-hidden="true" data-breakdown-value={value}>{value}</span></>;
}

export function ProjectBreakdown({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  const { currency } = useCurrency();
  const previousCurrency = useRef(currency);
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
    if (tab?.parentElement) tab.parentElement.scrollTo({left: tab.offsetLeft - tab.parentElement.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
  }, [active, compact]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const explorer = useRef<HTMLDivElement>(null);
  const scroll = useRef<ScrollTrigger | null>(null);
  const manualSelection = useRef(false);
  const displayedFigures = useRef<number[]>([]);
  const displayedRing = useRef<number | null>(null);
  useLayoutEffect(() => {
    const panel = explorer.current?.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])');
    if (!panel) return;
    const figures = Array.from(panel.querySelectorAll<HTMLElement>("[data-breakdown-value]"));
    const currencyChanged = previousCurrency.current !== currency;
    previousCurrency.current = currency;
    const previousFigures = currencyChanged ? [] : [...displayedFigures.current];
    displayedFigures.current = figures.map(element => Number(element.dataset.breakdownValue!.replaceAll(",", "")));
    const ring = panel.querySelector<HTMLElement>(".breakdown-ring");
    const targetRing = parseFloat(ring?.dataset.completed ?? "0");
    const previousRing = displayedRing.current ?? targetRing;
    displayedRing.current = targetRing;
    const restore = () => figures.forEach(element => { element.textContent = element.dataset.breakdownValue!; });
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const animation = gsap.timeline({ defaults: { duration: .6, ease: "power2.out" } });
      if (ring) {
        animation.fromTo(ring, { "--completed": `${previousRing}%` }, {
          "--completed": ring.dataset.completed!,
          onUpdate: () => { displayedRing.current = parseFloat(ring.style.getPropertyValue("--completed")); },
        }, 0);
      }
      figures.forEach((element, index) => {
        const original = element.dataset.breakdownValue!;
        if (!/^\d[\d,]*(?:\.\d+)?$/.test(original)) return;
        const decimals = original.split(".")[1]?.length ?? 0;
        const number = { value: previousFigures[index] ?? displayedFigures.current[index] };
        const format = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: original.includes(","),
        });
        element.textContent = format.format(number.value);
        displayedFigures.current[index] = number.value;
        animation.to(number, {
          value: Number(original.replaceAll(",", "")),
          onUpdate: () => { displayedFigures.current[index] = number.value; element.textContent = format.format(number.value); },
          onComplete: () => { element.textContent = original; },
        }, 0);
      });
      return restore;
    });
    return () => {
      const currentFigures = [...displayedFigures.current];
      const currentRing = displayedRing.current;
      media.revert();
      displayedFigures.current = currentFigures;
      displayedRing.current = currentRing;
      restore();
    };
  }, [active, currency]);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1000px) and (min-height: 700px)", mobile: "(max-width: 999px) and (min-height: 740px)" }, context => {
      if (!context.conditions?.motion || !explorer.current || !categories.length) return;
      const desktop = Boolean(context.conditions.desktop);
      const pinned = Boolean(desktop || context.conditions.mobile);
      if (!pinned) return;
      explorer.current.classList.toggle("breakdown-scroll-pinned", desktop);
      explorer.current.classList.toggle("breakdown-scroll-mobile", !desktop);
      if (!desktop && explorer.current.offsetHeight > window.innerHeight - 96) {
        explorer.current.classList.remove("breakdown-scroll-mobile", "breakdown-scroll-driven");
        return;
      }
      // Keep mobile browser toolbar resizing from changing chapter boundaries.
      const mobileChapterHeight = window.innerHeight;
      const trigger = ScrollTrigger.create({
        trigger: explorer.current,
        start: pinned ? "top 80px" : "top 35%",
        end: pinned ? () => `+=${(desktop ? window.innerHeight : mobileChapterHeight) * categories.length * (desktop ? .65 : .95)}` : "bottom 65%",
        pin: pinned,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (self.isActive && !manualSelection.current) {
            const position = self.progress * categories.length;
            setActive(previous => {
              const next = Math.min(categories.length - 1, Math.floor(position));
              // Small finger movements near a boundary should not replay two panels.
              if (next > previous && position < previous + 1.025) return previous;
              if (next < previous && position > previous - .025) return previous;
              return next;
            });
          }
        },
        onLeave: () => { manualSelection.current = false; setActive(categories.length - 1); },
        onLeaveBack: () => { manualSelection.current = false; setActive(0); },
      });
      scroll.current = trigger;
      const frame = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
      return () => { cancelAnimationFrame(frame); scroll.current = null; explorer.current?.classList.remove("breakdown-scroll-pinned", "breakdown-scroll-mobile"); };
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
              <div className="breakdown-total"><span>Total projects</span><strong><AnimatedFigure value={count[3]} /></strong><small>Across this category</small></div>
              <div className="breakdown-ring" data-completed={`${total ? completed / total * 100 : 0}%`} style={{ "--completed": `${total ? completed / total * 100 : 0}%` } as CSSProperties}><div><strong><AnimatedFigure value={String(Math.round(total ? completed / total * 100 : 0))} /><em>%</em></strong><span>Completed</span></div></div>
              <dl className="breakdown-count-legend">{count.slice(1, 3).map((value, i) => <div key={i}><dt><i aria-hidden="true" />{counts.columns[i + 1]}</dt><dd><AnimatedFigure value={value} /></dd></div>)}</dl>
            </div>}
            <div className="breakdown-value-grid">{category.rows.map(row => <div className="breakdown-value" key={row[0]}><h4>{row[0]}</h4><dl>{row.slice(1).map((value, i) => <div key={i}><dt><CurrencyText value={category.columns[i + 1]} /></dt><dd><AnimatedFigure value={value} /></dd></div>)}</dl></div>)}</div>
            {category.note && <p>{category.note}</p>}
          </article>;
        })}</div>
      </div>
      <details className="breakdown-comparison"><summary><span>{counts.title}<small>Compare all five categories</small></span><span className="breakdown-expand" aria-hidden="true">+</span></summary>
        <div className="report-table-scroll" role="region" aria-label="Project counts comparison" tabIndex={0}><table><caption className="sr-only">{counts.title}</caption><thead><tr>{counts.columns.map(column => <th scope="col" key={column}><CurrencyText value={column} /></th>)}</tr></thead><tbody>{counts.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>
        {counts.note && <p>{counts.note}</p>}
      </details>
    </div>
  </section>;
}
