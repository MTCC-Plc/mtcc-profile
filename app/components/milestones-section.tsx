"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "./site-image";
import type { ProfileSection } from "../types/profile";

const eras = [
  { title: "Laying the foundations", end: 1999, image: "/assets/shipbuilding.webp", caption: "A foundation in marine expertise." },
  { title: "Connecting communities", end: 2009, image: "/assets/conventional-ferry.webp", caption: "Connections that bring us closer." },
  { title: "Building at scale", end: 2020, image: "/assets/dredging.webp", caption: "The capability to shape our islands." },
  { title: "Moving into the future", end: Infinity, image: "/assets/transport.webp", caption: "New possibilities. Nationwide." },
];

export function MilestonesSection({ section }: { section: Extract<ProfileSection, { type: "timeline" }> }) {
  const [open, setOpen] = useState<number | null>(0);
  const [visual, setVisual] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const interacted = useRef(false);
  const chapters = eras.map((era, index) => ({ ...era,
    items: section.items.filter(item => Number(item.year) > (eras[index - 1]?.end ?? -Infinity) && Number(item.year) <= era.end),
  })).filter(era => era.items.length);

  useEffect(() => {
    const scrollAtSelection = window.scrollY;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 380;
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const button = open === null ? null : buttons.current[open];
      if (interacted.current && button && Math.abs(window.scrollY - scrollAtSelection) < 100 && button.getBoundingClientRect().top < 90) {
        button.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [open]);

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "Home" ? 0 : event.key === "End" ? chapters.length - 1 : event.key === "ArrowDown" ? (index + 1) % chapters.length : event.key === "ArrowUp" ? (index - 1 + chapters.length) % chapters.length : null;
    if (next === null) return;
    event.preventDefault(); buttons.current[next]?.focus();
  }

  return <section id={section.id} className="milestones-section" aria-labelledby="milestones-title"><div className="shell">
    <header className="milestones-heading"><p className="eyebrow">Our journey</p><h2 id="milestones-title">{section.title}<span>.</span></h2><p>Explore the chapters of our story.</p></header>
    <div className="milestones-explorer">
      <div className="milestone-chapters">{chapters.map((chapter, index) => {
        const expanded = open === index;
        const range = `${chapter.items[0].year}–${chapter.items.at(-1)!.year}`;
        return <article className="milestone-chapter" key={chapter.title} data-open={expanded}>
          <h3><button ref={element => { buttons.current[index] = element; }} id={`milestone-chapter-${index}`} type="button" aria-expanded={expanded} aria-controls={`milestone-panel-${index}`} onKeyDown={event => onKey(event, index)} onClick={() => {
            interacted.current = true;
            setOpen(expanded ? null : index);
            setVisual(index);
          }}><span><small>{range}</small>{chapter.title}</span><ChevronDown size={24} aria-hidden="true" /></button></h3>
          <div className="milestone-disclosure" data-open={expanded} aria-hidden={!expanded} inert={!expanded}>
            <div className="milestone-disclosure-clip"><div id={`milestone-panel-${index}`} role="region" aria-labelledby={`milestone-chapter-${index}`}>
              <div className="milestone-mobile-image" aria-hidden="true"><Image src={chapter.image} alt="" fill sizes="(max-width: 760px) 100vw, 1px" loading="eager" fetchPriority="low" /></div>
              <ol className="milestone-events">{chapter.items.map(item => <li key={item.year}><time>{item.year}</time><div><h4>{item.title}</h4><p>{item.detail}</p></div></li>)}</ol>
            </div></div>
          </div>
        </article>;
      })}</div>
      <div className="milestone-visuals" aria-hidden="true">{chapters.map((chapter,index) => <figure className="milestone-visual" data-active={visual === index} key={chapter.title}>
        <Image src={chapter.image} alt="" fill sizes="(max-width: 760px) 1px, 650px" loading="eager" fetchPriority="low" />
        <div className="milestone-visual-shade" /><figcaption><span>{chapter.items[0].year}–{chapter.items.at(-1)!.year}</span><strong>{chapter.caption}</strong><small>MTCC operations</small></figcaption>
      </figure>)}</div>
    </div>
  </div></section>;
}
