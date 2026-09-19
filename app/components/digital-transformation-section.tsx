"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, BriefcaseBusiness, ChartNoAxesCombined, Check, CircleCheck, FileCheck2, Fingerprint, Layers3, Network, Radio, Users, Waypoints } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { digitalSystems, type DigitalSystemId } from "../data/digital-transformation";
import { DigitalSystemVisual } from "./digital-system-visual";
import styles from "./digital-transformation-section.module.css";

const chapters = ["Digital journey", "Smarter operations", "Stakeholder services"];
const systemIcons = { pms: ChartNoAxesCombined, hris: Users, simplix: FileCheck2, sop: Fingerprint, vendor: BriefcaseBusiness };

function keyboardSelection(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, select: (next: number) => void) {
  const next = event.key === "ArrowRight" ? (index + 1) % count
    : event.key === "ArrowLeft" ? (index - 1 + count) % count
    : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
  if (next === null) return;
  event.preventDefault();
  select(next);
}

function SystemExplorer({ group, selected, onSelect }: { group: "operations" | "access"; selected: DigitalSystemId; onSelect: (id: DigitalSystemId) => void }) {
  const systems = digitalSystems.filter(system => system.group === group);
  const system = systems.find(system => system.id === selected) ?? systems[0];
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const Icon = systemIcons[system.id];

  return <div className={styles.systemExplorer}>
    <header className={styles.explorerHeading}><span className={styles.kicker}>{group === "operations" ? "Inside MTCC" : "Beyond our operations"}</span><h3>{group === "operations" ? <>Smarter operations.<br /><span>Stronger oversight.</span></> : <>Bringing stakeholder<br /><span>services closer.</span></>}</h3><p>{group === "operations" ? "Connecting project delivery, workforce services and executive decision-making." : "Creating simpler digital channels for shareholders and vendors."}</p></header>
    <div className={styles.systemTabs} role="tablist" aria-label={group === "operations" ? "Operational systems" : "Stakeholder services"}>
      {systems.map((item, index) => {
        const ItemIcon = systemIcons[item.id];
        return <button key={item.id} type="button" id={`digital-system-tab-${item.id}`} ref={element => { buttons.current[index] = element; }} role="tab" aria-selected={system.id === item.id} aria-controls={`digital-system-panel-${group}`} tabIndex={system.id === item.id ? 0 : -1} onClick={() => onSelect(item.id)} onKeyDown={event => keyboardSelection(event, index, systems.length, next => { onSelect(systems[next].id); buttons.current[next]?.focus(); })}><ItemIcon size={19} aria-hidden="true" /><span>{item.audience}<small>{item.name}</small></span><ArrowUpRight size={17} aria-hidden="true" /></button>;
      })}
    </div>
    <div id={`digital-system-panel-${group}`} role="tabpanel" aria-labelledby={`digital-system-tab-${system.id}`} tabIndex={0} className={styles.systemPanel}>
      <div className={styles.systemCopy} key={`${system.id}-copy`}><span className={styles.systemMark}><Icon size={23} strokeWidth={1.6} aria-hidden="true" />{system.name}</span><h4>{system.title}</h4><p>{system.description}</p><ul>{system.features.map(feature => <li key={feature}><Check size={17} aria-hidden="true" />{feature}</li>)}</ul><span className={styles.attribution}><i aria-hidden="true" />{system.attribution}</span></div>
      <div className={styles.systemVisual} key={system.id}><DigitalSystemVisual system={system.id} /></div>
    </div>
  </div>;
}

export function DigitalTransformationSection() {
  const [chapter, setChapter] = useState(0);
  const [operation, setOperation] = useState<DigitalSystemId>("pms");
  const [stakeholder, setStakeholder] = useState<DigitalSystemId>("sop");
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusSystem = useRef<DigitalSystemId | null>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    let frame = 0;
    let previousHeight = 0;
    const observer = new ResizeObserver(() => {
      const height = section.getBoundingClientRect().height;
      if (height === previousHeight) return;
      previousHeight = height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(section);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const id = focusSystem.current;
    if (!id) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(`digital-system-tab-${id}`)?.focus({ preventScroll: true });
      focusSystem.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [chapter]);

  function explore(id: DigitalSystemId) {
    const system = digitalSystems.find(item => item.id === id)!;
    focusSystem.current = id;
    if (system.group === "operations") { setOperation(id); setChapter(1); }
    else { setStakeholder(id); setChapter(2); }
  }

  return <section ref={root} id="digital-transformation" className={styles.section} aria-labelledby="digital-title">
    <div className={`shell ${styles.shell}`}>
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}><span aria-hidden="true" /><span>Our digital journey</span></p><h2 id="digital-title">A more<br /><span>connected MTCC.</span></h2></div>
        <div className={styles.headingAside}><Network size={29} strokeWidth={1.2} aria-hidden="true" /><p>Advancing digital operations and accessible services, reflecting the direction of Maldives 2.0.</p><span>Connected systems. Shared visibility.</span></div>
      </header>
      <div className={styles.chapters} role="tablist" aria-label="Explore MTCC digital transformation">
        {chapters.map((label, index) => <button key={label} ref={element => { tabs.current[index] = element; }} id={`digital-tab-${index}`} type="button" role="tab" aria-selected={chapter === index} aria-controls={`digital-panel-${index}`} tabIndex={chapter === index ? 0 : -1} onClick={() => setChapter(index)} onKeyDown={event => keyboardSelection(event, index, chapters.length, next => { setChapter(next); tabs.current[next]?.focus(); })}><span className={styles.chapterNumber}>0{index + 1}</span><span>{label}</span><ArrowDownRight size={19} aria-hidden="true" /></button>)}
      </div>
      <div id="digital-panel-0" role="tabpanel" aria-labelledby="digital-tab-0" tabIndex={0} hidden={chapter !== 0} className={styles.chapterPanel}>
        <div className={styles.journey}>
          <div className={styles.journeyCopy}><span className={styles.kicker}>MTCC digitalization</span><h3>Better connected.<br /><span>At every level.</span></h3><p>From the way we deliver projects to the way people access our services.</p><ol>{[
            { Icon: Layers3, title: "Digitising core operations", text: "Connecting core operational processes." },
            { Icon: ChartNoAxesCombined, title: "Improving management visibility", text: "Bringing information into clearer view." },
            { Icon: Waypoints, title: "Expanding stakeholder access", text: "Simpler digital channels for the people we serve." },
          ].map(({ Icon, title, text }) => <li key={title}><Icon size={21} strokeWidth={1.5} aria-hidden="true" /><div><strong>{title}</strong><span>{text}</span></div></li>)}</ol></div>
          <div className={styles.ecosystem}>
            <div className={styles.mapLabel}><span><Radio size={14} aria-hidden="true" />Our digital ecosystem</span><span>Explore a system <ArrowDownRight size={15} aria-hidden="true" /></span></div>
            <div className={styles.map}>
              <svg className={styles.connections} viewBox="0 0 600 430" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="300" cy="195" rx="205" ry="132" /><ellipse cx="300" cy="195" rx="126" ry="82" /><path d="M300 195L110 94M300 195L490 94M300 195L110 290M300 195L490 290M300 195V370" /><path className={styles.signal} d="M300 195L110 94M300 195L490 94M300 195L110 290M300 195L490 290M300 195V370" /></svg>
              <div className={styles.hub}><Network size={26} strokeWidth={1.2} aria-hidden="true" /><strong>MTCC</strong><span>Digital journey</span></div>
              {digitalSystems.map(system => { const Icon = systemIcons[system.id]; return <button type="button" key={system.id} className={`${styles.node} ${styles[system.id]}`} onClick={() => explore(system.id)} aria-label={`Explore ${system.name}: ${system.audience}`}><Icon size={19} strokeWidth={1.5} aria-hidden="true" /><span><strong>{system.name}</strong><small>{system.audience}</small></span><ArrowUpRight size={12} aria-hidden="true" /></button>; })}
            </div>
            <p className={styles.mapCaption}>Project delivery <span>·</span> People <span>·</span> Decisions <span>·</span> Access</p>
          </div>
        </div>
        <div className={styles.national}>
          <div className={styles.nationalHeading}><span className={styles.nationalSymbol} aria-hidden="true"><Waypoints size={24} /></span><div><span>Aligned with the national digital direction</span><h4>Maldives 2.0</h4></div><a href="https://digital.gov.mv" target="_blank" rel="noopener noreferrer" aria-label="Maldives 2.0 national digital direction (opens in a new tab)"><ArrowUpRight size={23} aria-hidden="true" /></a></div>
          <p>Supporting a digitally connected Maldives.</p>
          <ul><li><CircleCheck size={16} aria-hidden="true" />Digital services designed around people</li><li><CircleCheck size={16} aria-hidden="true" />Access to services across the islands</li><li><CircleCheck size={16} aria-hidden="true" />Technology-enabled economic development</li></ul>
        </div>
      </div>
      <div id="digital-panel-1" role="tabpanel" aria-labelledby="digital-tab-1" tabIndex={0} hidden={chapter !== 1} className={styles.chapterPanel}><SystemExplorer group="operations" selected={operation} onSelect={setOperation} /></div>
      <div id="digital-panel-2" role="tabpanel" aria-labelledby="digital-tab-2" tabIndex={0} hidden={chapter !== 2} className={styles.chapterPanel}><SystemExplorer group="access" selected={stakeholder} onSelect={setStakeholder} /></div>
      <footer className={styles.footer}><span>Technology with a shared purpose.</span>{chapter < 2 ? <button type="button" onClick={() => { setChapter(chapter + 1); tabs.current[chapter + 1]?.focus({ preventScroll: true }); }}>{chapter === 0 ? "Explore smarter operations" : "Explore stakeholder services"}<ArrowRight size={17} aria-hidden="true" /></button> : <button type="button" onClick={() => { setChapter(0); tabs.current[0]?.focus({ preventScroll: true }); }}>Back to the digital journey<ArrowRight size={17} aria-hidden="true" /></button>}</footer>
    </div>
  </section>;
}
