"use client";

import { useCurrency } from "./currency-toggle";
import { currencySymbols } from "../../lib/currency";

type Project = { name: string; mvr: number; usd: number; index: number; category: string };

export function FlagshipProjectCard({ project, index, total, active }: { project: Project; index: number; total: number; active: boolean }) {
  const { currency } = useCurrency();
  const value = currency === "MVR" ? project.mvr : project.usd;
  return <article className={`flagship-card ${index === 0 ? "flagship-featured" : ""}`} data-active={active} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${total}: ${project.name}`}>
    <div className="flagship-project-copy"><div className="flagship-card-top"><span>{String(project.index + 1).padStart(2, "0")}</span><span>{project.category}</span></div><h3>{project.name}</h3></div>
    <div className="flagship-card-accent" aria-hidden="true"><span /></div>
    <dl className="flagship-amounts flagship-single-amount"><div><dt>{currencySymbols[currency]} {currency} <span>million</span></dt><dd data-project-figure={value}>{value}</dd></div></dl>
  </article>;
}
