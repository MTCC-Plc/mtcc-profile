"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Building2, Compass, ShieldCheck, Users } from "lucide-react";
import Image from "./site-image";
import type { ProfileSection } from "../types/profile";

type Leadership = Extract<ProfileSection, { type: "leadership" }>;
type Person = Leadership["people"][number];
const businessDivisions = new Set(["Transport Services", "Engineering & Repair", "Trading", "Construction & Dredging Division"]);
function groupFor(person: Person) {
  if (/Managing Director|Operating Officer/.test(person.role)) return "leadership";
  if (/Secretary|Auditor|Advisor/.test(person.role)) return "governance";
  return businessDivisions.has(person.division ?? "") ? "business" : "corporate";
}
const groups = [
  { id: "leadership", title: "Executive leadership", description: "Managing directors and operations leadership.", icon: Compass },
  { id: "business", title: "Business divisions", description: "Construction, transport, engineering and trading.", icon: Building2 },
  { id: "corporate", title: "Corporate functions", description: "Finance, people, technology and business support.", icon: Users },
  { id: "governance", title: "Governance & advisory", description: "Company secretarial, internal audit and advisory roles.", icon: ShieldCheck },
];

export function OrganisationSection({ section }: { section: Leadership }) {
  const [active, setActive] = useState("leadership");
  const [all, setAll] = useState(false);
  const selected = groups.find(group => group.id === active)!;
  const people = all ? section.people : section.people.filter(person => groupFor(person) === active);
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [active, all]);

  return <section id={section.id} className="organisation-section" aria-labelledby="organisation-title"><div className="shell">
    <header className="organisation-heading"><p className="eyebrow">Management team</p><h2 id="organisation-title">Our people.<br /><span>One connected team.</span></h2><p>Discover the people leading our businesses and the functions that support them.</p></header>
    <div className="organisation-toolbar"><span>{section.people.length} people. Shared purpose.</span><div className="organisation-view" role="group" aria-label="Team view"><button type="button" aria-pressed={!all} onClick={() => setAll(false)}>By function</button><button type="button" aria-pressed={all} onClick={() => setAll(true)}>All people</button></div></div>
    <div className={`organisation-explorer${all ? " organisation-all" : ""}`}>
      {!all && <nav className="organisation-functions" aria-label="Organisation functions">{groups.map(group => {
        const Icon = group.icon;
        return <button type="button" key={group.id} aria-pressed={active === group.id} aria-controls="organisation-people" onClick={() => setActive(group.id)}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><span><strong>{group.title}</strong><small>{section.people.filter(person => groupFor(person) === group.id).length} people</small></span><ArrowUpRight size={18} aria-hidden="true" /></button>;
      })}</nav>}
      <div id="organisation-people" className="organisation-people" aria-labelledby="organisation-group-title">
        <header><p className="eyebrow">{all ? "The full management team" : "People & responsibilities"}</p><h3 id="organisation-group-title">{all ? "Meet the team." : selected.title}</h3><p>{all ? "The people behind our progress, across every function." : selected.description}</p></header>
        <div className="organisation-grid" key={all ? "all" : active}>{people.map(person => <article className="organisation-person" key={person.name}>
          <div className="organisation-portrait"><Image src={person.image} alt={person.name} width={300} height={336} sizes="(max-width: 600px) 44vw, (max-width: 1000px) 28vw, 240px" /></div>
          <div className="organisation-person-copy"><h4>{person.name}</h4><p>{person.role}</p>{person.division && <span>{person.division}</span>}</div>
        </article>)}</div>
      </div>
    </div>
    {section.team && <div id={section.team.id} className="organisation-team">
      <div className="organisation-team-heading"><p className="eyebrow">{section.team.eyebrow}</p><h3>{section.team.title}</h3></div>
      <div className="organisation-team-story"><div className="organisation-team-images">{section.team.images.map((src, index) => <Image key={src} src={src} alt={index === 0 ? "MTCC engineering team at work" : "MTCC specialist at work"} width={600} height={500} sizes="(max-width: 760px) 48vw, 30vw" />)}</div><div><p>{section.team.intro}</p>{section.team.body?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
    </div>}
  </div></section>;
}
