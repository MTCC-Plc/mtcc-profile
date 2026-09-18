import { CurrencyText } from "./currency-symbol";
import { MoneyValue } from "./money-value";
import Image from "./site-image";
import { CarFront, BusFront, Waves, HeartHandshake, Droplets, Zap } from "lucide-react";
import type { ProfileSection } from "../types/profile";

const initiatives = [
  { title: "Electric mobility.", Icon: CarFront, kind: "electric" },
  { title: "A new way forward.", Icon: BusFront, kind: "electric" },
  { title: "Space to swim.", Icon: Waves, kind: "water" },
  { title: "Access for all.", Icon: HeartHandshake, kind: "access" },
  { title: "Shared places.", Icon: Droplets, kind: "places" },
];

export function SustainabilitySection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  return <section id={section.id} className="esg-section" aria-labelledby="esg-title"><div className="shell">
    <header className="esg-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="esg-title">Sustainability <span>(ESG).</span></h2><p>For our islands.<br /><span>For our communities.</span></p></header>
    {section.blocks.filter(block => block.type === "metrics").map((block,index) => <article className="esg-investment" key={index}><div className="esg-investment-copy"><h3>{block.title}</h3><dl>{block.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd><MoneyValue value={metric.value} /></dd>{metric.note && <p className="esg-year"><CurrencyText value={metric.note ?? ""} /></p>}</div>)}</dl></div><div className="esg-landscape"><Image src="/assets/corporate-hero.webp" alt="Aerial view of the Maldivian coastline and surrounding ocean" fill sizes="(max-width: 760px) 100vw, 650px" /><span>The Maldives</span></div></article>)}
    {section.blocks.filter(block => block.type === "text").map((block,index) => <div className="esg-commitments" key={index}><div className="esg-block-heading"><p className="eyebrow">Commitment in action</p><h3>{block.title}</h3>{block.paragraphs?.map(text => <p key={text}>{text}</p>)}</div><div className="esg-initiative-grid">{block.items?.map((text,i) => {const {title,Icon,kind}=initiatives[i % initiatives.length];return <article className={`esg-initiative esg-${kind}`} key={text}><div className="esg-initiative-top"><span>0{i+1}</span>{kind === "electric" && <span className="esg-electric-label"><Zap size={14} aria-hidden="true" />Electric</span>}</div><div className="esg-initiative-symbol" aria-hidden="true"><Icon strokeWidth={1.1} />{kind === "water" && <strong>{text.match(/\d+/)?.[0]}<span>metres</span></strong>}</div><div className="esg-initiative-copy"><h4>{title}</h4><p>{text}</p></div></article>;})}</div></div>)}
  </div></section>;
}
