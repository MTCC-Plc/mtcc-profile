"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Anchor, ArrowUpRight, Building2, Check, Flag, House, Leaf, Play, Ship } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { economicHub, staffHousing } from "../data/featured-investments";
import type { ProfileSection } from "../types/profile";
import { currencyMetrics, MVR_PER_USD, type Currency } from "../../lib/currency";
import { CurrencyText } from "./currency-symbol";
import { useCurrency } from "./currency-toggle";
import { SectionLink } from "./section-link";
import { assetPath } from "../../lib/asset-path";
import styles from "./potential-partnerships-section.module.css";

const opportunities = [
  { id: "economic-hub", title: "Integrated Economic Hub", detail: "Five independently investable projects", icon: Anchor },
  { id: "staff-housing", title: "MTCC Hiya Housing Project", detail: "Homes for the people behind MTCC", icon: House },
] as const;
const projectIcons = [Anchor, Ship, Flag, Leaf, Building2];

function InvestmentValue({ investment }: { investment: { currency: Currency; amount: string } }) {
  const { currency } = useCurrency();
  const value = currencyMetrics([{ value: `${investment.currency} ${investment.amount}M`, label: "Investment" }], currency)[0].value;
  return <>
    <strong className={styles.money}><CurrencyText value={value.replace(/M$/, "")} /><small>{currency} million</small></strong>
    {currency !== investment.currency && <small className={styles.originalValue}>{investment.currency} {investment.amount} million</small>}
  </>;
}

function CurrencyNote({ originalCurrency }: { originalCurrency: Currency }) {
  const { currency } = useCurrency();
  return currency !== originalCurrency && <p className={styles.currencyNote}>Converted figures are approximate at MVR {MVR_PER_USD} to USD 1. Original investment estimates are shown below each equivalent.</p>;
}

export function PotentialPartnershipsSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const hubVideo = useRef<HTMLVideoElement>(null);
  const [filmPlaying, setFilmPlaying] = useState(false);
  const headingId = `${section.id}-title`;
  const tabId = (id: string) => `${section.id}-tab-${id}`;
  const panelId = (id: string) => `${section.id}-panel-${id}`;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    let previousHeight = 0;
    const observer = new ResizeObserver(() => {
      const height = element.getBoundingClientRect().height;
      if (height === previousHeight) return;
      previousHeight = height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  /*
   * The film loops muted and silent as an ambient preview. Pressing play takes it
   * full screen with sound: the fullscreen request has to happen inside the click
   * so it keeps the user activation, and iOS Safari only exposes fullscreen on the
   * video element itself (webkitEnterFullscreen), not the generic API.
   */
  function playFilmFullscreen() {
    const video = hubVideo.current;
    if (!video) return;
    setFilmPlaying(true);
    video.muted = false;
    video.currentTime = 0;
    void video.play().catch(() => {});
    type IosVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    const ios = video as IosVideo;
    if (video.requestFullscreen) void video.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
    else if (ios.webkitEnterFullscreen) ios.webkitEnterFullscreen();
  }

  useEffect(() => {
    const video = hubVideo.current;
    if (!video) return;
    const onFullscreenChange = () => {
      if (document.fullscreenElement === video) return;
      setFilmPlaying(false);
      video.muted = true;
      void video.play().catch(() => {});
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    // iOS fires its own event because it never sets document.fullscreenElement.
    video.addEventListener("webkitendfullscreen", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      video.removeEventListener("webkitendfullscreen", onFullscreenChange);
    };
  }, []);

  function selectWithKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = opportunities.length;
    const next = event.key === "ArrowRight" ? (index + 1) % count
      : event.key === "ArrowLeft" ? (index - 1 + count) % count
      : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus({ preventScroll: true });
  }

  return <section ref={root} id={section.id} className={styles.section} aria-labelledby={headingId}>
    <div className={styles.lines} aria-hidden="true"><span /><span /><span /></div>
    <header className={`shell ${styles.inner}`}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}><span aria-hidden="true" />{section.eyebrow}</p>
        <h2 id={headingId}>{section.title}</h2>
        {section.intro && <p className={styles.intro}>{section.intro}</p>}
      </div>
      <SectionLink href="#contact" className={styles.contact}>Get in touch<span className={styles.arrow}><ArrowUpRight size={24} aria-hidden="true" /></span></SectionLink>
    </header>

    <div className={`shell ${styles.explorer}`}>
      <div className={styles.tabList} role="tablist" aria-label="Featured investment opportunities">
        {opportunities.map((opportunity, index) => <button
          key={opportunity.id}
          ref={element => { tabs.current[index] = element; }}
          type="button"
          id={tabId(opportunity.id)}
          role="tab"
          aria-selected={active === index}
          aria-controls={panelId(opportunity.id)}
          tabIndex={active === index ? 0 : -1}
          onClick={() => setActive(index)}
          onKeyDown={event => selectWithKeyboard(event, index)}
        >
          <span className={styles.tabNumber}>0{index + 1}</span>
          <span className={styles.tabLabel}>{opportunity.title}<small className={styles.tabDescription}>{opportunity.detail}</small></span>
          <opportunity.icon className={styles.tabIcon} size={25} strokeWidth={1.5} aria-hidden="true" />
        </button>)}
      </div>

      <div id={panelId(economicHub.id)} className={styles.panel} role="tabpanel" aria-labelledby={tabId(economicHub.id)} tabIndex={0} hidden={active !== 0}>
        <div className={styles.hubSplit}>
          <div className={styles.hubCopy}>
            <p className={styles.kicker}>01 / {economicHub.title}</p>
            <h3>{economicHub.subtitle}</h3>
            <div className={styles.overview}>{economicHub.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
          <figure className={styles.hubVideo}>
            {/*
              Self-hosted so the page makes no third-party requests. Muted +
              playsInline are what allow autoplay on iOS and Chrome; controls stay
              available, and the poster carries the frame if the file is missing.
            */}
            <video
              ref={hubVideo}
              src={assetPath("/assets/investments/economic-hub.mp4")}
              poster={assetPath("/assets/investments/transshipment-port.webp")}
              autoPlay
              muted
              loop
              playsInline
              controls={filmPlaying}
              preload="metadata"
              aria-label="Concept film for the Integrated Economic Hub"
            />
            {!filmPlaying && <button type="button" className={styles.hubPlay} onClick={playFilmFullscreen} aria-label={`Play the ${economicHub.title} film`}>
              <span className={styles.hubPlayIcon}><Play size={20} aria-hidden="true" /></span>
              <span>Play</span>
            </button>}
          </figure>
        </div>
        <ol className={styles.projectList} aria-label="Integrated Economic Hub investment projects">
          {economicHub.projects.map((project, index) => {
            const Icon = projectIcons[index];
            return <li className={styles.project} key={project.id}>
              <div className={styles.projectContent}>
                <div className={styles.projectCopy}>
                  <div className={styles.projectIdentity}>
                    <div className={styles.projectIcon}><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><span className={styles.projectNumber}>0{index + 1}</span></div>
                    <h4 className={styles.projectTitle}>{project.title}</h4>
                  </div>
                  <p className={styles.projectOverview}>{project.overview}</p>
                </div>
                <dl className={styles.projectMetrics}>
                  <div><dt>Scale</dt><dd>{project.scale}</dd></div>
                  <div><dt>Indicative investment</dt><dd><InvestmentValue investment={project.investment} /></dd></div>
                </dl>
              </div>
            </li>;
          })}
        </ol>
        <CurrencyNote originalCurrency="USD" />
        <div className={styles.opportunityFooter}>
          <h4>Investment Opportunities</h4>
          <div className={styles.footerCopy}>
            {economicHub.opportunities.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            <SectionLink href="#contact" className={styles.action}>Discuss an investment<ArrowUpRight size={19} aria-hidden="true" /></SectionLink>
          </div>
        </div>
      </div>

      <div id={panelId(staffHousing.id)} className={styles.panel} role="tabpanel" aria-labelledby={tabId(staffHousing.id)} tabIndex={0} hidden={active !== 1}>
        <header className={styles.housingHeader}>
          <div className={styles.housingCopy}>
            <p className={styles.kicker}>02 / Employee housing</p>
            <h3>{staffHousing.title}</h3>
            <h4>Project Overview</h4>
            <p>{staffHousing.overview}</p>
          </div>
          <dl className={styles.investmentCallout}><div><dt>Estimated Investment Value</dt><dd><InvestmentValue investment={staffHousing.investment} /></dd></div></dl>
        </header>
        <CurrencyNote originalCurrency="MVR" />
        <div className={styles.housingScale}>
          <h4>Project Scale</h4>
          <p>{staffHousing.scale}</p>
          <dl className={styles.scaleStats}>
            <div><dt>Residential apartment blocks</dt><dd>2</dd></div>
            <div><dt>Storeys per block</dt><dd><small>Approx.</small> 10</dd></div>
            <div><dt>Housing units</dt><dd><small>Estimated</small> 104</dd></div>
          </dl>
        </div>
        <div className={styles.components}>
          <h4>Key Components</h4>
          <ul className={styles.componentList}>{staffHousing.components.map(component => <li key={component}><Check className={styles.componentIcon} size={18} aria-hidden="true" /><span>{component}</span></li>)}</ul>
        </div>
        <div className={styles.strategicValue}>
          <h4>Strategic Value</h4>
          <p>{staffHousing.strategicValue}</p>
          <SectionLink href="#contact" className={styles.action}>Explore a housing partnership<ArrowUpRight size={19} aria-hidden="true" /></SectionLink>
        </div>
      </div>
    </div>
  </section>;
}
