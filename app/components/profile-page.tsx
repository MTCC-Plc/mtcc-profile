import Image from "./site-image";
import Link from "next/link";
import { assetPath } from "../../lib/asset-path";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { ProfilePageData, ProfileSection } from "../types/profile";
import { ScrollExperience } from "./scroll-experience";
import { InvestmentHighlights } from "./investment-highlights";
import { FlagshipProjects } from "./flagship-projects";
import { GrowthStrategy } from "./growth-strategy";
import { MobileMenu } from "./mobile-menu";
import { ContentSection, LeadershipSection, ProfileContents } from "./publication-sections";

function SiteHeader({ active }: { active: ProfilePageData["theme"] }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/corporate-profile" className="brand" aria-label="MTCC home">
          <Image src="/assets/mtcc-logo.png" width={140} height={94} alt="MTCC" priority />
          <span><strong>MTCC</strong><small>Maldives Transport & Contracting Company</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Profile navigation">
          <Link className={active === "corporate" ? "active" : ""} href="/corporate-profile">Corporate profile</Link>
          <Link className={active === "investor" ? "active" : ""} href="/investor-profile">Investor profile</Link>
          <a href="#contact">Contact</a>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}

function Hero({ data }: { data: ProfilePageData }) {
  return (
    <section className={`profile-hero ${data.theme}`}>
      <div className="hero-stage">
      <Image className="hero-image" src={data.hero.image} alt="MTCC operations in the Maldives" fill sizes="100vw" priority />
      <div className="hero-shade" />
      <div className="wave-lines" />
      <div className="shell hero-content">
        <div className="hero-copy">
          <p className="eyebrow light">{data.hero.eyebrow}</p>
          <h1>{data.hero.title}</h1>
          <p className="hero-lead">{data.hero.description}</p>
          <a className="section-jump" href={`#${data.sections[0].id}`}>Explore profile <ArrowDown size={17} /></a>
        </div>
        <div className="hero-edition"><span>{data.hero.year}</span><strong>MTCC</strong></div>
      </div>
      <div className="hero-scene-caption" aria-hidden="true"><span>Across the islands.</span><strong>Moving a nation forward.</strong></div>
      <div className="shell hero-metrics">
        {data.hero.metrics.map((metric) => (
          <div key={metric.label}><MetricValue value={metric.value} /><span>{metric.label}</span></div>
        ))}
      </div>
      <div className="hero-scroll-cue" aria-hidden="true"><span>Scroll to discover</span><span className="scroll-cue-line" /></div>
      </div>
    </section>
  );
}

function MetricValue({ value }: { value: string }) {
  return <strong><span className="sr-only">{value}</span><span data-count={value} aria-hidden="true">{value}</span></strong>;
}

function SectionHeading({ eyebrow, title, intro, invert = false }: { eyebrow?: string; title: string; intro?: string; invert?: boolean }) {
  return (
    <div className={`section-heading ${invert ? "heading-light" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function StorySection({ section }: { section: Extract<ProfileSection, { type: "story" }> }) {
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

function ValuesSection({ section }: { section: Extract<ProfileSection, { type: "values" }> }) {
  return (
    <section id={section.id} className="purpose-section" aria-labelledby={`${section.id}-title`}>
      <div className="shell purpose-intro">
        <p className="eyebrow">Our direction. Our drive.</p>
        <h2 id={`${section.id}-title`}>{section.title}</h2>
      </div>
      <div className="purpose-stage">
        {[
          { label: "Our vision", text: section.vision, image: "/assets/bridge.webp" },
          { label: "Our mission", text: section.mission, image: "/assets/transport.webp" },
        ].map((chapter, index) => <article className="purpose-scene" key={chapter.label}>
          <div className="purpose-backdrop" aria-hidden="true"><Image src={chapter.image} alt="" fill sizes="100vw" /></div>
          <div className="purpose-shade" />
          <div className="shell purpose-statement"><p className="eyebrow">{chapter.label}</p><h3>{chapter.text}<span className="purpose-period">.</span></h3><span className="purpose-index" aria-hidden="true">0{index + 1} / 02</span></div>
        </article>)}
        <div className="purpose-chapters" aria-hidden="true"><span>01 — Vision</span><div><i /></div><span>02 — Mission</span></div>
      </div>
      <div className="shell purpose-values">
        <div className="purpose-values-heading"><p className="eyebrow">Our core values</p><h3>What moves us.</h3></div>
        <div className="move-values">
          {section.values.map((value) => <article key={value.letter}>
            <span className="move-letter" aria-hidden="true">{value.letter}</span>
            <h4>{value.title}</h4><p>{value.text}</p>
          </article>)}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ section }: { section: Extract<ProfileSection, { type: "services" }> }) {
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

function PeopleSection({ section }: { section: Extract<ProfileSection, { type: "people" }> }) {
  return (
    <section id={section.id} className="section people-section">
      <div className="shell people-grid">
        <div><SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro} /><div className="body-copy">{section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><a href="#contact" className="text-link">Work with MTCC <ArrowUpRight size={18} /></a></div>
        <div className="people-images">{section.images.map((image, index) => <div key={image}><Image src={image} alt={index === 0 ? "MTCC engineer" : "MTCC welding specialist"} fill sizes="30vw" /></div>)}</div>
      </div>
    </section>
  );
}

function MetricsSection({ section }: { section: Extract<ProfileSection, { type: "metrics" }> }) {
  if (section.id === "highlights") return <InvestmentHighlights section={section} />;
  return (
    <section id={section.id} className="section metrics-section">
      <div className="shell">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro} invert />
        <div className="metrics-grid">
          {section.metrics.map((metric, index) => (
            <article key={`${metric.label}-${index}`} className={index === 0 ? "feature" : ""}>
              <span>{metric.label}</span><MetricValue value={metric.value} />{metric.note && <p>{metric.note}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ section }: { section: Extract<ProfileSection, { type: "timeline" }> }) {
  return (
    <section id={section.id} className="section timeline-section">
      <div className="shell">
        <SectionHeading eyebrow="Our journey" title={section.title} />
        <div className="timeline-window"><div className="timeline">
          {section.items.map((item) => <article key={item.year}><time>{item.year}</time><div><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}
        </div></div>
      </div>
    </section>
  );
}

function PortfolioSection({ section }: { section: Extract<ProfileSection, { type: "portfolio" }> }) {
  const visuals = ["/assets/infrastructure.webp", "/assets/bridge.webp", "/assets/transport.webp", "/assets/team-welding.webp", "/assets/shipbuilding.webp"];
  const destinations = ["infrastructure", "transport-network", "transport-network", "shipbuilding", "general-trading"];
  return (
    <section id={section.id} className="portfolio-showcase" aria-labelledby="portfolio-title">
      <div className="shell">
        <header className="portfolio-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="portfolio-title">{section.title}<span>.</span></h2><p>{section.intro}</p></header>
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


function SectionRenderer({ section }: { section: ProfileSection }) {
  switch (section.type) {
    case "story": return <StorySection section={section} />;
    case "values": return <ValuesSection section={section} />;
    case "services": return <ServicesSection section={section} />;
    case "people": return <PeopleSection section={section} />;
    case "metrics": return <MetricsSection section={section} />;
    case "timeline": return <TimelineSection section={section} />;
    case "portfolio": return <PortfolioSection section={section} />;
    case "projects": return <FlagshipProjects section={section} />;
    case "strategy": return <GrowthStrategy section={section} />;
    case "content": return <ContentSection section={section} />;
    case "leadership": return <LeadershipSection section={section} />;
  }
}

function Footer({ investor }: { investor: boolean }) {
  return (
    <footer id="contact" className="site-footer">
      <img className="footer-waves" src={assetPath("/assets/mtcc-waves.svg")} alt="" />
      <div className="shell footer-grid">
        <div><Image src="/assets/mtcc-logo.png" width={150} height={100} alt="MTCC" /><h2>Let us solve your challenges.</h2><p className="footer-intro">For over four decades, Maldives Transport and Contracting Company Public Limited has helped clients meet some of their toughest challenges. Tell us about your challenges, or look at our portfolio on <a href="https://www.mtcc.mv">www.mtcc.mv</a>.</p></div>
        <address>
          <a href="https://www.mtcc.mv"><Globe2 size={19} />www.mtcc.mv</a>
          <a href="mailto:info@mtcc.com.mv"><Mail size={19} />info@mtcc.com.mv</a>
          <a href="tel:+9603326822"><Phone size={19} />+960 332 6822</a>
          {investor && <><a href="tel:1650"><Phone size={19} />1650</a><span><Globe2 size={19} />X · Facebook · Instagram: /mtccplc</span></>}
          <span><MapPin size={19} />MTCC Tower, Boduthakurufaanu Magu, Malé, Maldives</span>
        </address>
      </div>
      <div className="shell footer-bottom"><span>© 2026 Maldives Transport & Contracting Company PLC</span><a href="#top"><ArrowUpRight size={16} /> Back to top</a></div>
    </footer>
  );
}

export function ProfilePage({ data }: { data: ProfilePageData }) {
  return <ScrollExperience key={data.slug} theme={data.theme}><a className="skip-link" href="#profile-content">Skip to content</a><SiteHeader active={data.theme} /><main id="profile-content"><Hero data={data} /><ProfileContents data={data} />{data.sections.map((section) => <SectionRenderer key={section.id} section={section} />)}</main><Footer investor={data.theme === "investor"} /></ScrollExperience>;
}
