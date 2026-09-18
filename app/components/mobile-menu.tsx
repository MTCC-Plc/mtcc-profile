"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";

export function MobileMenu({ sections }: { sections: { id: string; title: string }[] }) {
  const drawer = useRef<HTMLDialogElement>(null);
  const restoreScroll = useRef<(() => void) | null>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");

  function closeMenu() {
    restoreScroll.current?.();
    restoreScroll.current = null;
    drawer.current?.close();
    setOpen(false);
  }

  function navigateToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      // Restore pin geometry after releasing the drawer's fixed-body scroll lock.
      ScrollTrigger.refresh();
      if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
      target.scrollIntoView({ behavior: "instant", block: "start" });
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    });
  }

  function openMenu() {
    const selected = sections.filter(section => {
      const element = document.getElementById(section.id);
      return element && element.getBoundingClientRect().top <= window.innerHeight * .4;
    }).at(-1)?.id ?? "";
    setCurrent(selected);
    const y = window.scrollY;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    restoreScroll.current = () => {
      Object.assign(body.style, previous);
      window.scrollTo({ top: y, behavior: "instant" });
    };
    drawer.current?.showModal();
    setOpen(true);
    requestAnimationFrame(() => {
      const list = drawer.current?.querySelector<HTMLElement>(".mobile-drawer-sections");
      const link = selected ? document.getElementById(`mobile-link-${selected}`) : null;
      if (list) list.scrollTop = link ? link.offsetTop - list.offsetTop - 12 : 0;
    });
  }

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1000px)");
    const resize = () => { if (desktop.matches) closeMenu(); };
    desktop.addEventListener("change", resize);
    return () => { desktop.removeEventListener("change", resize); restoreScroll.current?.(); };
  }, []);

  return <div className="mobile-menu">
    <button className="mobile-menu-trigger" type="button" aria-label="Open profile menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-profile-menu" onClick={openMenu}><span>Explore</span><Menu size={20} aria-hidden="true" /></button>
    <dialog ref={drawer} id="mobile-profile-menu" className="mobile-drawer" aria-labelledby="mobile-menu-title" onCancel={event => { event.preventDefault(); closeMenu(); }} onKeyDown={event => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeMenu(); }
      if (event.key !== "Tab") return;
      const links = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button"));
      const first = links[0], last = links.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onClick={event => {
      if (event.target !== drawer.current) return;
      const rect = drawer.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
    }}>
      <div className="mobile-drawer-heading"><div><p>MTCC · 2026</p><h2 id="mobile-menu-title">Explore MTCC.</h2></div><button type="button" className="mobile-drawer-close" aria-label="Close profile menu" onClick={closeMenu} autoFocus><X size={24} aria-hidden="true" /></button></div>
      <div className="mobile-drawer-label"><span>Explore the company</span><span>{String(sections.length).padStart(2, "0")} sections <ArrowDown size={12} aria-hidden="true" /></span></div>
      <nav className="mobile-drawer-sections" aria-label="Profile sections">{sections.map((section, index) => <a key={section.id} id={`mobile-link-${section.id}`} href={`#${section.id}`} aria-current={current === section.id ? "location" : undefined} onClick={event => navigateToSection(event, section.id)}><span className="mobile-section-number">{String(index + 1).padStart(2, "0")}</span><span>{section.title}</span><ArrowUpRight size={16} aria-hidden="true" /></a>)}</nav>
      <div className="mobile-drawer-footer"><a href="#contact" onClick={event => navigateToSection(event, "contact")}>Get in touch <ArrowUpRight size={19} aria-hidden="true" /></a><span>Building a connected Maldives.</span></div>
    </dialog>
  </div>;
}
