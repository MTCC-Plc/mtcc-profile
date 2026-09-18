import { BusinessDetails } from "./business-details";
import { CurrencyText } from "./currency-symbol";
import Image from "./site-image";
import { Cylinder, Wrench, Anchor } from "lucide-react";
import type { ProfileSection } from "../types/profile";

export function TradingSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  const services = [Cylinder, Wrench, Anchor];
  return <section id={section.id} className="trading-section" aria-labelledby="trading-title">
    <div className="shell">
      <header className="trading-intro"><div><p className="eyebrow">{section.eyebrow}</p><h2 id="trading-title">{section.title}<span>.</span></h2></div><div className="trading-product-image"><Image src="/assets/shipbuilding.webp" alt="Marine outboard engines" fill sizes="(max-width: 760px) 100vw, 650px" /></div></header>
      {section.blocks.filter(block => block.type === "text").map((block, index) => <article className="trading-story" key={index}>
        <h3>{block.title}</h3><div>{block.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        {block.items && <ul className="trading-services">{block.items.map((item, i) => {const Icon=services[i % services.length];return <li key={item}><Icon size={32} strokeWidth={1.3} aria-hidden="true" /><span>{item}</span></li>;})}</ul>}
      </article>)}
      {section.blocks.filter(block => block.type === "brands").map((block, index) => <article className="trading-brands" key={index}>
        <div className="trading-block-heading"><p className="eyebrow">Trusted names. Essential products.</p><h3>{block.title}</h3></div>
        <div className="trading-brand-grid">{block.items.map(brand => <article key={brand.name}>{brand.image && <div className="trading-brand-mark"><Image src={brand.image} alt={brand.name} width={250} height={110} /></div>}<h4>{brand.name}</h4><p>{brand.product}</p></article>)}</div>
      </article>)}
      {section.blocks.filter(block => block.type === "table").map((block,index) => <article className="trading-revenue" key={index}>
        <div className="trading-block-heading"><p className="eyebrow">Financial performance</p><h3>{block.title}</h3></div>
        <div className="trading-revenue-table" role="region" aria-label={block.title} tabIndex={0}><table><caption className="sr-only">{block.title}</caption><thead><tr>{block.columns.map(column=><th key={column} scope="col"><CurrencyText value={column} /></th>)}</tr></thead><tbody>{block.rows.map(row=><tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((value,i)=><td key={i}><span className="trading-revenue-value">{value}</span><div className="bar-track" aria-hidden="true"><span style={{width:`${Number(value) / Math.max(...block.rows.map(entry=>Number(entry[i+1]))) * 100}%`}} /></div></td>)}</tr>)}</tbody></table></div>
        {block.note&&<p>{block.note}</p>}
      </article>)}
      <BusinessDetails services={section.serviceDetails} />
    </div>
  </section>;
}
