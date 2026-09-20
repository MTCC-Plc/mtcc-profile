"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, ShieldCheck } from "lucide-react";
import Image from "./site-image";
import { TeamPortrait } from "./team-portrait";
import type { ProfileSection } from "../types/profile";

type Leadership = Extract<ProfileSection, { type: "leadership" }>;
type Person = Leadership["people"][number];
const businessDivisions = new Set(["Transport Services", "Engineering & Repair", "Trading", "Construction & Dredging Division"]);

export function OrganisationSection({ section }: { section: Leadership }) {
  const [selectedName, setSelectedName] = useState(section.people[0].name);
  const [all, setAll] = useState(false);
  const selected = section.people.find(person => person.name === selectedName)!;
  const managing = section.people.find(person => person.role === "Managing Director")!;
  const executives = section.people.filter(person => /Managing Director|Operating Officer/.test(person.role) && person !== managing);
  const risk = section.people.find(person => person.division === "Risk Management");
  const governance = section.people.filter(person => /Secretary|Auditor/.test(person.role));
  const advisor = section.people.find(person => /Advisor/.test(person.role));
  const business = section.people.filter(person => businessDivisions.has(person.division ?? ""));
  const corporate = section.people.filter(person => person !== managing && !executives.includes(person) && !governance.includes(person) && person !== risk && person !== advisor && !business.includes(person));
  const category = selected === managing || executives.includes(selected) ? "Executive leadership" : business.includes(selected) ? "Business divisions" : corporate.includes(selected) ? "Corporate services" : "Governance & advisory";
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [all]);

  function node(person: Person, label?: string) {
    return <button key={person.name} type="button" className="org-chart-node" aria-pressed={selectedName === person.name} aria-controls="org-person-detail" onClick={() => setSelectedName(person.name)}>
      <strong>{label || person.division || person.role}</strong><span>{person.name}</span>
    </button>;
  }

  return <section id={section.id} className="organisation-section" aria-labelledby="organisation-title"><div className="shell">
    <header className="organisation-heading"><p className="eyebrow">Management team</p><h2 id="organisation-title">{section.title}</h2><p>Four business divisions earn the revenue. Seven corporate service divisions keep them running. Tap any box to see who leads it.</p></header>
    <div className="organisation-toolbar"><span>{section.people.length} people. Shared purpose.</span><div className="organisation-view" role="group" aria-label="Team view"><button type="button" aria-pressed={!all} onClick={() => setAll(false)}>Organisation</button><button type="button" aria-pressed={all} onClick={() => setAll(true)}>All people</button></div></div>
    {all ? <div className="organisation-explorer organisation-all"><div className="organisation-people"><header><p className="eyebrow">The full management team</p><h3>Meet the team.</h3></header><div className="organisation-grid">{section.people.map(person => <article className="organisation-person" key={person.name}>
      <div className="organisation-portrait"><TeamPortrait src={person.image} name={person.name} /></div>
      <div className="organisation-person-copy"><h4>{person.name}</h4><p>{person.role}</p>{person.division && <span>{person.division}</span>}</div>
    </article>)}</div></div></div> : <div className="org-chart" role="group" aria-label="Organisation chart">
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
      {advisor && <div className="org-group org-advisory" role="group" aria-labelledby="org-advisory-title"><header className="org-group-heading"><h3 id="org-advisory-title"><ShieldCheck size={17} aria-hidden="true" />Advisory</h3></header>{node(advisor, advisor.role)}</div>}
      <div className="org-person-detail" id="org-person-detail" aria-live="polite" aria-atomic="true">
        <div className="org-detail-photo" key={selected.image}><TeamPortrait src={selected.image} name={selected.name} /></div>
        <div className="org-detail-copy"><span>{category}</span><h3>{selected.name}</h3><p>{selected.role}{selected.division ? ` · ${selected.division}` : ""}</p></div>
      </div>
    </div>}
    {section.team && <div id={section.team.id} className="organisation-team">
      <div className="organisation-team-heading"><p className="eyebrow">{section.team.eyebrow}</p><h3>{section.team.title}</h3></div>
      <div className="organisation-team-story"><div className="organisation-team-images">{section.team.images.map((src, index) => <Image key={src} src={src} alt={index === 0 ? "MTCC engineering team at work" : "MTCC specialist at work"} width={600} height={500} sizes="(max-width: 760px) 48vw, 30vw" />)}</div><div><p>{section.team.intro}</p>{section.team.body?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
    </div>}
  </div></section>;
}
