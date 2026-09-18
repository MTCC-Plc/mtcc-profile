import { CurrencyText } from "./currency-symbol";
import Image from "./site-image";
import { Anchor, ScanLine, Plane, ArrowDownRight } from "lucide-react";
import type { ProfileSection } from "../types/profile";

const capabilities = [
  { title: "Shape the shoreline.", Icon: Anchor },
  { title: "Precision from the start.", Icon: ScanLine },
  { title: "Open new horizons.", Icon: Plane },
];

export function InfrastructureSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  const fleet = section.blocks.find(block => block.type === "metrics" && block.title === "Fleet capacity");
  const projects = section.blocks.find(block => block.type === "metrics" && block.title === "Project statistics");
  return <section id={section.id} className="infra-section" aria-labelledby="infra-title"><div className="shell">
    <header className="infra-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="infra-title">Infrastructure &amp;<br /><span>marine construction.</span></h2></header>
    {fleet?.type === "metrics" && <div className="infra-fleet">
      <div className="infra-landscape"><Image src="/assets/dredging.webp" alt="Dredging and reclamation works in the Maldives" fill sizes="(max-width: 760px) 100vw, 1200px" /><div className="infra-image-shade" />
        <div className="infra-capacity"><h3>{fleet.title}</h3><dl>{fleet.metrics.slice(0, 1).map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd><CurrencyText value={metric.value} /></dd><span><CurrencyText value={metric.note ?? ""} /></span></div>)}</dl></div>
        <a href="#infra-capabilities" className="infra-explore">Explore our capabilities <ArrowDownRight size={20} aria-hidden="true" /></a>
      </div>
      <dl className="infra-vessels">{fleet.metrics.slice(1).map(metric => <div key={metric.label}><dd><CurrencyText value={metric.value} /></dd><dt>{metric.label}<span><CurrencyText value={metric.note ?? ""} /></span></dt></div>)}</dl>
    </div>}
    {section.blocks.filter(block => block.type === "text").map((block, index) => block.title === "Capabilities" ? <div id="infra-capabilities" className="infra-capabilities" key={index}>
      <div className="infra-block-heading"><p className="eyebrow">From the seabed to the runway</p><h3>{block.title}</h3></div>
      <div className="infra-capability-grid">{block.items?.map((item, i) => {const {title, Icon} = capabilities[i % capabilities.length]; return <article key={item}><Icon size={38} strokeWidth={1.3} aria-hidden="true" /><h4>{title}</h4><p>{item}</p></article>;})}</div>
      {block.paragraphs?.map(text => <p key={text}>{text}</p>)}
    </div> : <article className="infra-firsts" key={index}><div><p className="eyebrow">{block.title}</p><h3>Experience that<br />moves us forward.</h3></div><div>{block.items?.map((item, i) => <p key={item}><span aria-hidden="true">0{i + 1}</span>{item}</p>)}{block.paragraphs?.map(text => <p key={text}>{text}</p>)}</div></article>)}
    {projects?.type === "metrics" && <div className="infra-projects"><div className="infra-block-heading"><p className="eyebrow">Delivery at scale</p><h3>{projects.title}</h3></div><dl>{projects.metrics.map((metric, i) => <div key={`${metric.label}-${i}`}><dt>{metric.label}</dt><dd><CurrencyText value={metric.value} /></dd>{metric.note && <p><CurrencyText value={metric.note ?? ""} /></p>}</div>)}</dl><a href="#project-breakdown">Explore the project portfolio <ArrowDownRight size={20} aria-hidden="true" /></a></div>}
  </div></section>;
}
