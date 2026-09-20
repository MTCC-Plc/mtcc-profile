"use client";

import { useEffect, useMemo, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Globe2, Mail, MapPin, Phone } from "lucide-react";
import { SectionLink } from "./section-link";
import { HeroLogo } from "./hero-logo";
import { CurrencyText } from "./currency-symbol";
import { CurrencyToggle, useCurrency } from "./currency-toggle";
import { isMoney, profileInCurrency } from "../../lib/currency";
import Image from "./site-image";
import { ProfileLink as Link } from "./profile-link";
import type { ProfilePageData, ProfileSection } from "../types/profile";
import { ScrollExperience } from "./scroll-experience";
import { MilestonesSection } from "./milestones-section";
import { MobileMenu } from "./mobile-menu";
import { OrganisationSection } from "./organisation-section";
import { ValuesSection } from "./values-section";
import { CompanyAbout, PartnershipOverview } from "./profile-summary";
import { BusinessExplorer } from "./business-explorer";
import { ProjectPortfolio } from "./project-portfolio";
import { PrivateProjectsSection } from "./private-projects-section";
import { WorkforceSection } from "./workforce-section";
import { DigitalTransformationSection } from "./digital-transformation-section";
import { PotentialPartnershipsSection } from "./potential-partnerships-section";

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
      // The navigation drawer temporarily locks the body; that is not a scroll gesture.
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
        <div className="header-actions"><CurrencyToggle /><MobileMenu sections={sections} /></div>
      </div>
    </header>
  );
}

function Hero({ data }: { data: ProfilePageData }) {
  return <section className="company-hero" aria-labelledby="company-hero-title">
    <div className="company-hero-stage">
      <div className="company-hero-panorama" aria-hidden="true">
        <Image src={data.hero.image} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" />
      </div>
      <div className="company-hero-image-shade" aria-hidden="true" />
      <div className="shell company-hero-composition">
        <div className="company-hero-copy">
          <p className="company-hero-edition">MTCC <span>·</span> {data.hero.year}</p>
          <h1 id="company-hero-title">Building a<br /><span>connected nation.</span><small>Since 1980</small></h1>
          <p className="company-hero-lead">{data.hero.description}</p>
          <div className="company-hero-actions"><SectionLink className="company-primary-action" href="#private-projects">Partner with us on your project <ArrowDown size={17} aria-hidden="true" /></SectionLink><SectionLink className="company-secondary-action" href="#portfolio">See what we do <ArrowUpRight size={18} aria-hidden="true" /></SectionLink></div>
        </div>
        <div className="company-hero-brand"><HeroLogo /></div>
      </div>
    </div>
    <div className="shell company-hero-metrics">{data.hero.metrics.map(metric => <div key={metric.label}><MetricValue value={metric.value} /><span>{metric.label}</span></div>)}</div>
  </section>;
}

function MetricValue({ value }: { value: string }) {
  return <strong><span className="sr-only">{value}</span><span data-count={isMoney(value) ? undefined : value} aria-hidden="true"><CurrencyText value={value} /></span></strong>;
}

function Footer({ investor }: { investor: boolean }) {
  return (
    <footer id="contact" className="site-footer">
      <Image className="footer-waves" src="/assets/mtcc-waves.svg" alt="" width={1600} height={500} />
      <div className="shell footer-grid">
        <div><Image src="/assets/mtcc-logo.png" width={150} height={100} alt="MTCC" /><h2>Let us solve your challenges.</h2><p className="footer-intro">With an unmatched nationwide presence, proven execution capability and a growing portfolio of strategic opportunities, MTCC is well positioned to lead the next chapter of the Maldives’ development.</p></div>
        <address>
          <a href="https://www.mtcc.mv"><Globe2 size={19} />www.mtcc.mv</a>
          <a href="mailto:info@mtcc.com.mv"><Mail size={19} />info@mtcc.com.mv</a>
          <a href="tel:+9603326822"><Phone size={19} />+960 332 6822</a>
          {investor && <><a href="tel:1650"><Phone size={19} />1650</a><span><Globe2 size={19} />X · Facebook · Instagram: /mtccplc</span></>}
          <span><MapPin size={19} />MTCC Tower, Boduthakurufaanu Magu, Malé, Maldives</span>
        </address>
      </div>
      <div className="shell"><details className="profile-source-note"><summary>About the figures on this page</summary><p>The portfolio covers 878 projects, signed and in the pipeline, with a total contract value of MVR 34.84B. The sector breakdown reflects the register as at 9 September 2026. The on-hand and completed comparison covers a different scope: work on hand and projects completed since 2021. Flagship contract values exclude GST.</p><p>Financial position and community spending relate to 2024. Passenger figures are annual averages from the original company profile. Growth figures are targets. USD equivalents are approximate at MVR 15.42 per USD unless an original USD figure was supplied.</p></details></div>
      <div className="shell footer-bottom"><span>© 2026 Maldives Transport & Contracting Company PLC</span><a href="#top"><ArrowUpRight size={16} /> Back to top</a></div>
    </footer>
  );
}

function getSection<T extends ProfileSection["type"]>(data: ProfilePageData, id: string, type: T): Extract<ProfileSection, { type: T }> {
  const section = data.sections.find(section => section.id === id);
  if (!section || section.type !== type) throw new Error(`Missing ${type} section: ${id}`);
  return section as Extract<ProfileSection, { type: T }>;
}

export function ProfilePage({ data: original, businesses }: { data: ProfilePageData; businesses: ProfileSection[] }) {
  const { currency } = useCurrency();
  const data = useMemo(() => profileInCurrency(original, currency), [original, currency]);
  const businessData = useMemo(() => profileInCurrency({ ...original, sections: businesses }, currency).sections, [original, businesses, currency]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [currency]);
  return <ScrollExperience key={data.slug} theme={data.theme}>
    <a className="skip-link" href="#profile-content">Skip to content</a>
    <SiteHeader sections={data.sections.map(({ id, title }) => ({ id, title }))} />
    <main id="profile-content">
      <Hero data={data} />
      <CompanyAbout section={getSection(data, "about-mtcc", "content")} />
      <ValuesSection section={getSection(data, "purpose", "values")} />
      <BusinessExplorer sections={businessData} />
      <ProjectPortfolio comparison={getSection(data, "project-breakdown", "content")} projects={getSection(data, "projects", "projects")} />
      <PrivateProjectsSection />
      <MilestonesSection section={getSection(data, "milestones", "timeline")} />
      <PartnershipOverview reasons={getSection(data, "competitive-differentiators", "content")} sustainability={getSection(data, "sustainability", "content")} financials={getSection(data, "financials", "content")} strategy={getSection(data, "strategy", "strategy")} />
      <DigitalTransformationSection />
      <WorkforceSection />
      <OrganisationSection section={getSection(data, "management", "leadership")} />
      <PotentialPartnershipsSection section={getSection(data, "potential-partnerships", "content")} />
    </main>
    <Footer investor />
  </ScrollExperience>;
}
