"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Motion enhances the server-rendered content; the static page stays usable without JS. */
export function ScrollExperience({ children, theme }: { children: ReactNode; theme: string }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const page = root.current;
    if (!page) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const select = <T extends HTMLElement>(selector: string) => Array.from(page.querySelectorAll<T>(selector));

    media.add({
      desktop: "(min-width: 1000px) and (min-height: 700px)",
      reduced: "(prefers-reduced-motion: reduce)",
      motion: "(prefers-reduced-motion: no-preference)",
    }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = context.conditions?.desktop;
      if (desktop) page.classList.add("motion-desktop");

      // Establish pinned sections first so later triggers include their scroll space.
      if (desktop) {
        const hero = page.querySelector<HTMLElement>(".profile-hero")!;
        const heroMotion = gsap.timeline({ scrollTrigger: {
          trigger: hero, start: "top top", end: "bottom bottom", scrub: 0.7,
        } });
        heroMotion.to(".hero-image", { scale: 1.17, ease: "none", duration: 1 }, 0)
          .to(".hero-copy, .hero-edition", { y: -65, opacity: 0, duration: 0.45 }, 0.05)
          .to(".hero-shade", { opacity: 0.55, duration: 1 }, 0)
          .to(".hero-scroll-cue", { opacity: 0, duration: 0.2 }, 0)
          .fromTo(".hero-scene-caption", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.5);

        const purpose = page.querySelector<HTMLElement>(".purpose-stage");
        if (purpose) {
          const scenes = Array.from(purpose.querySelectorAll<HTMLElement>(".purpose-scene"));
          gsap.set(scenes[1], { autoAlpha: 0 });
          const story = gsap.timeline({ scrollTrigger: {
            trigger: purpose, start: "top top", end: () => `+=${window.innerHeight * 1.6}`,
            pin: true, scrub: 0.7, invalidateOnRefresh: true,
          } });
          story.to(scenes[0].querySelector("img"), { scale: 1.12, duration: 1.6, ease: "none" }, 0)
            .to(scenes[0].querySelector(".purpose-statement"), { y: -45, opacity: 0, duration: 0.45 }, 0.55)
            .to(scenes[0], { autoAlpha: 0, duration: 0.5 }, 0.75)
            .to(scenes[1], { autoAlpha: 1, duration: 0.5 }, 0.75)
            .from(scenes[1].querySelector(".purpose-statement"), { y: 45, duration: 0.6 }, 0.75)
            .fromTo(scenes[1].querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 1, ease: "none" }, 0.75)
            .fromTo(purpose.querySelector(".purpose-chapters i"), { scaleX: 0 }, { scaleX: 1, duration: 1.75, ease: "none" }, 0);
        }

        const stage = page.querySelector<HTMLElement>(".services-stage");
        if (stage) {
          const cards = select<HTMLElement>(".service-card");
          const chapters = select<HTMLElement>(".service-chapters > span");
          gsap.set(cards.slice(1), { opacity: 0, y: 45 });
          gsap.set(chapters.slice(1), { opacity: 0.35 });
          const services = gsap.timeline({ scrollTrigger: {
            trigger: stage, start: "top 48px", end: () => `+=${(cards.length - 1) * window.innerHeight * 0.95}`,
            pin: true, scrub: 0.65, invalidateOnRefresh: true,
          } });
          cards.forEach((card, index) => {
            if (!index) return;
            const position = index - 0.25;
            services.to(cards[index - 1], { opacity: 0, y: -25, duration: 0.4 }, position)
              .to(card, { opacity: 1, y: 0, duration: 0.55 }, position)
              .fromTo(card.querySelector("img"), { scale: 1.08 }, { scale: 1, duration: 1, ease: "none" }, position)
              .to(chapters[index - 1], { opacity: 0.35, duration: 0.3 }, position)
              .to(chapters[index], { opacity: 1, duration: 0.3 }, position);
          });
          services.fromTo(".service-progress > span", { scaleX: 0 }, { scaleX: 1, duration: services.duration(), ease: "none" }, 0);
        }

        const timeline = page.querySelector<HTMLElement>(".timeline");
        const timelineWindow = page.querySelector<HTMLElement>(".timeline-window");
        if (timeline && timelineWindow) {
          const distance = () => Math.max(0, timeline.scrollWidth - timelineWindow.clientWidth);
          gsap.to(timeline, { x: () => -distance(), ease: "none", scrollTrigger: {
            trigger: ".timeline-section", start: "top top", end: () => `+=${Math.max(distance(), window.innerHeight)}`,
            pin: true, scrub: 0.7, invalidateOnRefresh: true,
          } });
        }
      }

      gsap.fromTo(".reading-progress", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: {
        trigger: page, start: "top top", end: "bottom bottom", scrub: true,
      } });

      const reveals = select<HTMLElement>(".section-heading, .body-copy, blockquote, .purpose-top, .values-grid article, .people-grid .text-link, .metrics-grid article, .portfolio-grid article, .projects-list article, .strategy-grid article, .report-block, .leadership-grid article, .footer-grid > div, .footer-grid address");
      if (!desktop) reveals.push(...select<HTMLElement>(".service-card"));
      reveals.push(...select<HTMLElement>(".purpose-intro, .purpose-values-heading, .move-values article"));
      reveals.push(...select<HTMLElement>(".financial-intro, .financial-position, .financial-chapter"));
      reveals.push(...select<HTMLElement>(".about-heading, .about-year, .about-story, .about-journey-link"));
      reveals.push(...select<HTMLElement>(".portfolio-heading, .sector-card"));
      reveals.push(...select<HTMLElement>(".difference-heading, .difference-subtitle, .difference-card"));
      reveals.push(...select<HTMLElement>(".infra-heading, .infra-capacity, .infra-vessels > div, .infra-firsts, .infra-block-heading, .infra-capability-grid article, .infra-projects dl > div"));
      reveals.push(...select<HTMLElement>(".marine-heading, .marine-block-heading, .marine-capacity-stats > div, .marine-capacity-copy, .marine-service-grid article, .marine-achievements article, .marine-segment-grid > div"));
      reveals.push(...select<HTMLElement>(".esg-heading, .esg-investment, .esg-block-heading, .esg-initiative"));
      reveals.push(...select<HTMLElement>(".growth-heading, .growth-card"));
      reveals.push(...select<HTMLElement>(".trading-intro > div:first-child, .trading-story, .trading-block-heading, .trading-brand-grid article, .trading-revenue-table"));
      reveals.push(...select<HTMLElement>(".transport-hero-copy, .transport-story, .transport-network-stat, .transport-block-heading, .transport-fleet-card, .transport-passenger-grid > div, .transport-passenger-total"));
      reveals.push(...select<HTMLElement>(".transport-opening-copy, .transport-opening-caption, .transport-total-feature"));
      if (!desktop) reveals.push(...select<HTMLElement>(".purpose-statement"));
      reveals.forEach((element) => {
        gsap.from(element, { y: desktop ? 38 : 18, opacity: 0, duration: 0.85, ease: "power2.out", scrollTrigger: {
          trigger: element, start: "top 94%", once: true,
        } });
      });

      if (desktop) {
        select<HTMLElement>(".story-visual, .people-images > div, .transport-hero-image, .about-landscape, .trading-product-image").forEach((visual) => {
          gsap.fromTo(visual.querySelector("img"), { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: {
            trigger: visual, start: "top bottom", end: "bottom top", scrub: 0.8,
          } });
        });
      }

      const counters = select<HTMLElement>("[data-count]");
      counters.forEach((element) => {
        const original = element.dataset.count!;
        const match = original.match(/^(.*?)([\d,]+(?:\.\d+)?)(.*)$/);
        if (!match) return;
        const [, prefix, number, suffix] = match;
        const decimals = number.split(".")[1]?.length ?? 0;
        const counter = { value: 0 };
        gsap.to(counter, { value: Number(number.replaceAll(",", "")), duration: 1.6, ease: "power2.out", scrollTrigger: {
          trigger: element, start: "top 96%", once: true,
        }, onUpdate: () => {
          element.textContent = prefix + counter.value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: number.includes(",") }) + suffix;
        }, onComplete: () => { element.textContent = original; } });
      });

      select<HTMLElement>(".bar-track span").forEach((bar) => {
        gsap.from(bar, { scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power2.out", scrollTrigger: {
          trigger: bar, start: "top 96%", once: true,
        } });
      });

      return () => {
        page.classList.remove("motion-desktop");
        counters.forEach((element) => { element.textContent = element.dataset.count!; });
      };
    }, page);

    const refresh = () => ScrollTrigger.refresh();
    page.addEventListener("toggle", refresh, true);
    const pendingImages = select<HTMLImageElement>("img").filter((image) => !image.complete);
    pendingImages.forEach((image) => image.addEventListener("load", refresh, { once: true }));
    const frame = requestAnimationFrame(refresh);
    return () => {
      cancelAnimationFrame(frame);
      pendingImages.forEach((image) => image.removeEventListener("load", refresh));
      page.removeEventListener("toggle", refresh, true);
      media.revert();
    };
  }, []);

  return <div ref={root} id="top" className={`profile-page theme-${theme}`}><div className="reading-progress" aria-hidden="true" />{children}</div>;
}
