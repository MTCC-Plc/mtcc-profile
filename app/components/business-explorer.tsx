"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Image from "./site-image";
import { InfrastructureSection } from "./infrastructure-section";
import { TransportSection } from "./transport-section";
import { ShipbuildingSection } from "./shipbuilding-section";
import { TradingSection } from "./trading-section";
import { DredgingFleet } from "./dredging-fleet";
import type { ProfileSection } from "../types/profile";
import { annualReport2025 } from "../data/annual-report-2025";
import styles from "./business-explorer.module.css";

const businesses = [
  { id: "dredging", title: "Dredging and reclamation", summary: "6 dredgers moving 38,000 m³ a day" },
  { id: "infrastructure", title: "Infrastructure", summary: "Harbours, airports, roads and buildings" },
  { id: "transport-network", title: "Public transport", summary: `${annualReport2025.passengers} passengers in ${annualReport2025.year}` },
  { id: "shipbuilding", title: "Shipbuilding and engineering", summary: "20-vessel boatyard at Thilafushi" },
  { id: "general-trading", title: "General trading", summary: "Marine engines, parts and service" },
] as const;

const legacyTabs: Record<string, number> = {
  dredging: 0,
  "dredging-reclamation": 0,
  "service-details": 0,
  "service-detail-1": 0,
  infrastructure: 1,
  "infra-capabilities": 1,
  "service-detail-2": 1,
  "transport-network": 2,
  "service-detail-3": 2,
  shipbuilding: 3,
  "service-detail-4": 3,
  "general-trading": 4,
  "trading-products": 4,
  "service-detail-5": 4,
};

function DredgingSummary() {
  const capabilities = [
    "Land reclamation", "Shore protection", "Beach replenishment", "Sheet piling",
    "Bathymetric, geotechnical and aerial surveys", "Environmental consultancy",
  ];
  return <>
    <div id="dredging" className={`shell ${styles.dredging}`}>
      <div className={styles.copy}>
        <p className="eyebrow">Dredging and reclamation</p>
        <h3>The largest dredging fleet in the country and the most experienced crews in the field.</h3>
        <p>MTCC started dredging in 1995 with a few excavators and brought the first cutter dredger into reclamation work in 2002, built around the particular demands of working on Maldivian reefs and lagoons.</p>
        <ul className={styles.capabilities} aria-label="Dredging capabilities">{capabilities.map(capability => <li key={capability}>{capability}</li>)}</ul>
      </div>
      <div className={styles.capacity}>
        <div className={styles.image}>
          <Image src="/assets/business-tab-hero.webp" alt="MTCC dredging and land reclamation works in the Maldives" fill sizes="(max-width: 800px) 100vw, 50vw" />
          <span>Shaping the islands of tomorrow.</span>
        </div>
      </div>
    </div>
    {/* The vessels are stated here rather than in the fleet section, which
        covers the plant register, so the figures appear once on the page. */}
    <div className={`shell ${styles.dredgingFleet}`}><DredgingFleet /></div>
  </>;
}

/** Keep detailed business components available, mounting only the selected business. */
export function BusinessExplorer({ sections }: { sections: ProfileSection[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const followHash = (hash: string) => {
      let id: string;
      try { id = decodeURIComponent(hash.replace(/^#/, "")); } catch { return; }
      const index = legacyTabs[id];
      if (index === undefined) return;
      setActive(index);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const target = document.getElementById(id) ?? panel.current;
        target?.scrollIntoView({ behavior: "instant", block: "start" });
        if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
      });
    };
    const onHashChange = () => followHash(window.location.hash);
    const onLink = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search) return;
      let id: string;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
      if (legacyTabs[id] === undefined) return;
      event.preventDefault();
      if (window.location.hash !== url.hash) window.history.pushState(null, "", url.hash);
      followHash(url.hash);
    };
    frame = requestAnimationFrame(onHashChange);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    document.addEventListener("click", onLink, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
      document.removeEventListener("click", onLink, true);
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [active]);

  function select(index: number, focus = false) {
    setActive(index);
    const tab = tabs.current[index];
    if (focus) tab?.focus({ preventScroll: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % businesses.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + businesses.length) % businesses.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = businesses.length - 1;
    else return;
    event.preventDefault();
    select(next, true);
  }

  const business = businesses[active];
  const section = sections.find((item): item is Extract<ProfileSection, { type: "content" }> => item.id === business.id && item.type === "content");

  function detail() {
    if (active === 0) return <DredgingSummary />;
    if (!section) return <div className={`shell ${styles.fallback}`}><h3>{business.title}</h3><p>{business.summary}</p></div>;
    if (active === 1) return <InfrastructureSection section={section} />;
    if (active === 2) return <TransportSection section={section} />;
    if (active === 3) return <ShipbuildingSection section={section} />;
    return <TradingSection section={section} />;
  }

  return <section id="portfolio" className={styles.explorer} aria-labelledby="businesses-title">
    <div className={`shell ${styles.overview}`}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Our businesses</p>
        <h2 id="businesses-title">Our businesses, <span>one national platform.</span></h2>
        <p className={styles.intro}>{annualReport2025.businessAreas}. Explore the services delivered across MTCC.</p>
      </header>
      <div className={styles.platform}>
        <div className={styles.platformName}><strong>MTCC</strong><span>Maldives Transport and Contracting Company</span></div>
        <div id="services" className={styles.platformTabs} role="tablist" aria-label="MTCC businesses" aria-orientation="horizontal">
          {businesses.map((item, index) => <button key={item.id} ref={element => { tabs.current[index] = element; }} id={`business-tab-${item.id}`} type="button" role="tab" aria-selected={active === index} aria-controls="business-panel" tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => onKeyDown(event, index)}>
            <span className={styles.number} aria-hidden="true">0{index + 1}</span>
            <span className={styles.platformCopy}><strong>{item.title}</strong><span>{item.summary}</span></span>
            <ArrowUpRight size={19} aria-hidden="true" />
          </button>)}
        </div>
      </div>
    </div>
    <div ref={panel} id="business-panel" className={styles.panel} role="tabpanel" aria-labelledby={`business-tab-${business.id}`} tabIndex={0}>{detail()}</div>
  </section>;
}
