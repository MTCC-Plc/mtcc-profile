"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Handshake } from "lucide-react";
import type { ProfileSection } from "../types/profile";
import { SectionLink } from "./section-link";
import styles from "./potential-partnerships-section.module.css";

export function PotentialPartnershipsSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  const headingId = `${section.id}-title`;
  const railId = `${section.id}-cards`;
  const rail = useRef<HTMLUListElement>(null);
  const cards = section.blocks.filter(block => block.type === "text" && block.title);
  const [position, setPosition] = useState({ start: 0, visible: 3, previous: false, next: cards.length > 3 });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    function update() {
      if (!element) return;
      const styles = getComputedStyle(element);
      const step = (element.firstElementChild?.getBoundingClientRect().width ?? 0) + parseFloat(styles.columnGap);
      const visible = Number(styles.getPropertyValue("--cards-per-view")) || 3;
      const next = {
        start: step ? Math.round(element.scrollLeft / step) : 0,
        visible,
        previous: element.scrollLeft > 1,
        next: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
      };
      setPosition(current => current.start === next.start && current.visible === next.visible && current.previous === next.previous && current.next === next.next ? current : next);
    }
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    const frame = requestAnimationFrame(update);
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, [cards.length]);

  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    const gap = parseFloat(getComputedStyle(element).columnGap);
    const step = (element.firstElementChild?.getBoundingClientRect().width ?? 0) + gap;
    element.scrollBy({ left: direction * step * position.visible, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      event.currentTarget.scrollTo({ left: event.key === "Home" ? 0 : event.currentTarget.scrollWidth, behavior: "instant" });
    }
  }

  return <section id={section.id} className={styles.section} aria-labelledby={headingId}>
    <div className={styles.lines} aria-hidden="true"><span /><span /><span /></div>
    <div className={`shell ${styles.inner}`}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}><span aria-hidden="true" />{section.eyebrow}</p>
        <h2 id={headingId}>{section.title}</h2>
        {section.intro && <p className={styles.intro}>{section.intro}</p>}
      </div>
      <SectionLink href="#contact" className={styles.contact}>
        <span>Get in touch</span><span className={styles.arrow}><ArrowUpRight size={24} aria-hidden="true" /></span>
      </SectionLink>
    </div>
    {cards.length > 0 && <div className={`shell ${styles.carousel}`}>
      <div className={styles.toolbar}>
        <p className={styles.hint}>Explore partnership opportunities</p>
        <div className={styles.navigation}>
          <span className={styles.position} aria-live="polite" aria-atomic="true">{String(position.start + 1).padStart(2, "0")}–{String(Math.min(position.start + position.visible, cards.length)).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}</span>
          <button type="button" aria-label="Previous partnership cards" aria-controls={railId} disabled={!position.previous} onClick={() => move(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="Next partnership cards" aria-controls={railId} disabled={!position.next} onClick={() => move(1)}><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
      <ul ref={rail} id={railId} className={styles.viewport} aria-label="Partnership opportunities" tabIndex={0} onKeyDown={onKeyDown}>
        {cards.map((card, index) => card.type === "text" && <li className={styles.card} key={card.title}>
          <div className={styles.cardTop}><span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span><span className={styles.cardIcon}><Handshake size={27} strokeWidth={1.5} aria-hidden="true" /></span></div>
          <h3>{card.title}</h3>
          {card.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <SectionLink href="#contact" className={styles.cardLink}>Discuss an opportunity<span className="sr-only"> in {card.title}</span><ArrowUpRight size={18} aria-hidden="true" /></SectionLink>
        </li>)}
      </ul>
    </div>}
  </section>;
}
