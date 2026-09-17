import Image from "./site-image";
import { TrendingUp, HardHat, Globe, Route, Cpu, Package } from "lucide-react";
import type { ProfileSection } from "../types/profile";

const treatments = [
  { Icon: TrendingUp, kind: "growth", target: "28%", label: "GP margin target" },
  { Icon: HardHat, kind: "delivery", target: "12", label: "Projects per quarter · target" },
  { Icon: Globe, kind: "tourism", image: "/assets/corporate-hero.webp" },
  { Icon: Route, kind: "logistics", image: "/assets/bridge.webp" },
  { Icon: Cpu, kind: "digital" },
  { Icon: Package, kind: "trading" },
];

export function GrowthStrategy({ section }: { section: Extract<ProfileSection, { type: "strategy" }> }) {
  return <section id={section.id} className="growth-section" aria-labelledby="growth-title"><div className="shell">
    <header className="growth-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="growth-title">A focused roadmap for <span>sustainable expansion.</span></h2><div className="growth-intro"><p>Six priorities.<br />The next chapter of MTCC.</p><span aria-hidden="true">01—06</span></div></header>
    <div className="growth-grid">{section.pillars.map((pillar,index) => {const design=treatments[index % treatments.length];const Icon=design.Icon;return <article key={pillar.title} className={`growth-card growth-${design.kind}`}>
      {design.image && <div className="growth-card-image"><Image src={design.image} alt="" fill sizes="(max-width: 760px) 100vw, 650px" /></div>}
      <div className="growth-card-top"><span>Priority {String(index+1).padStart(2,"0")}</span><Icon size={30} strokeWidth={1.3} aria-hidden="true" /></div>
      {design.target && <div className="growth-target" aria-hidden="true"><strong>{design.target}</strong><span>{design.label}</span></div>}
      <div className="growth-card-copy"><h3>{pillar.title}</h3><ul>{pillar.items.map(item => <li key={item}>{item}</li>)}</ul></div>
    </article>;})}</div>
  </div></section>;
}
