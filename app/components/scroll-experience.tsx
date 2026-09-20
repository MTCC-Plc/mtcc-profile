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
      tall: "(min-height: 600px)",
      reduced: "(prefers-reduced-motion: reduce)",
      motion: "(prefers-reduced-motion: no-preference)",
    }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = context.conditions?.desktop;
      const pinPurpose = Boolean(desktop || context.conditions?.tall);
      let mobileObserver: IntersectionObserver | undefined;
      if (desktop) page.classList.add("motion-desktop");

      const purpose = page.querySelector<HTMLElement>(".purpose-stage");
      if (purpose && pinPurpose) {
        page.classList.add("motion-purpose");
        const scenes = Array.from(purpose.querySelectorAll<HTMLElement>(".purpose-scene"));
        gsap.set(scenes[1], { autoAlpha: 0 });
        const story = gsap.timeline({ scrollTrigger: {
          trigger: purpose, start: () => desktop ? "top top" : `top ${page.querySelector(".site-header")?.getBoundingClientRect().height ?? 64}px`, end: () => `+=${window.innerHeight * (desktop ? 1.6 : 1.45)}`,
          pin: true, scrub: desktop ? 0.7 : 0.4, invalidateOnRefresh: true,
        } });
        story.to(scenes[0].querySelector("img"), { scale: desktop ? 1.12 : 1.06, duration: 1.6, ease: "none" }, 0)
          .to(scenes[0].querySelector(".purpose-statement"), { y: desktop ? -45 : -20, opacity: 0, duration: 0.45 }, 0.55)
          .to(scenes[0], { autoAlpha: 0, duration: 0.5 }, 0.75)
          .to(scenes[1], { autoAlpha: 1, duration: 0.5 }, 0.75)
          .from(scenes[1].querySelector(".purpose-statement"), { y: desktop ? 45 : 20, duration: 0.6 }, 0.75)
          .fromTo(scenes[1].querySelector("img"), { scale: desktop ? 1.12 : 1.06 }, { scale: 1, duration: 1, ease: "none" }, 0.75)
          .fromTo(purpose.querySelector(".purpose-chapters i"), { scaleX: 0 }, { scaleX: 1, duration: 1.75, ease: "none" }, 0);
      }

      const panorama = page.querySelector<HTMLElement>(".company-hero-panorama");
      if (panorama) {
        gsap.fromTo(panorama.querySelector("img"), { scale: desktop ? 1.1 : 1.04 }, { scale: 1, ease: "none", scrollTrigger: {
          trigger: panorama, start: "top bottom", end: "bottom top", scrub: .5,
        } });
      }
      const aboutVisual = page.querySelector<HTMLElement>(".about-editorial-visual img");
      if (aboutVisual) gsap.fromTo(aboutVisual, { scale: desktop ? 1.08 : 1.035 }, { scale: 1, ease: "none", scrollTrigger: {
        trigger: ".about-editorial-visual", start: "top bottom", end: "bottom 25%", scrub: .5,
      } });
      select<HTMLElement>(".about-reveal-line").forEach(line => gsap.fromTo(line, { color: "#778b99" }, { color: "#102b3b", ease: "none", scrollTrigger: {
        trigger: line, start: "top 90%", end: "top 55%", scrub: .35,
      } }));

      // Establish pinned sections first so later triggers include their scroll space.
      if (desktop) {
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

      }

      gsap.fromTo(".reading-progress", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: {
        trigger: page, start: "top top", end: "bottom bottom", scrub: true,
      } });

      const values = page.querySelector<HTMLElement>(".purpose-values");
      if (values) {
        values.classList.add("values-light-active");
        values.querySelectorAll<HTMLElement>(".move-values article").forEach(passage => {
          const letter = passage.querySelector(".move-letter");
          const description = passage.querySelectorAll(".move-number, h4, p");
          const rule = passage.querySelector(".move-rule");
          const reveal = gsap.timeline({ scrollTrigger: {
            trigger: passage, start: "top 90%", end: "center 52%", scrub: .65,
          } });
          reveal.fromTo(letter, { x: desktop ? -38 : -18, y: 22, scale: .88, opacity: .3 },
            { x: 0, y: 0, scale: 1, opacity: 1, duration: 1, ease: "power2.out" }, 0);
          reveal.fromTo(description, { y: 24, opacity: .15 },
            { y: 0, opacity: 1, duration: .65, stagger: .12, ease: "power2.out" }, .18);
          reveal.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: .8, ease: "power2.out" }, .3);
          gsap.fromTo(passage, { "--values-light-x": "100%" }, { "--values-light-x": "0%", ease: "none", scrollTrigger: {
            trigger: passage, start: "top 85%", end: "bottom 20%", scrub: .5,
          } });
        });
      }

      const reveals = select<HTMLElement>(".section-heading, .body-copy, blockquote, .purpose-top, .values-grid article, .people-grid .text-link, .metrics-grid article, .portfolio-grid article, .projects-list article, .strategy-grid article, .report-block, .leadership-grid article, .footer-grid > div, .footer-grid address");
      if (!desktop) reveals.push(...select<HTMLElement>(".service-card"));
      reveals.push(...select<HTMLElement>(".purpose-intro, .purpose-values-heading"));
      reveals.push(...select<HTMLElement>(".financial-intro, .financial-position, .financial-chapter"));
      reveals.push(...select<HTMLElement>(".about-editorial-intro, .about-editorial-summary, .about-contribution-heading, .about-contribution, .about-editorial-journey"));
      reveals.push(...select<HTMLElement>(".portfolio-heading, .sector-card"));
      reveals.push(...select<HTMLElement>(".difference-heading, .difference-subtitle, .difference-card"));
      reveals.push(...select<HTMLElement>(".infra-heading, .infra-capacity, .infra-vessels > div, .infra-firsts, .infra-block-heading, .infra-capability-grid article, .infra-projects dl > div"));
      reveals.push(...select<HTMLElement>(".marine-heading, .marine-block-heading, .marine-capacity-stats > div, .marine-capacity-copy, .marine-service-grid article, .marine-achievements article, .marine-segment-grid > div"));
      reveals.push(...select<HTMLElement>(".esg-heading, .esg-investment, .esg-block-heading, .esg-initiative"));
      reveals.push(...select<HTMLElement>(".growth-heading, .growth-card"));
      reveals.push(...select<HTMLElement>(".trading-intro > div:first-child, .trading-story, .trading-block-heading, .trading-brand-grid article, .trading-revenue-table"));
      reveals.push(...select<HTMLElement>(".transport-hero-copy, .transport-story, .transport-network-stat, .transport-block-heading, .transport-fleet-card, .transport-passenger-grid > div, .transport-passenger-total"));
      reveals.push(...select<HTMLElement>(".transport-opening-copy, .transport-opening-caption, .transport-total-feature"));
      if (!pinPurpose) reveals.push(...select<HTMLElement>(".purpose-statement"));
      const uniqueReveals = [...new Set(reveals)].filter(element =>
        !reveals.some(parent => parent !== element && parent.contains(element)));
      if (desktop) {
        uniqueReveals.forEach((element) => {
          gsap.from(element, { y: 28, opacity: 0, duration: 0.75, ease: "power2.out", scrollTrigger: {
            trigger: element, start: "top 94%", once: true,
          } });
        });
      } else {
        // One observer handles phone reveals without a scroll listener per card.
        // Avoid animating nested blocks twice, which compounds their movement.
        const mobileReveals = uniqueReveals;
        const visuals = select<HTMLElement>(".story-visual > img, .about-landscape > img, .transport-opening-scene > img");
        if (!pinPurpose) visuals.push(...select<HTMLElement>(".purpose-backdrop img"));
        gsap.set(mobileReveals, { y: 16, opacity: 0 });
        gsap.set(visuals, { scale: 1.045 });
        mobileObserver = new IntersectionObserver(entries => {
          const entering = entries.filter(entry => entry.isIntersecting).map(entry => entry.target);
          if (!entering.length) return;
          entering.forEach(element => mobileObserver?.unobserve(element));
          context.add(() => {
            const text = entering.filter(element => !visuals.includes(element as HTMLElement));
            const images = entering.filter(element => visuals.includes(element as HTMLElement));
            if (text.length) gsap.to(text, { y: 0, opacity: 1, duration: .58, stagger: { each: .055, amount: Math.min(.18, (text.length - 1) * .055) }, ease: "power3.out", clearProps: "transform,opacity" });
            if (images.length) gsap.to(images, { scale: 1, duration: 1.15, ease: "power2.out", clearProps: "transform" });
          });
        }, { rootMargin: "0px 0px -28px 0px", threshold: 0 });
        [...mobileReveals, ...visuals].forEach(element => mobileObserver!.observe(element));
        gsap.from(".company-hero-copy > *", { y: 12, opacity: 0, duration: .7, stagger: .09, ease: "power3.out", clearProps: "transform,opacity" });
      }

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
        gsap.to(counter, { value: Number(number.replaceAll(",", "")), duration: desktop ? 1.6 : .95, ease: "power2.out", scrollTrigger: {
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
        mobileObserver?.disconnect();
        values?.classList.remove("values-light-active");
        page.classList.remove("motion-desktop", "motion-purpose");
        counters.forEach((element) => { element.textContent = element.dataset.count!; });
      };
    }, page);

    let refreshFrame = 0;
    const refresh = (event?: Event) => {
      if (event?.target instanceof Element && event.target.closest("dialog")) return;
      if (event?.target instanceof Element && event.target.closest(".mobile-menu")) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => { ScrollTrigger.refresh(); });
    };
    page.addEventListener("toggle", refresh, true);
    // Images with reserved dimensions cannot change page geometry when loaded.
    // Refreshing every lazy image interrupts scrolling through pinned chapters.
    const pendingImages = select<HTMLImageElement>("img").filter(image =>
      !image.complete && !(image.hasAttribute("width") && image.hasAttribute("height")) && getComputedStyle(image).position !== "absolute");
    pendingImages.forEach((image) => image.addEventListener("load", refresh, { once: true }));
    refresh();
    return () => {
      cancelAnimationFrame(refreshFrame);
      pendingImages.forEach((image) => image.removeEventListener("load", refresh));
      page.removeEventListener("toggle", refresh, true);
      media.revert();
    };
  }, []);

  return <div ref={root} id="top" className={`profile-page theme-${theme}`}><div className="reading-progress" aria-hidden="true" />{children}</div>;
}
