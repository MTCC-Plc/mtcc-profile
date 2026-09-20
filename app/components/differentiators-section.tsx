import Image from "./site-image";
import { ArrowUpRight, Check, Ship, BusFront, Package } from "lucide-react";
import type { ProfileSection } from "../types/profile";

const treatments = [
  { name: "heritage", title: "A lasting presence.", image: "/assets/corporate-hero.webp" },
  { name: "fleet", title: "Equipped for scale.", image: "/assets/dredging.b509c471.webp" },
  { name: "quality", title: "Certified quality." },
  { name: "network", title: "One connected network.", image: "/assets/bridge.webp" },
  { name: "diversity", title: "Strength in diversity." },
];

export function DifferentiatorsSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  return <section id={section.id} className="difference-section" aria-labelledby="difference-title"><div className="shell">
    <header className="difference-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="difference-title">{section.title}<span>.</span></h2></header>
    {section.blocks.filter(block=>block.type==='text').map((block,blockIndex)=><div key={blockIndex}>
      <h3 className="difference-subtitle">{block.title}</h3>
      {block.paragraphs?.map(text=><p key={text}>{text}</p>)}
      <div className="difference-grid">{block.items?.map((text,index)=>{const design=treatments[index % treatments.length];return <article className={`difference-card difference-${design.name}`} key={text}>
        {design.image&&<><div className="difference-image"><Image src={design.image} alt="" fill sizes="(max-width: 760px) 100vw, 750px" /></div><div className="difference-shade" /></>}
        <div className="difference-card-top"><span>0{index+1}</span><ArrowUpRight size={22} aria-hidden="true" /></div>
        {design.name==='heritage'&&<strong className="difference-year" aria-hidden="true">{text.match(/\b\d{4}\b/)?.[0]}</strong>}
        {design.name==='quality'&&<div className="difference-certification" aria-hidden="true"><Check strokeWidth={1.4} /><span>ISO</span><strong>{text.match(/\d{4}:\d{4}/)?.[0]}</strong></div>}
        {design.name==='network'&&<div className="difference-modes" aria-hidden="true"><Ship strokeWidth={1.3}/><span>+</span><BusFront strokeWidth={1.3}/></div>}
        {design.name==='diversity'&&<div className="difference-revenue-streams" aria-hidden="true"><span><Package strokeWidth={1.3}/>Trading</span><i>+</i><span><Ship strokeWidth={1.3}/>Transport</span></div>}
        <div className="difference-copy"><h4>{design.title}</h4><p>{text}</p></div>
      </article>;})}</div>
    </div>)}
  </div></section>;
}
