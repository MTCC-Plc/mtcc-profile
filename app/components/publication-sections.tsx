import { SectionLink } from "./section-link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { CurrencyText } from "./currency-symbol";
import { isMoney } from "../../lib/currency";
import Image from "./site-image";
import { TransportSection } from "./transport-section";
import { ProjectBreakdown } from "./project-breakdown";
import { TradingSection } from "./trading-section";
import { DifferentiatorsSection } from "./differentiators-section";
import { InfrastructureSection } from "./infrastructure-section";
import { ShipbuildingSection } from "./shipbuilding-section";
import { SustainabilitySection } from "./sustainability-section";
import { PartnershipSection } from "./partnership-section";
import type { ContentBlock, ProfilePageData, ProfileSection } from "../types/profile";

function ReportBlock({ block }: { block: ContentBlock }) {
  if (block.type === "quote") return <blockquote className="partnership-quote">“{block.text}”</blockquote>;
  return <article className={`report-block report-${block.type}`}>
    {block.title && <h3>{block.title}</h3>}
    {block.type === "text" && <>
      {block.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {block.items && <ul className="report-list">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>}
    </>}
    {block.type === "metrics" && <dl className="report-metrics">{block.metrics.map((metric, index) => <div key={`${metric.label}-${index}`}><dt>{metric.label}</dt><dd><CurrencyText value={metric.value} /></dd>{metric.note && <p><CurrencyText value={metric.note ?? ""} /></p>}</div>)}</dl>}
    {block.type === "table" && <>
      <div className="report-table-scroll" role="region" aria-label={block.title} tabIndex={0}>
        <table><caption className="sr-only">{block.title}</caption><thead><tr>{block.columns.map((column) => <th key={column} scope="col"><CurrencyText value={column} /></th>)}</tr></thead>
          <tbody>{block.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0 ? <th scope="row" key={column}>{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {block.note && <p className="report-note">{block.note}</p>}
    </>}
    {block.type === "bars" && <>
      <dl className="report-bars">{block.items.map((item) => <div key={item.label}>
        <div className="report-bar-label"><dt>{item.label}</dt><dd>{item.display ?? item.value.toLocaleString("en-US")}</dd></div>
        <div className="bar-track" aria-hidden="true"><span style={{ width: `${item.value / (block.items.every((entry) => entry.display?.endsWith("%")) ? 100 : Math.max(...block.items.map((entry) => entry.value))) * 100}%` }} /></div>
      </div>)}</dl>
      {block.note && <p className="report-note">{block.note}</p>}
    </>}
    {block.type === "brands" && <div className="brand-grid">{block.items.map((brand) => <div key={brand.name}>
      {brand.image && <div className="brand-logo"><Image src={brand.image} alt={brand.name} width={210} height={100} /></div>}
      <h4>{brand.name}</h4><p>{brand.product}</p>
    </div>)}</div>}
  </article>;
}

export function ContentSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  if (section.id === "partnership") return <PartnershipSection section={section} />;
  if (section.id === "sustainability") return <SustainabilitySection section={section} />;
  if (section.id === "shipbuilding") return <ShipbuildingSection section={section} />;
  if (section.id === "infrastructure") return <InfrastructureSection section={section} />;
  if (section.id === "financials") return <FinancialSection section={section} />;
  if (section.id === "transport-network") return <TransportSection section={section} />;
  if (section.id === "about-mtcc") return <AboutSection section={section} />;
  if (section.id === "project-breakdown") return <ProjectBreakdown section={section} />;
  if (section.id === "general-trading") return <TradingSection section={section} />;
  if (section.id === "competitive-differentiators") return <DifferentiatorsSection section={section} />;
  return <section id={section.id} className={`section report-section ${section.dark ? "report-dark" : ""}`}>
    <div className="shell">
      <div className={`section-heading ${section.dark ? "heading-light" : ""}`}><p className="eyebrow">{section.eyebrow}</p><h2>{section.title}</h2>{section.intro && <p>{section.intro}</p>}</div>
      <div className="report-blocks">{section.blocks.map((block, index) => <ReportBlock key={index} block={block} />)}</div>
    </div>
  </section>;
}

function AboutSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  const paragraphs = section.blocks.flatMap(block => block.type === "text" ? block.paragraphs ?? [] : []);
  const roles = paragraphs.filter(text => /^(Infrastructure Development|Nationwide Connectivity|Fisheries Industry Modernization|Economic Enablement):/.test(text));
  const introduction = paragraphs.find(text => text.startsWith("For over"));
  const images = ["/assets/infrastructure.webp", "/assets/transport.webp", "/assets/team-engineering.webp", "/assets/shipbuilding.webp"];
  return <section id={section.id} className="about-section about-editorial" aria-labelledby="about-title">
    <div className="shell">
      <header className="about-editorial-heading"><p className="eyebrow">{section.title}</p><h2 id="about-title"><span className="about-reveal-line">A nation of islands.</span><br /><span className="about-reveal-line">Connected by possibility.</span></h2><p className="about-editorial-intro">Infrastructure. Mobility. Marine expertise.<br />Working together to move the Maldives forward.</p></header>
      <div className="about-editorial-visual">
        <Image src="/assets/bridge.webp" alt="Transport infrastructure linking communities in the Maldives" fill sizes="(max-width: 760px) 100vw, 1200px" />
        <div className="about-editorial-shade" />
        <div className="about-editorial-caption"><span>Our purpose, in every project.</span><strong>Closer communities.<br />Greater possibilities.</strong></div>
      </div>
      {introduction && <p className="about-editorial-summary">{introduction}</p>}
      <div className="about-contribution-heading"><p className="eyebrow">Our contribution</p><h3>Progress, in every direction.</h3></div>
      <div className="about-contribution-grid">{roles.map((paragraph, index) => {
        const separator = paragraph.indexOf(":");
        return <article className="about-contribution" key={paragraph}>
          <div className="about-contribution-image"><Image src={images[index]} alt="" fill sizes="(max-width: 760px) 100vw, 600px" /><span aria-hidden="true">0{index + 1}</span></div>
          <div className="about-contribution-copy"><h4>{paragraph.slice(0, separator)}</h4><p>{paragraph.slice(separator + 1).trim()}</p></div>
        </article>;
      })}</div>
      <details className="about-full-story"><summary><span>Our story, in full.<small>From our beginnings to our national role today.</small></span><span className="about-story-expand" aria-hidden="true">+</span></summary><div className="about-full-story-content">{section.blocks.map((block, index) => {
        if (block.type !== "text") return <ReportBlock block={block} key={index} />;
        const copy = block.paragraphs?.filter(text => text !== introduction && !roles.includes(text));
        if (!copy?.length && !block.items?.length) return null;
        return <article key={index}><h3>{block.title}</h3>{copy?.map(text => <p key={text}>{text}</p>)}{block.items && <ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul>}</article>;
      })}</div></details>
      <SectionLink className="about-editorial-journey" href="#milestones">Explore the milestones <ArrowDown size={18} aria-hidden="true" /></SectionLink>
    </div>
  </section>;
}

function FinancialSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  return <section id={section.id} className="financial-section" aria-labelledby="financial-title">
    <div className="shell">
      <header className="financial-intro">
        <p className="eyebrow">{section.eyebrow}</p>
        <h2 id="financial-title">{section.title}</h2>
      </header>
      {section.blocks.map((block, index) => {
        if (block.type === "text") return <div className="financial-position" key={index}>
          <h3>{block.title}</h3>
          <ul>{block.items?.map((item) => <li key={item}>{item}<ArrowUpRight className="financial-position-icon" aria-hidden="true" strokeWidth={1.5} /></li>)}</ul>
          {block.paragraphs?.map((text) => <p key={text}>{text}</p>)}
        </div>;
        if (block.type !== "metrics") return <ReportBlock key={index} block={block} />;
        const variant = index === 1 ? "balance" : index === 2 ? "pipeline" : "scale";
        return <article className={`financial-chapter financial-${variant}`} key={index}>
          {variant === "pipeline" && <><div className="financial-backdrop" aria-hidden="true"><Image src="/assets/infrastructure.webp" alt="" fill sizes="(max-width: 760px) 100vw, 1200px" /></div><div className="financial-shade" /></>}
          <div className="financial-chapter-heading"><span aria-hidden="true">0{index}</span><h3>{block.title}</h3></div>
          <dl className="financial-metrics">{block.metrics.map((metric, metricIndex) => <div className={`financial-stat ${metric.label === "Annual passengers" ? "financial-stat-wide" : ""}`} key={`${metric.label}-${metricIndex}`}>
            <dt>{metric.label}</dt><dd data-count={isMoney(metric.value) ? undefined : metric.value}><CurrencyText value={metric.value} /></dd>{metric.note && <p><CurrencyText value={metric.note ?? ""} /></p>}
          </div>)}</dl>
        </article>;
      })}
    </div>
  </section>;
}

export function LeadershipSection({ section }: { section: Extract<ProfileSection, { type: "leadership" }> }) {
  return <section id={section.id} className="section leadership-section"><div className="shell">
    <div className="section-heading"><p className="eyebrow">The people behind our progress</p><h2>{section.title}</h2></div>
    <div className="leadership-grid">{section.people.map((person) => <article key={person.name}>
      <Image src={person.image} alt={person.name} width={200} height={224} />
      <div><h3>{person.name}</h3><p>{person.role}</p>{person.division && <span>{person.division}</span>}</div>
    </article>)}</div>
  </div></section>;
}

export function ProfileContents({ data }: { data: ProfilePageData }) {
  return <nav className="profile-contents" aria-label="Profile contents"><div className="shell">
    <div className="contents-top"><p className="eyebrow">Explore the full profile</p></div>
    <div className="contents-links">{data.sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}<a href="#contact"><span><ArrowRight size={16} aria-hidden="true" /></span>Contact us</a></div>
  </div></nav>;
}
