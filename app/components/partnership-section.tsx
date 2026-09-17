"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProfileSection } from "../types/profile";

const emphasis = /unmatched nationwide presence|proven execution capability|sustainable value|stronger, more connected nation/g;

export function PartnershipSection({ section }: { section: Extract<ProfileSection, { type: "content" }> }) {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1000px) and (min-height: 700px)" }, context => {
      const element = stage.current;
      if (!context.conditions?.motion || !element) return;
      const words = Array.from(element.querySelectorAll<HTMLElement>(".partner-word"));
      const pinned = Boolean(context.conditions.desktop);
      gsap.set(words, {color: "#8297a6"});
      gsap.set(element.querySelector(".partner-progress span"), {scaleX: 0});
      const timeline = gsap.timeline({scrollTrigger: {
        trigger: element, start: pinned ? "top 90px" : "top 75%",
        end: pinned ? () => `+=${window.innerHeight * 2.2}` : "bottom 60%",
        pin: pinned, scrub: .3, invalidateOnRefresh: true,
      }});
      timeline.to(words, {
        color: (_, target: HTMLElement) => target.dataset.emphasis === "true" ? "#70dbe5" : "#f5f9fc",
        stagger: .07, duration: .15, ease: "none",
      }, 0);
      timeline.to(element.querySelector(".partner-progress span"), {scaleX: 1, duration: timeline.duration(), ease: "none"}, 0);
      const frame = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
      return () => cancelAnimationFrame(frame);
    });
    return () => media.revert();
  }, []);
  return <section id={section.id} className="partner-section" aria-labelledby="partner-title"><div className="shell">
    <header className="partner-heading"><p className="eyebrow">{section.eyebrow}</p><h2 id="partner-title">{section.title}<span>.</span></h2></header>
    <div ref={stage} className="partner-reading-stage">
      {section.blocks.filter(block => block.type === "quote").map((block,index) => {
        const ranges=Array.from(block.text.matchAll(emphasis), match=>({start:match.index!,end:match.index!+match[0].length}));
        let offset=0;
        return <div key={index}><p className="sr-only">{block.text}</p><p className="partner-statement" aria-hidden="true">{block.text.split(/(\s+)/).map((word,i) => {
          const start=offset;offset+=word.length;
          if (/^\s+$/.test(word)) return word;
          return <span className="partner-word" data-emphasis={ranges.some(range=>start>=range.start&&start<range.end) ? "true" : undefined} key={i}>{word}</span>;
        })}</p></div>;
      })}
      <div className="partner-progress" aria-hidden="true"><span /></div>
      <p className="partner-signature">Maldives Transport &amp; Contracting Company</p>
    </div>
  </div></section>;
}
