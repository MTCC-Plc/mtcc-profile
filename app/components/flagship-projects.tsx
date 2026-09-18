"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProfileSection } from "../types/profile";

import { FlagshipProjectCard } from "./flagship-project-card";

const filters = ["All projects", "Airports", "Reclamation", "Roads"] as const;
type Filter = typeof filters[number];
function category(name: string): Filter {
  if (/airport/i.test(name)) return "Airports";
  if (/reclamation/i.test(name)) return "Reclamation";
  return "Roads";
}

export function FlagshipProjects({ section }: { section: Extract<ProfileSection, { type: "projects" }> }) {
  const [filter, setFilter] = useState<Filter>("All projects");
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const scroll = useRef<ScrollTrigger | null>(null);
  const manualSelection = useRef(false);
  const resetPinnedPosition = useRef(false);
  const projects = section.projects.map((project, index) => ({ ...project, index, category: category(project.name) }));
  const visible = projects.filter(project => filter === "All projects" || project.category === filter);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = rail.current;
    if (!element) return;
    element.scrollTo({left: 0, behavior: "instant"});
    setActive(0);
    const update = () => {
      const cards = Array.from(element.children) as HTMLElement[];
      const origin = cards[0]?.offsetLeft ?? 0;
      let closest = 0;
      cards.forEach((card, i) => {
        if (Math.abs(card.offsetLeft - origin - element.scrollLeft) < Math.abs(cards[closest].offsetLeft - origin - element.scrollLeft)) closest = i;
      });
      setActive(closest);
    };
    element.addEventListener("scroll", update, {passive: true});
    const observer = new ResizeObserver(update);
    observer.observe(element);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1000px) and (min-height: 700px)", mobile: "(max-width: 999px) and (min-height: 740px)" }, context => {
      const container = stage.current;
      if (!context.conditions?.motion || !container) return;
      const desktop = Boolean(context.conditions.desktop);
      const pinned = Boolean(desktop || context.conditions.mobile);
      if (!pinned) return;
      manualSelection.current = resetPinnedPosition.current;
      let userScrolled = false;
      const holdSelection = () => {
        userScrolled = true;
        if (!desktop) gsap.killTweensOf(element, "scrollLeft");
      };
      container.classList.add("flagship-scroll-driven");
      container.classList.toggle("flagship-scroll-pinned", desktop);
      container.classList.toggle("flagship-scroll-mobile", !desktop);
      if (container.offsetHeight > window.innerHeight - 96) {
        container.classList.remove("flagship-scroll-mobile", "flagship-scroll-pinned", "flagship-scroll-driven");
        return;
      }
      element.addEventListener("pointerdown", holdSelection);
      element.addEventListener("wheel", holdSelection, { passive: true });
      const chapterHeight = window.innerHeight;
      const drive = (progress: number) => {
        userScrolled = false;
        const distance = element.scrollWidth - element.clientWidth;
        if (desktop) element.scrollTo({ left: progress * distance, behavior: "instant" });
        else gsap.to(element, { scrollLeft: progress * distance, duration: .35, ease: "power2.out", overwrite: "auto" });
      };
      const trigger = ScrollTrigger.create({
        trigger: container, start: pinned ? "top 80px" : "top 35%",
        end: pinned ? () => `+=${(desktop ? window.innerHeight : chapterHeight) * (element.children.length - 1) * (desktop ? .65 : .95)}` : "bottom 65%",
        pin: pinned, invalidateOnRefresh: true,
        onUpdate: self => { if (self.isActive && !manualSelection.current) drive(self.progress); },
        onLeave: () => { if (!manualSelection.current) drive(1); manualSelection.current = false; }, onLeaveBack: () => { if (!manualSelection.current) drive(0); manualSelection.current = false; },
      });
      scroll.current = trigger;
      const syncSwipe = () => {
        if (!userScrolled || manualSelection.current || window.scrollY < trigger.start - 2 || window.scrollY > trigger.end + 2) return;
        userScrolled = false;
        const distance = element.scrollWidth - element.clientWidth;
        if (distance <= 0) return;
        const progress = element.scrollLeft / distance;
        if (Math.abs(progress - trigger.progress) > .001) window.scrollTo({top: trigger.start + progress * (trigger.end - trigger.start), behavior: "instant"});
      };
      element.addEventListener("scrollend", syncSwipe);
      return () => {
        element.removeEventListener("scrollend", syncSwipe); scroll.current = null;
        gsap.killTweensOf(element, "scrollLeft");
        element.removeEventListener("pointerdown", holdSelection);
        element.removeEventListener("wheel", holdSelection);
        container.classList.remove("flagship-scroll-driven", "flagship-scroll-pinned", "flagship-scroll-mobile");
      };
    });
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      const trigger = scroll.current;
      if (resetPinnedPosition.current && trigger?.vars.pin) {
        gsap.killTweensOf(element, "scrollLeft");
        window.scrollTo({ top: trigger.start, behavior: "instant" });
        element.scrollTo({ left: 0, behavior: "instant" });
        setActive(0);
      }
      resetPinnedPosition.current = false;
      manualSelection.current = false;
    });
    return () => { cancelAnimationFrame(frame); media.revert(); element.removeEventListener("scroll", update); observer.disconnect(); };
  }, [filter]);

  function changeFilter(next: Filter) {
    if (next === filter) return;
    const trigger = scroll.current;
    resetPinnedPosition.current = Boolean(trigger?.vars.pin && window.scrollY >= trigger.start - 2 && window.scrollY <= trigger.end + 2);
    manualSelection.current = true;
    if (rail.current) gsap.killTweensOf(rail.current, "scrollLeft");
    if (resetPinnedPosition.current && trigger) window.scrollTo({top: trigger.start, behavior: "instant"});
    setActive(0);
    setFilter(next);
  }
  function navigate(index: number) {
    const element = rail.current;
    if (!element) return;
    const target = Math.max(0, Math.min(visible.length - 1, index));
    const first = element.children[0] as HTMLElement;
    const card = element.children[target] as HTMLElement;
    const left = card.offsetLeft - first.offsetLeft;
    const trigger = scroll.current;
    if (trigger && !trigger.vars.pin) { manualSelection.current = true; gsap.killTweensOf(element, "scrollLeft"); }
    if (trigger?.vars.pin && window.scrollY >= trigger.start - 2 && window.scrollY <= trigger.end + 2) {
      const distance = element.scrollWidth - element.clientWidth;
      window.scrollTo({top: trigger.start + Math.min(1, left / distance) * (trigger.end - trigger.start), behavior: "instant"});
      element.scrollTo({left, behavior: "instant"});
    } else element.scrollTo({left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
  }

  return <section id={section.id} className="flagship-section" aria-labelledby="flagship-title">
    <div className="shell">
      <header className="flagship-heading"><div><p className="eyebrow">Built across the Maldives</p><h2 id="flagship-title">{section.title}<span>.</span></h2></div><div className="flagship-edition"><strong>{String(projects.length).padStart(2, "0")}</strong><span>Signature projects</span></div></header>
      <div ref={stage} className="flagship-scroll-stage">
      <div className="flagship-toolbar"><div className="flagship-filters" role="group" aria-label="Filter flagship projects">{filters.map(item => <button key={item} type="button" aria-pressed={filter === item} aria-controls="flagship-grid" onClick={() => changeFilter(item)}>{item}<span aria-hidden="true">{item === "All projects" ? projects.length : projects.filter(project => project.category === item).length}</span></button>)}</div><p>Values in millions, excluding GST</p></div>
      <p className="sr-only" role="status">Showing {visible.length} {filter === "All projects" ? "flagship projects" : filter.toLowerCase() + " projects"}</p>
      <div ref={rail} id="flagship-grid" className="flagship-grid flagship-rail" role="region" aria-roledescription="carousel" aria-label="Flagship projects" tabIndex={0} onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        const next = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : event.key === "ArrowRight" ? active + 1 : event.key === "ArrowLeft" ? active - 1 : null;
        if (next !== null) { event.preventDefault(); navigate(next); }
      }}>{visible.map((project, index) => <FlagshipProjectCard key={project.name} project={project} index={index} total={visible.length} active={active === index} />)}</div>
      <div className="flagship-gallery-controls"><p aria-live="polite" aria-atomic="true">Project {active + 1} of {visible.length}</p><div><button type="button" aria-label="Previous flagship project" aria-controls="flagship-grid" disabled={active === 0} onClick={() => navigate(active - 1)}><ChevronLeft aria-hidden="true" /></button><button type="button" aria-label="Next flagship project" aria-controls="flagship-grid" disabled={active === visible.length - 1} onClick={() => navigate(active + 1)}><ChevronRight aria-hidden="true" /></button></div></div>
      </div>
    </div>
  </section>;
}
