"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, ContactRound, Mail, Phone, X } from "lucide-react";
import Image from "./site-image";
import { TeamPortrait } from "./team-portrait";
import type { ProfileSection } from "../types/profile";
import styles from "./organisation-section.module.css";

type Leadership = Extract<ProfileSection, { type: "leadership" }>;
type Person = Leadership["people"][number];
type TeamView = "organisation" | "all";
const businessDivisions = new Set(["Transport Services", "Engineering & Repair", "Trading", "Construction & Dredging Division"]);
// Named exceptions for the executive committee whose title does not carry "Managing Director" or "Operating Officer".
const excoOverrides = new Set(["Ibrahim Latheef"]);

export function OrganisationSection({ section }: { section: Leadership }) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [view, setView] = useState<TeamView>("organisation");
  const selectedTrigger = useRef<HTMLButtonElement>(null);
  const detail = useRef<HTMLElement>(null);
  const selected = section.people.find(person => person.name === selectedName);
  const management = section.people.filter(person => person.group !== "senior-management" && person.group !== "special-advisor");
  const seniorManagement = section.people.filter(person => person.group === "senior-management");
  const specialAdvisors = section.people.filter(person => person.group === "special-advisor");
  const managing = management.find(person => person.role === "Managing Director")!;
  const executives = management.filter(person => (/Managing Director|Operating Officer/.test(person.role) || excoOverrides.has(person.name)) && person !== managing);
  const risk = management.find(person => person.division === "Risk Management");
  const governance = management.filter(person => /Secretary|Auditor/.test(person.role));
  const business = management.filter(person => businessDivisions.has(person.division ?? ""));
  const corporate = management.filter(person => person !== managing && !executives.includes(person) && !governance.includes(person) && person !== risk && !business.includes(person) && (person.division || person.role === "Chief Financial Officer"));
  const otherManagement = management.filter(person => person !== managing && !executives.includes(person) && !governance.includes(person) && person !== risk && !business.includes(person) && !corporate.includes(person));
  const category = selected && (selected.group === "senior-management" ? "Senior management" : selected.group === "special-advisor" ? "Special advisors" : selected === managing || executives.includes(selected) ? "Executive leadership" : business.includes(selected) ? "Business divisions" : corporate.includes(selected) ? "Corporate services" : governance.includes(selected) || selected === risk ? "Governance & risk" : "Executive Management");
  const directoryGroups = [{ title: "Executive Management", people: management }, { title: "Senior Management", people: seniorManagement }, { title: "Special Advisors", people: specialAdvisors }];

  useEffect(() => {
    let frame = 0;
    const views: Record<string, TeamView> = {
      [section.id]: "organisation",
      "management-team": "all",
    };
    const viewForHash = (hash: string) => {
      let id: string;
      try { id = decodeURIComponent(hash.replace(/^#/, "")); } catch { return; }
      return Object.hasOwn(views, id) ? { id, view: views[id] } : undefined;
    };
    const followHash = (hash: string) => {
      const destination = viewForHash(hash);
      if (!destination) return;
      // Mount the requested directory before the drawer restores and scrolls the page.
      flushSync(() => {
        setView(destination.view);
        setSelectedName(null);
      });
      selectedTrigger.current = null;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const target = document.getElementById(destination.id);
        if (!target) return;
        target.scrollIntoView({ behavior: "instant", block: "start" });
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      });
    };
    const onHashChange = () => followHash(window.location.hash);
    const onLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search || !viewForHash(url.hash)) return;
      event.preventDefault();
      if (window.location.hash !== url.hash) window.history.pushState(null, "", url.hash);
      followHash(url.hash);
    };
    frame = requestAnimationFrame(onHashChange);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    document.addEventListener("click", onLink, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
      document.removeEventListener("click", onLink, true);
    };
  }, [section.id]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const panel = detail.current;
      if (!selectedName || !panel) return;
      panel.scrollTop = 0;
      const bounds = panel.getBoundingClientRect();
      if (bounds.bottom > window.innerHeight - 16 || bounds.top < 80) panel.scrollIntoView({ block: "nearest", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [view, selectedName]);

  function changeView(next: TeamView) {
    setView(next);
    setSelectedName(null);
  }

  function node(person: Person, label?: string) {
    return <button key={person.name} type="button" className="org-chart-node" aria-pressed={selectedName === person.name} aria-expanded={selectedName === person.name} aria-controls="org-person-detail" onClick={event => { selectedTrigger.current = event.currentTarget; setSelectedName(current => current === person.name ? null : person.name); }}>
      <strong>{label || person.division || person.role}</strong>
    </button>;
  }

  return <section id={section.id} className="organisation-section" aria-labelledby="organisation-title"><div className="shell">
    <header className="organisation-heading"><p className="eyebrow">Management team</p><h2 id="organisation-title">{section.title}</h2><p>Meet the people leading MTCC. Select a role in the organisation chart or explore the management team to view a business card and contact details.</p></header>
    <div className="organisation-toolbar"><span>{section.people.length} people. Shared purpose.</span><div className={`organisation-view ${styles.viewSwitch}`} role="group" aria-label="Team view">
      <button type="button" aria-pressed={view === "organisation"} onClick={() => changeView("organisation")}>Organisation</button>
      <button type="button" aria-pressed={view === "all"} onClick={() => changeView("all")}>Team</button>
    </div></div>
    <div className={styles.layout}>
      {view === "organisation" ? <div className={`org-chart ${styles.chart}`} role="group" aria-label="Organisation chart">
        <div className="org-board"><Building2 size={21} aria-hidden="true" /><strong>Board of Directors</strong></div>
        <div className="org-top-level">
          <div className="org-group org-risk" role="group" aria-labelledby="org-risk-title"><header className="org-group-heading"><h3 id="org-risk-title">Risk management</h3></header>{risk && node(risk, risk.role)}</div>
          <div className="org-managing">{node(managing, "Managing Director & CEO")}</div>
          <div className="org-group org-governance" role="group" aria-labelledby="org-governance-title"><header className="org-group-heading"><h3 id="org-governance-title">Governance</h3><span>{governance.length} functions</span></header><div className="org-group-content">{governance.map(person => node(person, /Auditor/.test(person.role) ? "Internal Audit" : person.role))}</div></div>
        </div>
        <div className="org-group org-executive-group" role="group" aria-labelledby="org-executives-title"><header className="org-group-heading"><h3 id="org-executives-title">Executive leadership</h3><span>{executives.length} leaders</span></header><div className="org-executives">{executives.map(person => node(person, person.role))}</div></div>
        <div className="org-divisions">
          <div className="org-group org-division-group org-business" role="group" aria-labelledby="org-business-title"><header className="org-group-heading"><h3 id="org-business-title">Business divisions</h3><span>{business.length} divisions</span></header><div>{business.map(person => node(person, person.division?.replace(" Division", "")))}</div></div>
          <div className="org-group org-division-group org-corporate" role="group" aria-labelledby="org-corporate-title"><header className="org-group-heading"><h3 id="org-corporate-title">Corporate services</h3><span>{corporate.length} divisions</span></header><div>{corporate.map(person => node(person, person.role === "Chief Financial Officer" ? "Finance & Accounts" : person.division))}</div></div>
        </div>
        {otherManagement.length > 0 && <div className={`org-group ${styles.additionalManagement}`} role="group" aria-labelledby="org-management-title"><header className="org-group-heading"><h3 id="org-management-title">Management</h3></header><div className={styles.additionalNodes}>{otherManagement.map(person => node(person, person.role))}</div></div>}
      </div> : <div id="management-team" className={styles.directory} role="region" aria-label="Management team directory" tabIndex={-1}>
        {directoryGroups.filter(group => group.people.length > 0).map(group => <section key={group.title} className={styles.directoryGroup} aria-label={group.title}>
          <header><h3>{group.title}</h3><p>{group.people.length} people · Select a person for contact details.</p></header>
          <div className={styles.directoryGrid}>{group.people.map(person => <article className="organisation-person" key={person.name}>
            <button type="button" className={styles.personButton} aria-label={`View contact details for ${person.name}`} aria-pressed={selectedName === person.name} aria-expanded={selectedName === person.name} aria-controls="org-person-detail" onClick={event => { selectedTrigger.current = event.currentTarget; setSelectedName(current => current === person.name ? null : person.name); }}>
              <div className="organisation-portrait"><TeamPortrait src={person.image} name={person.name} /></div>
              <div className="organisation-person-copy"><h4>{person.name}</h4><p>{person.role}</p>{person.division && <span>{person.division}</span>}<small>View contact details</small></div>
            </button>
          </article>)}</div>
        </section>)}
      </div>}
      <aside ref={detail} className={styles.sidebar} id="org-person-detail" aria-label="Employee business card" aria-live="polite" aria-atomic="true">
        {selected ? <article className={styles.card}>
          <header className={styles.cardHeader}>
            <Image src="/assets/mtcc-logo.png" alt="MTCC" width={70} height={47} />
            <button type="button" className={styles.close} aria-label="Close employee business card" onClick={() => { setSelectedName(null); selectedTrigger.current?.focus({ preventScroll: true }); }}><X size={18} aria-hidden="true" /></button>
          </header>
          <div className={styles.cardBody}>
            <div className={styles.portrait} key={selected.name}><TeamPortrait src={selected.image} name={selected.name} /></div>
            <p className={styles.category}>{category}</p>
            <h3>{selected.name}</h3>
            <p className={styles.role}>{selected.role}</p>
            {selected.division && <p className={styles.division}>{selected.division}</p>}
            {(selected.email || selected.phone) && <div className={styles.contacts}>
              {selected.email && <a href={`mailto:${selected.email}`} aria-label={`Email ${selected.name}: ${selected.email}`}><Mail size={16} aria-hidden="true" /><span>{selected.email}</span></a>}
              {selected.phone && <a href={`tel:+960${selected.phone}`} aria-label={`Call ${selected.name}: ${selected.phone}`}><Phone size={16} aria-hidden="true" /><span>{selected.phone}</span></a>}
            </div>}
          </div>
          <footer className={styles.cardFooter}>Maldives Transport &amp; Contracting Company</footer>
        </article> : <div className={styles.placeholder}>
          <ContactRound size={30} strokeWidth={1.4} aria-hidden="true" /><h3>{view === "organisation" ? "Select a role" : "Select a person"}</h3><p>Choose a card to view their role and contact details.</p>
        </div>}
      </aside>
    </div>
    {section.team && <div id={section.team.id} className="organisation-team">
      <div className="organisation-team-heading"><p className="eyebrow">{section.team.eyebrow}</p><h3>{section.team.title}</h3></div>
      <div className="organisation-team-story"><div className="organisation-team-images">{section.team.images.map((src, index) => <Image key={src} src={src} alt={index === 0 ? "MTCC engineering team at work" : "MTCC specialist at work"} width={600} height={500} sizes="(max-width: 760px) 48vw, 30vw" />)}</div><div><p>{section.team.intro}</p>{section.team.body?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
    </div>}
  </div></section>;
}
