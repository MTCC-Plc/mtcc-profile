type Project = { name: string; mvr: number; usd: number; index: number; category: string };

export function FlagshipProjectCard({ project, index, total, active }: { project: Project; index: number; total: number; active: boolean }) {
  return <article className={`flagship-card ${index === 0 ? "flagship-featured" : ""}`} data-active={active} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${total}: ${project.name}`}>
    <div className="flagship-project-copy"><div className="flagship-card-top"><span>{String(project.index + 1).padStart(2, "0")}</span><span>{project.category}</span></div><h3>{project.name}</h3></div>
    <div className="flagship-card-accent" aria-hidden="true"><span /></div>
    <dl className="flagship-amounts">{[["MVR", project.mvr], ["USD", project.usd]].map(([currency, value]) => <div key={currency}><dt>{currency} <span>million</span></dt><dd><span className="sr-only">{value}</span><span aria-hidden="true" data-project-figure={value}>{value}</span></dd></div>)}</dl>
  </article>;
}
