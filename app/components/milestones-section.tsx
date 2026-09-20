"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "./site-image";
import { MilestoneFilm } from "./milestone-film";
import type { ProfileSection } from "../types/profile";

const categories = [
  { label: "Company", color: "#7b9bb5", image: "/assets/corporate-hero.webp", alt: "MTCC operations in the Maldives" },
  { label: "Construction and dredging", color: "#00aeef", image: "/assets/dredging.b509c471.webp", alt: "MTCC dredging operations" },
  { label: "Public transport", color: "#42cbbf", image: "/assets/transport.webp", alt: "MTCC public ferry at sea" },
  { label: "Trading and engineering", color: "#a8b7ed", image: "/assets/team-engineering.webp", alt: "MTCC engineering team at work" },
];
const sectors: Record<string, number[]> = {
  "1980": [0], "1981": [3], "1987": [3], "1994": [3], "1995": [1],
  "2002": [1, 2], "2003": [0], "2006": [2], "2007": [1], "2008": [3],
  "2009": [2], "2012": [1], "2015": [3], "2016": [2], "2017": [0, 1],
  "2019": [1], "2020": [2], "2022": [2], "2023": [0, 2, 3], "2024": [3],
  "2025": [2], "2026": [1, 2],
};

/*
 * One photo per milestone, from the supplied photo schedule. The file names in
 * that schedule follow each milestone's business area, so they line up with
 * `sectors` below. Two rows named files that were not delivered
 * 2026's dredging.png has since been supplied. 2022's transport2.png has not,
 * so it still falls back to the existing transport shot.
 */
const milestonePhotos: Record<string, string> = {
  "2026": "/assets/milestones/dredging.85a8ea25.webp",
  "2025": "/assets/milestones/transport1.f1fc3481.webp",
  "2024": "/assets/milestones/team-engineering.webp",
  "2023": "/assets/milestones/corporate-hero.webp",
  "2022": "/assets/transport.webp",
  "2020": "/assets/milestones/public-transport1.webp",
  "2019": "/assets/milestones/construction-and-dredging1.webp",
  "2017": "/assets/milestones/company-construction-and-dredging.webp",
  "2016": "/assets/milestones/public-transport2.webp",
  "2015": "/assets/milestones/trading-and-engineering1.webp",
  "2012": "/assets/milestones/construction-and-dredging2.webp",
  "2009": "/assets/milestones/public-transport3.webp",
  "2008": "/assets/milestones/trading-and-engineering2.webp",
  "2007": "/assets/milestones/construction-and-dredging3.webp",
  "2006": "/assets/milestones/public-transport4.webp",
  "2003": "/assets/milestones/company1.webp",
  "2002": "/assets/milestones/construction-and-dredging-public-transport.webp",
  "1995": "/assets/milestones/construction-and-dredging4.webp",
  "1994": "/assets/milestones/trading-and-engineering3.webp",
  "1987": "/assets/milestones/trading-and-engineering4.webp",
  "1981": "/assets/milestones/trading-and-engineering5.webp",
  "1980": "/assets/milestones/company2.webp",
};

const photoFor = (year: string) => milestonePhotos[year] ?? categories[(sectors[year] ?? [0])[0]].image;
const altFor = (year: string, title: string) => `${title}, ${year}`;

export function MilestonesSection({ section }: { section: Extract<ProfileSection, { type: "timeline" }> }) {
  const [filter, setFilter] = useState<number | null>(null);
  const [selected, setSelected] = useState(0);
  const [filmOpen, setFilmOpen] = useState(false);
  const filmPlayer = useRef<HTMLDivElement>(null);
  const closeFilm = useCallback(() => setFilmOpen(false), []);
  const rail = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const items = [...section.items].sort((a, b) => Number(b.year) - Number(a.year))
    .filter(item => filter === null || (sectors[item.year] ?? [0]).includes(filter));
  const active = Math.min(selected, items.length - 1);
  const item = items[active];
  const itemSectors = sectors[item.year] ?? [0];

  useEffect(() => {
    const button = buttons.current[active];
    const container = rail.current;
    if (!button || !container) return;
    container.scrollTo({ left: button.offsetLeft - container.clientWidth / 2 + button.offsetWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [active, filter]);

  function select(index: number) { setSelected(index); }
  function openFilm() {
    // Mount inside the click so fullscreen retains the user's activation.
    flushSync(() => setFilmOpen(true));
    if (document.fullscreenEnabled && filmPlayer.current?.requestFullscreen) {
      void filmPlayer.current.requestFullscreen({ navigationUI: "hide" }).catch(() => {
        // The player still fills the viewport when browser fullscreen is unavailable.
      });
    }
  }
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : event.key === "ArrowRight" ? (index + 1) % items.length : event.key === "ArrowLeft" ? (index - 1 + items.length) % items.length : null;
    if (next === null) return;
    event.preventDefault(); select(next); buttons.current[next]?.focus({ preventScroll: true });
  }

  return <section id={section.id} className="milestones-section" aria-labelledby="milestones-title"><div className="shell">
    <header className="milestones-heading"><p className="eyebrow">Our journey</p><h2 id="milestones-title">{section.title}<span>.</span></h2><p>From 1980 to today, stop by stop. Pick a year on the route or press play to watch the journey.</p></header>
    <div className="milestone-browser">
      <div className="milestone-filters" role="group" aria-label="Filter milestones by business area">
        {[{ label: "All milestones", color: "transparent" }, ...categories].map((entry, index) => <button key={entry.label} type="button" aria-pressed={filter === (index === 0 ? null : index - 1)} onClick={() => { setFilter(index === 0 ? null : index - 1); select(0); }}>
          {entry.label}
        </button>)}
      </div>
      <div className="milestone-stage">
        <div className="milestone-story">
          <div id="milestone-current" role="tabpanel" aria-labelledby={`milestone-year-${item.year}`} aria-live="polite">
            <time className="milestone-year" dateTime={item.year}>{item.year}</time>
            <div className="milestone-story-detail" key={item.year}>
              <div className="milestone-sector-labels">{itemSectors.map(index => <span key={index}>{categories[index].label}</span>)}</div>
              <h3>{item.title}</h3><p>{item.detail}</p>
            </div>
          </div>
          <div className="milestone-controls">
            <button type="button" aria-label="Previous milestone" disabled={active === 0} onClick={() => select(active - 1)}><ChevronLeft size={20} /></button>
            <button type="button" aria-label="Next milestone" disabled={active === items.length - 1} onClick={() => select(active + 1)}><ChevronRight size={20} /></button>
            <span>{String(active + 1).padStart(2, "0")} <span>/ {items.length}</span></span>
            <button className="milestone-play" type="button" aria-haspopup="dialog" onClick={openFilm}><Play size={15} aria-hidden="true" />Play</button>
          </div>
        </div>
        <div className="milestone-photo">
          {items.map(entry => <Image key={entry.year} src={photoFor(entry.year)} alt={entry === item ? altFor(entry.year, entry.title) : ""} aria-hidden={entry !== item} data-active={entry === item} fill sizes="(max-width: 760px) 90vw, 620px" loading={entry === item ? "eager" : "lazy"} />)}
        </div>
      </div>
      <div ref={rail} className="milestone-year-rail" role="tablist" aria-label="Milestone years, newest to oldest" style={{ "--year-count": items.length } as CSSProperties}>
        {items.map((entry, index) => <button key={entry.year} ref={element => { buttons.current[index] = element; }} type="button" id={`milestone-year-${entry.year}`} role="tab" aria-selected={active === index} aria-controls="milestone-current" tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => onKey(event, index)}><span>{entry.year}</span><b className="milestone-year-dot" /></button>)}
      </div>
    </div>
    {filmOpen && <MilestoneFilm title={section.title} playerRef={filmPlayer} onClose={closeFilm} items={[...items].reverse().map(entry => {
      const visual = categories[filter ?? (sectors[entry.year] ?? [0])[0]];
      return { ...entry, image: photoFor(entry.year), alt: altFor(entry.year, entry.title), category: visual.label };
    })} />}
  </div></section>;
}
