"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";

export function MobileMenu({ active, sections }: { active: "corporate" | "investor"; sections: { id: string; title: string }[] }) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", escape); };
  }, []);
  return <details ref={menu} className="mobile-menu" onKeyDown={event => {
    if (event.key === "Escape" && menu.current?.open) {
      event.preventDefault(); event.stopPropagation(); menu.current.open = false;
      menu.current.querySelector("summary")?.focus();
    }
  }}><summary aria-label="Profile menu"><Menu className="menu-open-icon" size={22} /><X className="menu-close-icon" size={22} /></summary><nav aria-label="Mobile profile navigation" onClick={event => {
    if ((event.target as HTMLElement).closest("a") && menu.current) menu.current.open = false;
  }}><Link aria-current={active === "corporate" ? "page" : undefined} href="/corporate-profile">Corporate profile</Link><Link aria-current={active === "investor" ? "page" : undefined} href="/investor-profile">Investor profile</Link><div className="mobile-section-links"><p>Explore this profile</p>{sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}</div><a href="#contact">Contact</a></nav></details>;
}
