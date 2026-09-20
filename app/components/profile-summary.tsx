import { ArrowUpRight, Check } from "lucide-react";
import Image from "./site-image";
import { CurrencyText } from "./currency-symbol";
import type { ProfileSection } from "../types/profile";
import styles from "./profile-summary.module.css";

type Content = Extract<ProfileSection, { type: "content" }>;

export function CompanyAbout({ section }: { section: Content }) {
  return <section id={section.id} className={styles.about} aria-labelledby="about-title"><div className="shell">
    <div className={styles.aboutGrid}>
      <div><p className="eyebrow">{section.eyebrow}</p><h2 id="about-title">{section.title}</h2>
        {section.blocks.flatMap(block => block.type === "text" ? block.paragraphs ?? [] : []).map(text => <p className={styles.body} key={text}>{text}</p>)}
      </div>
      <div className={styles.aboutImage}><Image src="/assets/section-photo.webp" alt="Infrastructure connecting island communities in the Maldives" fill sizes="(max-width: 800px) 100vw, 520px" /><div><span>Across 20 atolls</span><strong>Alongside the nation.</strong></div></div>
    </div>
    <dl className={styles.metrics}>{section.blocks.flatMap(block => block.type === "metrics" ? block.metrics : []).map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd><CurrencyText value={metric.value} /></dd></div>)}</dl>
  </div></section>;
}

export function PartnershipOverview({ reasons, sustainability, financials, strategy }: {
  reasons: Content; sustainability: Content; financials: Content;
  strategy: Extract<ProfileSection, { type: "strategy" }>;
}) {
  const investment = sustainability.blocks.flatMap(block => block.type === "metrics" ? block.metrics : [])[0];
  return <section className={styles.overview} aria-labelledby="reasons-title"><div className="shell">
    <div className={styles.partnerGrid}>
      <div id={reasons.id}><p className="eyebrow">{reasons.eyebrow}</p><h2 id="reasons-title">{reasons.title}</h2><ul className={styles.reasons}>{reasons.blocks.flatMap(block => block.type === "text" ? block.items ?? [] : []).map(text => <li key={text}><Check size={20} aria-hidden="true" /><span>{text}</span></li>)}</ul></div>
      <aside id={sustainability.id} className={styles.sustainability} aria-labelledby="sustainability-title"><p className="eyebrow">{sustainability.eyebrow}</p><h3 id="sustainability-title">{sustainability.title}</h3>
        {investment && <p className={styles.investment}><strong><CurrencyText value={investment.value} /></strong><span>{investment.label}</span></p>}
        <ul>{sustainability.blocks.flatMap(block => block.type === "text" ? block.items ?? [] : []).map(text => <li key={text}>{text}</li>)}</ul>
      </aside>
    </div>
    <div id={financials.id} className={styles.financials}><h3>{financials.title}</h3><dl className={styles.metrics}>{financials.blocks.flatMap(block => block.type === "metrics" ? block.metrics : []).map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd><CurrencyText value={metric.value} /></dd></div>)}</dl></div>
    <div id={strategy.id} className={styles.growth}><h3>{strategy.title}</h3><div className={styles.growthGrid}>{strategy.pillars.map((pillar, index) => <article key={pillar.title}><div><span>0{index + 1}</span><ArrowUpRight size={18} aria-hidden="true" /></div><h4>{pillar.title}</h4><ul>{pillar.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div></div>
  </div></section>;
}
