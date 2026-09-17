"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type Project = { name: string; mvr: number; usd: number; index: number; category: string };

export function FlagshipProjectCard({ project, index, total, active }: { project: Project; index: number; total: number; active: boolean }) {
  const card = useRef<HTMLElement>(null);
  const animatedProject = useRef<string | null>(null);
  useLayoutEffect(() => {
    const element = card.current;
    if (!element || !active || animatedProject.current === project.name) return;
    const figures = Array.from(element.querySelectorAll<HTMLElement>("[data-project-figure]"));
    const restore = () => figures.forEach(figure => { figure.textContent = figure.dataset.projectFigure!; });
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", context => {
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        animatedProject.current = project.name;
        context.add(() => {
          const animation = gsap.timeline({ defaults: { ease: "power3.out" } });
          animation.fromTo(element.querySelector(".flagship-card-accent span"), { scaleX: 0 }, { scaleX: 1, duration: .85 }, .05);
          figures.forEach((figure, order) => {
            const original = figure.dataset.projectFigure!;
            const decimals = original.split(".")[1]?.length ?? 0;
            const format = new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: false });
            const counter = { value: 0 };
            figure.textContent = format.format(0);
            animation.to(counter, { value: Number(original), duration: .9,
              onUpdate: () => { figure.textContent = format.format(counter.value); },
              onComplete: () => { figure.textContent = original; },
            }, .08 + order * .08);
          });
        });
      }, { threshold: .25 });
      observer.observe(element);
      return () => { observer.disconnect(); restore(); };
    });
    return () => { media.revert(); restore(); };
  }, [active, project.name, project.mvr, project.usd]);

  return <article ref={card} className={`flagship-card ${index === 0 ? "flagship-featured" : ""}`} data-active={active} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${total}: ${project.name}`}>
    <div className="flagship-project-copy"><div className="flagship-card-top"><span>{String(project.index + 1).padStart(2, "0")}</span><span>{project.category}</span></div><h3>{project.name}</h3></div>
    <div className="flagship-card-accent" aria-hidden="true"><span /></div>
    <dl className="flagship-amounts">{[["MVR", project.mvr], ["USD", project.usd]].map(([currency, value]) => <div key={currency}><dt>{currency} <span>million</span></dt><dd><span className="sr-only">{value}</span><span aria-hidden="true" data-project-figure={value}>{value}</span></dd></div>)}</dl>
  </article>;
}
