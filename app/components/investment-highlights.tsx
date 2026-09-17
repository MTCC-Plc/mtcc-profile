"use client";

import Image from "./site-image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProfileSection } from "../types/profile";

const images = ["/assets/bridge.webp", "/assets/infrastructure.webp", "/assets/dredging.webp", "/assets/corporate-hero.webp", "/assets/contact-site.webp", "/assets/transport.webp", "/assets/bridge.webp", "/assets/team-engineering.webp"];

export function InvestmentHighlights({ section }: { section: Extract<ProfileSection, { type: "metrics" }> }) {
  const rail = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scroll = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const count = section.metrics.length;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1000px) and (min-height: 700px)" }, context => {
      const element = rail.current;
      const container = stage.current;
      if (!context.conditions?.motion || !element || !container) return;
      const pinned = Boolean(context.conditions.desktop);
      container.classList.add("investment-scroll-driven");
      container.classList.toggle("investment-scroll-pinned", pinned);
      let drivenAt = 0;
      const drive = (progress: number) => {
        drivenAt = performance.now();
        element.scrollTo({ left: progress * (element.scrollWidth - element.clientWidth), behavior: "instant" });
      };
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: pinned ? "top 80px" : "top 35%",
        end: pinned ? () => `+=${window.innerHeight * (count - 1) * .65}` : "bottom 65%",
        pin: pinned,
        invalidateOnRefresh: true,
        onUpdate: self => { if (self.isActive) drive(self.progress); },
        onLeave: () => drive(1),
        onLeaveBack: () => drive(0),
      });
      scroll.current = trigger;
      // Native horizontal swipes remain aligned with the vertical scroll story.
      const syncSwipe = () => {
        if (!pinned || window.scrollY < trigger.start - 2 || window.scrollY > trigger.end + 2 || performance.now() - drivenAt < 150) return;
        const distance = element.scrollWidth - element.clientWidth;
        if (distance <= 0) return;
        const progress = element.scrollLeft / distance;
        if (Math.abs(progress - trigger.progress) > .001) window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: "instant" });
      };
      element.addEventListener("scrollend", syncSwipe);
      const frame = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
      return () => {
        cancelAnimationFrame(frame);
        element.removeEventListener("scrollend", syncSwipe);
        scroll.current = null;
        container.classList.remove("investment-scroll-driven", "investment-scroll-pinned");
      };
    });
    return () => media.revert();
  }, [count]);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = Array.from(element.children) as HTMLElement[];
        if (element.scrollLeft >= element.scrollWidth - element.clientWidth - 3) { setActive(count - 1); return; }
        const first = cards[0]?.offsetLeft ?? 0;
        let closest = 0;
        cards.forEach((card, i) => {
          if (Math.abs(card.offsetLeft - first - element.scrollLeft) < Math.abs(cards[closest].offsetLeft - first - element.scrollLeft)) closest = i;
        });
        setActive(closest);
      });
    };
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => { element.removeEventListener("scroll", update); observer.disconnect(); cancelAnimationFrame(frame); };
  }, [count]);

  function navigate(index: number) {
    const element = rail.current;
    if (!element) return;
    const target = Math.max(0, Math.min(count - 1, index));
    const card = element.children[target] as HTMLElement;
    const first = element.children[0] as HTMLElement;
    const trigger = scroll.current;
    if (trigger?.vars.pin && window.scrollY >= trigger.start - 2 && window.scrollY <= trigger.end + 2) {
      const distance = element.scrollWidth - element.clientWidth;
      const progress = distance > 0 ? Math.min(1, (card.offsetLeft - first.offsetLeft) / distance) : 0;
      window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: "instant" });
      element.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: "instant" });
      return;
    }
    element.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <section id={section.id} className="investment-highlights" aria-labelledby="investment-highlights-title">
    <header className="shell investment-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="investment-highlights-title">{section.title}</h2><p className="investment-intro">{section.intro}</p></header>
    <div ref={stage} className="investment-scroll-stage">
    <div ref={rail} id="investment-gallery" className="investment-rail" role="region" aria-roledescription="carousel" aria-label="Investment highlights" tabIndex={0} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowRight") { event.preventDefault(); navigate(active + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); navigate(active - 1); }
      if (event.key === "Home") { event.preventDefault(); navigate(0); }
      if (event.key === "End") { event.preventDefault(); navigate(count - 1); }
    }}>
      {section.metrics.map((metric, index) => <article className="investment-card" key={`${metric.label}-${index}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}: ${metric.label}`}>
        <Image src={images[index % images.length]} alt="" fill sizes="(max-width: 760px) 85vw, 460px" />
        <div className="investment-card-shade" />
        <div className="investment-card-content"><h3>{metric.label}</h3><p className={`investment-value ${metric.value.length > 6 ? "investment-value-long" : ""}`}>{metric.value.startsWith("MVR ") ? <><span className="investment-currency">MVR </span>{metric.value.slice(4)}</> : metric.value}</p><div className="investment-card-footer">{metric.note && <p>{metric.note}</p>}<span aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span></div></div>
      </article>)}
    </div>
    <div className="shell investment-controls">
      <div className="investment-dots" aria-label="Choose a highlight">{section.metrics.map((metric, index) => <button type="button" key={index} className={index === active ? "active" : ""} aria-label={`Show highlight ${index + 1}: ${metric.value} ${metric.label}`} aria-current={index === active ? "true" : undefined} aria-controls="investment-gallery" onClick={() => navigate(index)}><span /></button>)}</div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">Highlight {active + 1} of {count}</p>
      <div className="investment-arrows"><button type="button" aria-label="Previous highlight" aria-controls="investment-gallery" disabled={active === 0} onClick={() => navigate(active - 1)}><ChevronLeft aria-hidden="true" /></button><button type="button" aria-label="Next highlight" aria-controls="investment-gallery" disabled={active === count - 1} onClick={() => navigate(active + 1)}><ChevronRight aria-hidden="true" /></button></div>
    </div>
    </div>
  </section>;
}
