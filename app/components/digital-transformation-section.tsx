"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CircleCheck } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { digitalChapters } from "../data/digital-chapters";
import { DigitalCapabilityVisual } from "./digital-capability-visual";
import styles from "./digital-transformation-section.module.css";

export function DigitalTransformationSection() {
  const [chapter, setChapter] = useState(0);
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

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

  function selectWithKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = digitalChapters.length;
    const next = event.key === "ArrowRight" ? (index + 1) % count
      : event.key === "ArrowLeft" ? (index - 1 + count) % count
      : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setChapter(next);
    tabs.current[next]?.focus({ preventScroll: true });
  }

  return <section ref={root} id="digital-transformation" className={styles.section} aria-labelledby="digital-title">
    <header className={`shell ${styles.heading}`}>
      <p className={styles.eyebrow}><span aria-hidden="true" />Digital transformation</p>
      <h2 id="digital-title"><span>Transforming MTCC for a</span><span>digitally connected</span><span>Maldives<b>.</b></span></h2>
      <p className={styles.intro}>MTCC’s digital transformation brings together enterprise capabilities, operational improvements and accessible services to support its long-term development.</p>
      <p className={styles.alignment}><CircleCheck size={20} aria-hidden="true" />Aligned with the direction of Maldives 2.0</p>
    </header>

    <div className={styles.tabBar}>
      <div className={`shell ${styles.chapters}`} role="tablist" aria-label="Explore MTCC digital transformation">
        {digitalChapters.map((item, index) => <button
          key={item.id}
          ref={element => { tabs.current[index] = element; }}
          id={`digital-tab-${index}`}
          type="button"
          role="tab"
          aria-selected={chapter === index}
          aria-controls={`digital-panel-${index}`}
          tabIndex={chapter === index ? 0 : -1}
          onClick={() => setChapter(index)}
          onKeyDown={event => selectWithKeyboard(event, index)}
        ><span className={styles.chapterNumber}>0{index + 1}</span><span>{item.label}</span></button>)}
      </div>
    </div>

    {digitalChapters.map((item, index) => <div
      key={item.id}
      id={`digital-panel-${index}`}
      role="tabpanel"
      aria-labelledby={`digital-tab-${index}`}
      tabIndex={0}
      hidden={chapter !== index}
      className={`${styles.chapterPanel} ${item.id === "operations" ? styles.operations : ""}`}
    >
      <div className={`shell ${styles.chapterLayout}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>0{index + 1} — {item.eyebrow}</p>
          <h3>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>
          <dl className={styles.capabilities}>{item.capabilities.map(capability => <div key={capability.title}><dt>{capability.title}</dt><dd>{capability.description}</dd></div>)}</dl>
          <p className={styles.platforms}>Selected platforms: {item.platforms.join(" · ")}</p>
          <p className={styles.outcome}><span aria-hidden="true" />{item.outcome}</p>
        </div>
        <div className={styles.visual}><DigitalCapabilityVisual variant={item.id} /></div>
      </div>
    </div>)}
  </section>;
}
