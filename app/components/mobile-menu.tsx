"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useRef } from "react";

export function MobileMenu() {
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
  }}><summary aria-label="Profile menu"><Menu size={22} /></summary><nav aria-label="Mobile profile navigation" onClick={event => {
    if ((event.target as HTMLElement).closest("a") && menu.current) menu.current.open = false;
  }}><Link href="/corporate-profile">Corporate profile</Link><Link href="/investor-profile">Investor profile</Link><a href="#contact">Contact</a></nav></details>;
}
