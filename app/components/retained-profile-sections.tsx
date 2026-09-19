// Earlier profile layouts, retained for future editions; not mounted by the current page.
import { ArrowUpRight, Check } from "lucide-react";
import Image from "./site-image";
import { CurrencyText } from "./currency-symbol";
import { isMoney } from "../../lib/currency";
import { InvestmentHighlights } from "./investment-highlights";
import type { ProfileSection } from "../types/profile";

export function MetricValue({ value }: { value: string }) {
  return <strong><span className="sr-only">{value}</span><span data-count={isMoney(value) ? undefined : value} aria-hidden="true"><CurrencyText value={value} /></span></strong>;
}

export function SectionHeading({ eyebrow, title, intro, invert = false }: { eyebrow?: string; title: string; intro?: string; invert?: boolean }) {
  return (
    <div className={`section-heading ${invert ? "heading-light" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

export function StorySection({ section }: { section: Extract<ProfileSection, { type: "story" }> }) {
  return (
    <section id={section.id} className="section story-section">
      <div className="shell story-grid">
        <div>
          <SectionHeading eyebrow={section.eyebrow} title={section.title} />
          <div className="body-copy">{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          {section.quote && <blockquote>{section.quote}</blockquote>}
        </div>
        <div className="story-visual">
          <Image src={section.image} alt="MTCC transport infrastructure" fill sizes="(max-width: 800px) 100vw, 50vw" />
          <div className="portrait-note">
            <Image src="/assets/ahmed-saudee.webp" alt="Ahmed Saudee" width={66} height={66} />
            <span><strong>Ahmed Saudee</strong><small>Managing Director</small></span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection({ section }: { section: Extract<ProfileSection, { type: "services" }> }) {
  return (
    <section id={section.id} className="section services-section">
      <div className="shell">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro} />
        <div className="services-stage">
        <div className="services-stack">
          {section.items.map((service, index) => (
            <article className="service-card" key={service.title}>
              <div className="service-image"><Image src={service.image} alt={service.title} fill sizes="(max-width: 800px) 100vw, 42vw" /></div>
              <div className="service-copy">
                <span className="service-number">0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>{service.capabilities.slice(0, 3).map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
        <div className="service-chapters" aria-hidden="true">
          {section.items.map((service, index) => <span key={service.title}><b>{String(index + 1).padStart(2, "0")}</b>{service.title}</span>)}
        </div>
        <div className="service-progress" aria-hidden="true"><span /></div>
        </div>
        <div className="service-details" id="service-details">
          <div className="section-heading"><p className="eyebrow">Our expertise, in depth</p><h2>Full service profiles</h2></div>
          {section.items.map((service, index) => <article className="service-detail" id={`service-detail-${index + 1}`} key={service.title}>
            <div className="service-detail-heading"><span className="service-number">0{index + 1}</span><h3>{service.title}</h3></div>
            <div className="body-copy"><p className="service-detail-lead">{service.description}</p>{service.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<ul className="report-list">{service.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </article>)}
        </div>
      </div>
    </section>
  );
}

export function PeopleSection({ section }: { section: Extract<ProfileSection, { type: "people" }> }) {
  return (
    <section id={section.id} className="section people-section">
      <div className="shell people-grid">
        <div><SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro} /><div className="body-copy">{section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><a href="#contact" className="text-link">Work with MTCC <ArrowUpRight size={18} /></a></div>
        <div className="people-images">{section.images.map((image, index) => <div key={image}><Image src={image} alt={index === 0 ? "MTCC engineer" : "MTCC welding specialist"} fill sizes="30vw" /></div>)}</div>
      </div>
    </section>
  );
}

export function MetricsSection({ section }: { section: Extract<ProfileSection, { type: "metrics" }> }) {
  if (section.id === "highlights") return <InvestmentHighlights section={section} />;
  return (
    <section id={section.id} className="section metrics-section">
      <div className="shell">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro} invert />
        <div className="metrics-grid">
          {section.metrics.map((metric, index) => (
            <article key={`${metric.label}-${index}`} className={index === 0 ? "feature" : ""}>
              <span>{metric.label}</span><MetricValue value={metric.value} />{metric.note && <p><CurrencyText value={metric.note ?? ""} /></p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortfolioSection({ section }: { section: Extract<ProfileSection, { type: "portfolio" }> }) {
  const visuals = ["/assets/infrastructure.webp", "/assets/bridge.webp", "/assets/transport.webp", "/assets/team-welding.webp", "/assets/shipbuilding.webp"];
  const destinations = ["infrastructure", "transport-network", "transport-network", "shipbuilding", "general-trading"];
  return (
    <section id={section.id} className="portfolio-showcase" aria-labelledby="portfolio-title">
      <div className="shell">
        <span id="services" className="section-anchor-alias" aria-hidden="true" /><span id="service-details" className="section-anchor-alias" aria-hidden="true" /><header className="portfolio-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="portfolio-title">{section.title}<span>.</span></h2><p>{section.intro}</p></header>
        <div className="sector-grid">
          {section.items.map((item, index) => <article className={`sector-card ${index === 0 ? "sector-featured" : ""}`} key={item.title}>
            <div className="sector-visual"><Image src={visuals[index]} alt="" fill sizes={index === 0 ? "(max-width: 760px) 100vw, 660px" : "(max-width: 760px) 100vw, 600px"} /><span className="sector-number" aria-hidden="true">0{index + 1}</span></div>
            <div className="sector-copy"><div><h3>{item.title}</h3><p>{item.description}</p></div><div className="sector-footer">{item.metric && <strong>{item.metric}</strong>}<a href={`#${destinations[index]}`} aria-label={`Explore ${item.title}`}><span>Explore business</span><ArrowUpRight size={21} aria-hidden="true" /></a></div></div>
          </article>)}
        </div>
      </div>
    </section>
  );
}
