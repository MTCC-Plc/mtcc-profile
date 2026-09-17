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
    {block.type === "metrics" && <dl className="report-metrics">{block.metrics.map((metric, index) => <div key={`${metric.label}-${index}`}><dt>{metric.label}</dt><dd>{metric.value}</dd>{metric.note && <p>{metric.note}</p>}</div>)}</dl>}
    {block.type === "table" && <>
      <div className="report-table-scroll" role="region" aria-label={block.title} tabIndex={0}>
        <table><caption className="sr-only">{block.title}</caption><thead><tr>{block.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
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
  const foundation = section.blocks.find(block => block.type === "text");
  const year = foundation?.title?.match(/\b\d{4}\b/)?.[0];
  return <section id={section.id} className="about-section" aria-labelledby="about-title">
    <div className="shell">
      <header className="about-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="about-title">{section.title}<span>.</span></h2></header>
      <div className="about-landscape">
        <Image src="/assets/corporate-hero.webp" alt="Aerial view of coastal infrastructure in the Maldives" fill sizes="(max-width: 760px) 100vw, 1200px" />
        <div className="about-landscape-shade" />
        {year && <div className="about-year" aria-hidden="true"><span>Our story began in</span><strong>{year}</strong></div>}
        <span className="about-location">The Maldives</span>
      </div>
      <div className="about-narrative">{section.blocks.map((block, index) => {
        if (block.type !== "text") return <ReportBlock block={block} key={index} />;
        return <article className="about-story" key={index}>
          <h3>{block.title}</h3>
          <div>{block.paragraphs?.map(paragraph => {
            const sentenceEnd = paragraph.indexOf(". ");
            return <p key={paragraph}>{sentenceEnd >= 0 ? <><span className="about-lead">{paragraph.slice(0, sentenceEnd + 1)}</span>{" "}<span className="about-detail">{paragraph.slice(sentenceEnd + 2)}</span></> : <span className="about-lead">{paragraph}</span>}</p>;
          })}{block.items && <ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul>}</div>
        </article>;
      })}</div>
      <a className="about-journey-link" href="#milestones">Explore our journey <span aria-hidden="true">↓</span></a>
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
          <ul>{block.items?.map((item) => <li key={item}>{item}<span aria-hidden="true">↗</span></li>)}</ul>
          {block.paragraphs?.map((text) => <p key={text}>{text}</p>)}
        </div>;
        if (block.type !== "metrics") return <ReportBlock key={index} block={block} />;
        const variant = index === 1 ? "balance" : index === 2 ? "pipeline" : "scale";
        return <article className={`financial-chapter financial-${variant}`} key={index}>
          {variant === "pipeline" && <><div className="financial-backdrop" aria-hidden="true"><Image src="/assets/infrastructure.webp" alt="" fill sizes="(max-width: 760px) 100vw, 1200px" /></div><div className="financial-shade" /></>}
          <div className="financial-chapter-heading"><span aria-hidden="true">0{index}</span><h3>{block.title}</h3></div>
          <dl className="financial-metrics">{block.metrics.map((metric, metricIndex) => <div className={`financial-stat ${metric.label === "Annual passengers" ? "financial-stat-wide" : ""}`} key={`${metric.label}-${metricIndex}`}>
            <dt>{metric.label}</dt><dd data-count={metric.value}>{metric.value}</dd>{metric.note && <p>{metric.note}</p>}
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
    <div className="contents-links">{data.sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}<a href="#contact"><span>→</span>Contact us</a></div>
  </div></nav>;
}
