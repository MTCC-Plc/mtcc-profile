"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { profileNavigation } from "../data/navigation";

const destinations = profileNavigation.flatMap(group => group.target ? [{ id: group.target, title: group.title }] : group.links);

export function MobileMenu() {
  const drawer = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const restoreScroll = useRef<(() => void) | null>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");

  function closeMenu() {
    restoreScroll.current?.();
    restoreScroll.current = null;
    drawer.current?.close();
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
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
    if (!drawer.current || drawer.current.open) return;
    const selected = destinations.flatMap(destination => {
      const element = document.getElementById(destination.id);
      if (!element?.getClientRects().length) return [];
      const top = element.getBoundingClientRect().top;
      return top <= window.innerHeight * .4 ? [{ id: destination.id, top }] : [];
    }).sort((a, b) => b.top - a.top)[0]?.id ?? "";
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
      const group = link?.closest<HTMLElement>(".mobile-nav-group");
      if (list) list.scrollTop = group?.offsetTop ?? 0;
    });
  }

  useEffect(() => {
    const element = drawer.current;
    return () => { element?.close(); restoreScroll.current?.(); };
  }, []);

  return <div className="mobile-menu">
    <button ref={trigger} className="mobile-menu-trigger" type="button" aria-label="Open profile menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-profile-menu" onClick={openMenu}><Menu size={22} aria-hidden="true" /></button>
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
      <div className="mobile-drawer-heading"><button type="button" className="mobile-drawer-close" aria-label="Close profile menu" onClick={closeMenu} autoFocus><X size={24} aria-hidden="true" /></button><h2 id="mobile-menu-title" className="sr-only">Explore MTCC</h2></div>
      <nav className="mobile-drawer-sections" aria-label="Main navigation">{profileNavigation.map(group => <section className="mobile-nav-group" key={group.id} aria-labelledby={`mobile-group-${group.id}`}>
        <h3 id={`mobile-group-${group.id}`} className="mobile-nav-heading">{group.target ? <a id={`mobile-link-${group.target}`} href={`#${group.target}`} aria-current={current === group.target ? "location" : undefined} onClick={event => navigateToSection(event, group.target!)}>{group.title}</a> : group.title}</h3>
        {group.links.length > 0 && <ul className="mobile-nav-links">{group.links.map(link => <li key={link.id}><a id={`mobile-link-${link.id}`} href={`#${link.id}`} aria-current={current === link.id ? "location" : undefined} onClick={event => navigateToSection(event, link.id)}>{link.title}</a></li>)}</ul>}
      </section>)}</nav>
    </dialog>
  </div>;
}
