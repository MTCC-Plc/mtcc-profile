"use client";

import { SectionLink } from "./section-link";
import { HeroLogo } from "./hero-logo";
import { CurrencyText } from "./currency-symbol";


import { Fragment, useEffect, useMemo, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CurrencyToggle, useCurrency } from "./currency-toggle";
import { isMoney, profileInCurrency } from "../../lib/currency";
import Image from "./site-image";
import { ProfileLink as Link } from "./profile-link";
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
import { MilestonesSection } from "./milestones-section";
import { MobileMenu } from "./mobile-menu";
import { ContentSection, ProfileContents } from "./publication-sections";
import { OrganisationSection } from "./organisation-section";

function SiteHeader({ sections }: { sections: { id: string; title: string }[] }) {
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    let previous = window.scrollY;
    let distance = 0;
    let frame = 0;
    const show = () => { element.dataset.hidden = "false"; distance = 0; };
    const update = () => {
      frame = 0;
      // The mobile drawer temporarily locks the body; that is not a scroll gesture.
      if (document.body.style.position === "fixed" || element.querySelector("dialog[open]")) { show(); return; }
      const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
      const delta = y - previous;
      previous = y;
      if (y < element.offsetHeight * 2 || element.querySelector(":focus-visible")) { show(); return; }
      if (!delta) return;
      distance = Math.sign(delta) === Math.sign(distance) ? distance + delta : delta;
      if (distance > 24) { element.dataset.hidden = "true"; distance = 0; }
      else if (distance < -12) show();
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    element.addEventListener("focusin", show);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      element.removeEventListener("focusin", show);
    };
  }, []);
  return (
    <header ref={header} className="site-header">
      <div className="shell header-inner">
        <Link href="/#top" className="brand" aria-label="MTCC home">
          <Image src="/assets/mtcc-logo.png" width={140} height={94} alt="MTCC" priority />
          <span><strong>MTCC</strong><small>Maldives Transport & Contracting Company</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#about-mtcc">About</a><a href="#portfolio">Businesses</a><a href="#projects">Projects</a><a href="#financials">Financials</a><a href="#contact">Contact</a>
        </nav>
        <div className="header-actions"><CurrencyToggle /><MobileMenu sections={sections} /></div>
      </div>
    </header>
  );
}

function Hero({ data }: { data: ProfilePageData }) {
  return <section className="company-hero" aria-labelledby="company-hero-title">
    <div className="shell company-hero-copy">
      <p className="company-hero-edition">MTCC <span>·</span> {data.hero.year}</p>
      <h1 id="company-hero-title">Building a<br /><span>connected nation.</span></h1>
      <p className="company-hero-lead">{data.hero.description}</p>
      <div className="company-hero-actions"><SectionLink className="company-primary-action" href="#about-mtcc">Discover MTCC <ArrowDown size={17} aria-hidden="true" /></SectionLink><SectionLink className="company-secondary-action" href="#portfolio">Our businesses <ArrowUpRight size={18} aria-hidden="true" /></SectionLink></div>
    </div>
    <div className="company-hero-panorama">
      <Image src={data.hero.image} alt="Aerial view of MTCC coastal infrastructure and turquoise Maldivian waters" fill sizes="100vw" priority />
      <div className="company-hero-image-shade" />
      <HeroLogo />
      <div className="company-hero-caption"><span>Across the islands.</span><strong>Moving a nation forward.</strong></div>
      <span className="company-hero-location">The Maldives <ArrowUpRight size={14} aria-hidden="true" /></span>
    </div>
    <div className="shell company-hero-metrics">{data.hero.metrics.map(metric => <div key={metric.label}><MetricValue value={metric.value} /><span>{metric.label}</span></div>)}</div>
  </section>;
}

function MetricValue({ value }: { value: string }) {
  return <strong><span className="sr-only">{value}</span><span data-count={isMoney(value) ? undefined : value} aria-hidden="true"><CurrencyText value={value} /></span></strong>;
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
              <span>{metric.label}</span><MetricValue value={metric.value} />{metric.note && <p><CurrencyText value={metric.note ?? ""} /></p>}
            </article>
          ))}
        </div>
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


function SectionRenderer({ section }: { section: ProfileSection }) {
  switch (section.type) {
    case "story": return <StorySection section={section} />;
    case "values": return <ValuesSection section={section} />;
    case "services": return <ServicesSection section={section} />;
    case "people": return <PeopleSection section={section} />;
    case "metrics": return <MetricsSection section={section} />;
    case "timeline": return <MilestonesSection section={section} />;
    case "portfolio": return <PortfolioSection section={section} />;
    case "projects": return <FlagshipProjects section={section} />;
    case "strategy": return <GrowthStrategy section={section} />;
    case "content": return <ContentSection section={section} />;
    case "leadership": return <OrganisationSection section={section} />;
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

export function ProfilePage({ data: original }: { data: ProfilePageData }) {
  const { currency } = useCurrency();
  const data = useMemo(() => profileInCurrency(original, currency), [original, currency]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [currency]);
  return <ScrollExperience key={data.slug} theme={data.theme}><a className="skip-link" href="#profile-content">Skip to content</a><SiteHeader sections={data.sections.map(({ id, title }) => ({ id, title }))} /><main id="profile-content"><Hero data={data} />{data.sections.map((section) => <Fragment key={section.id}><SectionRenderer section={section} />{section.id === "about-mtcc" && <ProfileContents data={data} />}</Fragment>)}</main><Footer investor /></ScrollExperience>;
}
