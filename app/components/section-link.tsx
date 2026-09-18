"use client";

import type { ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Land beyond the fixed header without lazy-image refreshes interrupting navigation. */
export function SectionLink({ href, className, children }: { href: `#${string}`; className?: string; children: ReactNode }) {
  return <a href={href} className={className} onClick={event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    ScrollTrigger.refresh();
    if (location.hash !== href) history.pushState(null, "", href);
    target.scrollIntoView({ behavior: "instant", block: "start" });
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }}>{children}</a>;
}
