import { BusinessDetails } from "./business-details";
import Image from "./site-image";
import { ArrowDown, CarFront } from "lucide-react";
import { TransportFleet } from "./transport-fleet";
import type { ProfileSection } from "../types/profile";

export function TransportSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  return <section id={section.id} className="transport-section" aria-labelledby="transport-title">
    <header className="transport-opening">
      <div className="shell transport-opening-copy"><p className="eyebrow">{section.eyebrow}</p><h2 id="transport-title">{section.title}<span>.</span></h2><p>A nation in motion.</p></div>
      <div className="shell"><div className="transport-opening-scene"><div className="transport-hero-image" aria-hidden="true"><Image src="/assets/business-tab-hero.c37d035b.webp" alt="" fill sizes="(max-width: 760px) 100vw, 1200px" /></div><div className="transport-hero-shade" /><div className="transport-opening-caption"><span>Across the sea.<br />Along the road.</span><a href="#transport-fleet">Explore the network <ArrowDown size={18} aria-hidden="true" /></a></div></div></div>
    </header>
    <div className="shell transport-content">
      {section.blocks.map((block, index) => {
        if (block.type === "text") return <article className={`transport-story ${block.title === "Innovation" ? "transport-innovation" : ""}`} key={index}>
          <h3>{block.title}</h3>
          {block.items && <ul>{block.items.map((text, i) => <li key={text}><span className="transport-story-number" aria-hidden="true">0{i + 1}</span><p>{text}</p></li>)}</ul>}
          {block.paragraphs?.map(text => <p key={text}>{text}</p>)}
          {block.title === "Innovation" && <CarFront className="transport-innovation-icon" aria-hidden="true" strokeWidth={1} />}
        </article>;
        if (block.type === "metrics") return <article className="transport-network-stat" key={index}>
          <h3>{block.title}</h3><dl>{block.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd data-count={metric.value}>{metric.value}</dd>{metric.note && <p>{metric.note}</p>}</div>)}</dl>
        </article>;
        if (block.type === "table") return <TransportFleet key={index} block={block} />;
        if (block.type === "bars") return <article className="transport-passengers" key={index}>
          <div className="transport-block-heading"><p className="eyebrow">Every journey counts</p><h3>{block.title}</h3></div>
          {block.note && <div className="transport-total-feature"><span>Combined annual average</span><strong>{block.note.match(/[\d,]+/)?.[0]}</strong></div>}
          <dl className="transport-passenger-grid">{block.items.map(item => <div key={item.label}><dt>{item.label}</dt><dd data-count={item.display ?? item.value.toLocaleString("en-US")}>{item.display ?? item.value.toLocaleString("en-US")}</dd><div className="bar-track" aria-hidden="true"><span style={{ width: `${item.value / Math.max(...block.items.map(entry => entry.value)) * 100}%` }} /></div></div>)}</dl>
          {block.note && <p className="transport-passenger-total">{block.note}</p>}
        </article>;
        return null;
      })}
      <BusinessDetails services={section.serviceDetails} />
    </div>
  </section>;
}
