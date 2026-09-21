import { BusinessDetails } from "./business-details";
import Image from "./site-image";
import { ArrowDownRight, Anchor, Zap, Flame, Cog, Wrench, Layers, Ship, GraduationCap, Factory } from "lucide-react";
import type { ProfileSection } from "../types/profile";

const serviceIcons = [Anchor, Zap, Flame, Cog, Wrench, Layers];
const achievementIcons = [Ship, GraduationCap, Factory];

export function ShipbuildingSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  const services = section.blocks.find(block => block.type === "text" && block.title === "Services");
  const capabilities = section.blocks.find(block => block.type === "text" && block.title === "Capabilities");
  const achievements = section.blocks.filter(block => block.type === "text").filter(block => block.title !== "Services" && block.title !== "Capabilities");
  return <section id={section.id} className="marine-section" aria-labelledby="marine-title">
    <div className="shell">
      <header className="marine-opening"><div className="marine-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="marine-title">Shipbuilding &amp;<br /><span>engineering.</span></h2><p className="marine-tagline">Craft. Precision.<br />Capability.</p><a href="#marine-services">Explore our services <ArrowDownRight size={18} aria-hidden="true" /></a></div><div className="marine-hero-image"><Image src="/assets/business-hero-3.webp" alt="Vessels on the hardstand at an MTCC shipyard, one lifted by a travel hoist" fill sizes="(max-width: 760px) 100vw, 650px" /><span>Expertise at work.</span></div></header>
      {capabilities?.type === "text" && <div className="marine-capabilities"><div className="marine-block-heading"><p className="eyebrow">Equipped to handle more</p><h3>{capabilities.title}</h3></div><div className="marine-capacity-layout"><dl className="marine-capacity-stats"><div><dt>Boat hoist</dt><dd>200<span>tonnes</span></dd></div><div><dt>Slipway</dt><dd>200<span>metres</span></dd></div></dl><div className="marine-capacity-copy">{capabilities.paragraphs?.map(text => <p key={text}>{text}</p>)}{capabilities.items?.map(text => <p key={text}>{text}</p>)}</div></div></div>}
      {services?.type === "text" && <div id="marine-services" className="marine-services"><div className="marine-block-heading"><p className="eyebrow">Specialist skills. One facility.</p><h3>{services.title}</h3></div><div className="marine-service-grid">{services.items?.map((item,index) => {const Icon=serviceIcons[index % serviceIcons.length];return <article key={item}><div><Icon size={34} strokeWidth={1.3} aria-hidden="true" /><span aria-hidden="true">0{index + 1}</span></div><h4>{item}</h4></article>;})}</div>{services.paragraphs?.map(text => <p key={text}>{text}</p>)}</div>}
      <div className="marine-achievements">{achievements.map((block,index) => {const Icon=achievementIcons[index % achievementIcons.length];return <article key={index}><Icon size={32} strokeWidth={1.4} aria-hidden="true" /><h3>{block.title}</h3>{block.paragraphs?.map(text => <p key={text}>{text}</p>)}{block.items?.map(text => <p key={text}>{text}</p>)}</article>;})}</div>
      <BusinessDetails services={section.serviceDetails} />
    </div>
    {section.blocks.filter(block => block.type === "bars").map(block => <div className="marine-customers" key={block.title}><div className="shell"><div className="marine-customers-heading"><div className="marine-block-heading"><p className="eyebrow">Supporting the marine economy</p><h3>{block.title}</h3></div><p>From cargo vessels to the boats that connect our islands.</p></div><dl className="marine-segment-grid">{block.items.map((item,index) => <div key={item.label}><div className="marine-segment-label"><dt><span aria-hidden="true">{String(index + 1).padStart(2,"0")}</span>{item.label}</dt><dd>{item.display ?? `${item.value}%`}</dd></div><div className="bar-track" aria-hidden="true"><span style={{width:`${item.value}%`}} /></div></div>)}</dl>{block.note && <p>{block.note}</p>}</div></div>)}
  </section>;
}
