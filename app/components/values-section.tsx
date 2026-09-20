import Image from "./site-image";
import type { ProfileSection } from "../types/profile";

export function ValuesSection({ section }: { section: Extract<ProfileSection, { type: "values" }> }) {
  return (
    <section id={section.id} className="purpose-section" aria-labelledby={`${section.id}-title`}>
      <div className="shell purpose-intro">
        <p className="eyebrow">Our direction. Our drive.</p>
        <h2 id={`${section.id}-title`}>{section.title}</h2>
      </div>
      <div className="purpose-stage">
        {[
          { label: "Our vision", text: section.vision, image: "/assets/vision-scene.06060cfe.webp" },
          { label: "Our mission", text: section.mission, image: "/assets/mission-scene.6293f9c7.webp" },
        ].map((chapter, index) => <article className="purpose-scene" key={chapter.label}>
          <div className="purpose-backdrop" aria-hidden="true"><Image src={chapter.image} alt="" fill sizes="100vw" /></div>
          <div className="purpose-shade" />
          <div className="shell purpose-statement"><p className="eyebrow">{chapter.label}</p><h3>{chapter.text}<span className="purpose-period">.</span></h3><span className="purpose-index" aria-hidden="true">0{index + 1} / 02</span></div>
        </article>)}
        <div className="purpose-chapters" aria-hidden="true"><span>01 — Vision</span><div><i /></div><span>02 — Mission</span></div>
      </div>
      <div id={`${section.id}-values`} className="shell purpose-values">
        <div className="purpose-values-heading"><p className="eyebrow">Our core values</p><h3>What moves us.</h3></div>
        <p className="move-scroll-hint">Swipe or scroll to explore M, O, V and E <span aria-hidden="true">→</span></p>
        <div className="move-values" role="region" aria-label="Our MOVE values" tabIndex={0}>
          {section.values.map((value, index) => <article key={value.letter} aria-labelledby={`${section.id}-value-${value.letter}`}>
            <span className="move-letter" aria-hidden="true">{value.letter}</span>
            <div className="move-description"><span className="move-number" aria-hidden="true">0{index + 1} / 0{section.values.length}</span><h4 id={`${section.id}-value-${value.letter}`}>{value.title}</h4><p>{value.text}</p><span className="move-rule" aria-hidden="true" /></div>
          </article>)}
        </div>
      </div>
    </section>
  );
}
