"use client";
import Image from "./site-image";
import { BusFront, CarFront, Ship, Waves } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import type { ContentBlock } from "../types/profile";

export function TransportFleet({ block }: { block: Extract<ContentBlock, { type: "table" }> }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLElement>(null);
  const scroll = useRef<ScrollTrigger | null>(null);
  const manualSelection = useRef(false);
  const previousTab = useRef(0);
  useLayoutEffect(() => {
    const previous = previousTab.current;
    previousTab.current = active;
    if (previous === active || !root.current) return;
    const incoming = root.current.querySelector<HTMLElement>(`#fleet-panel-${active}`);
    const outgoing = root.current.querySelector<HTMLElement>(`#fleet-panel-${previous}`);
    if (!incoming || !outgoing) return;
    const direction = active > previous ? 1 : -1;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const transition = gsap.timeline({ defaults: { duration: .55, ease: "power3.inOut" } });
      transition.set(outgoing, { visibility: "visible", zIndex: 1 })
        .set(incoming, { zIndex: 2 })
        .fromTo(outgoing, { xPercent: 0, opacity: 1 }, { xPercent: -100 * direction, opacity: .7 }, 0)
        .fromTo(incoming, { xPercent: 100 * direction, opacity: .85 }, { xPercent: 0, opacity: 1 }, 0)
        .set(outgoing, { visibility: "hidden" });
    });
    return () => media.revert();
  }, [active]);
  const icons = [Ship, BusFront, Waves, CarFront];
  const images = ["/assets/transport.webp", "/assets/bridge.webp", "/assets/conventional-ferry.webp", "/assets/male-taxi-fleet.webp"];
  const imageDescriptions = ["RTL ferry travelling across the sea", "RTL buses travelling on a bridge", "Boarding an MTCC conventional ferry", "Malé Taxi Line electric vehicles displayed at the fleet launch"];
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1000px) and (min-height: 700px)", mobile: "(max-width: 999px) and (min-height: 740px)" }, context => {
      if (!context.conditions?.motion || !root.current) return;
      const desktop = Boolean(context.conditions.desktop);
      const pinned = Boolean(desktop || context.conditions.mobile);
      if (!pinned) return;
      root.current.classList.toggle("fleet-scroll-pinned", desktop);
      root.current.classList.toggle("fleet-scroll-mobile", !desktop);
      if (!desktop && root.current.offsetHeight > window.innerHeight - 96) {
        root.current.classList.remove("fleet-scroll-mobile", "fleet-scroll-driven");
        return;
      }
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: pinned ? "top 64px" : "top 35%",
        end: pinned ? () => `+=${window.innerHeight * block.rows.length * (desktop ? .65 : .95)}` : "bottom 65%",
        pin: pinned,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (self.isActive && !manualSelection.current) setActive(Math.min(block.rows.length - 1, Math.floor(self.progress * block.rows.length)));
        },
        onLeave: () => { manualSelection.current = false; setActive(block.rows.length - 1); },
        onLeaveBack: () => { manualSelection.current = false; setActive(0); },
      });
      scroll.current = trigger;
      const frame = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
      return () => { cancelAnimationFrame(frame); scroll.current = null; root.current?.classList.remove("fleet-scroll-pinned", "fleet-scroll-mobile"); };
    });
    return () => media.revert();
  }, [block.rows.length]);
  function select(index: number) {
    const trigger = scroll.current;
    manualSelection.current = Boolean(trigger && !trigger.vars.pin);
    if (trigger?.isActive && trigger.vars.pin) {
      // Keep the scroll chapter aligned with manual selection, so it does not snap back.
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * (index + .5) / block.rows.length, behavior: "instant" });
    }
    setActive(index);
  }
  function key(event: KeyboardEvent, index: number) {
    const next = event.key === "Home" ? 0 : event.key === "End" ? block.rows.length - 1 : event.key === "ArrowRight" ? (index + 1) % block.rows.length : event.key === "ArrowLeft" ? (index + block.rows.length - 1) % block.rows.length : null;
    if (next === null) return;
    event.preventDefault(); select(next); tabs.current[next]?.focus({ preventScroll: true });
  }
  return <article ref={root} id="transport-fleet" className="transport-fleet">
    <div className="transport-block-heading"><p className="eyebrow">Find your way forward</p><h3>{block.title}</h3></div>
    <div className="fleet-mode-tabs" role="tablist" aria-label="Transport services">{block.rows.map((row, index) => {const Icon=icons[index];return <button type="button" key={row[0]} ref={el=>{tabs.current[index]=el;}} id={`fleet-tab-${index}`} role="tab" aria-selected={active===index} aria-controls={`fleet-panel-${index}`} tabIndex={active===index?0:-1} onClick={()=>select(index)} onKeyDown={event=>key(event,index)}><Icon size={20} aria-hidden="true" />{row[0]}</button>;})}</div>
    <div className="fleet-panels">{block.rows.map((row,index)=>{return <div key={row[0]} className={`fleet-showcase fleet-mode-${index}`} role="tabpanel" id={`fleet-panel-${index}`} aria-labelledby={`fleet-tab-${index}`} hidden={active!==index} aria-hidden={active!==index} inert={active!==index} tabIndex={0}>
      <div className="fleet-showcase-visual"><Image src={images[index]} alt={imageDescriptions[index]} fill loading="eager" fetchPriority="low" sizes="(max-width: 760px) 100vw, 750px" /><span className="fleet-visual-number" aria-hidden="true">0{index+1} / 04</span></div>
      <div className="fleet-showcase-copy"><p className="eyebrow">{index===0||index===2?"By sea":"By land"}</p><h4>{row[0]}</h4><dl>{row.slice(1).map((cell,column)=>{const parts=cell.match(/^(\d+)\s+(.+)$/);return <div key={column}><dt>{block.columns[column+1]}</dt><dd>{parts?<><strong>{parts[1]}</strong>{" "}<span>{parts[2]}</span></>:cell}</dd></div>;})}</dl></div>
    </div>;})}</div>
    {block.note&&<p>{block.note}</p>}
  </article>;
}
