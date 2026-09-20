"use client";

import { ArrowUpRight, Check, ChevronDown, Mail, X } from "lucide-react";
import { useEffect, useId, useRef, type FormEvent } from "react";
import styles from "./project-contact-dialog.module.css";

type ProjectContactDialogProps = {
  open: boolean;
  onClose: () => void;
  works: readonly { id: string; title: string }[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
};

export function ProjectContactDialog({ open, onClose, works, selected, onSelectionChange }: ProjectContactDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollPosition = { left: window.scrollX, top: window.scrollY };
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollPosition.top}px`;
    body.style.left = `-${scrollPosition.left}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    element.showModal();
    heading.current?.focus({ preventScroll: true });

    return () => {
      element.close();
      Object.assign(body.style, previous);
      window.scrollTo({ ...scrollPosition, behavior: "instant" });
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open]);

  function toggleWork(id: string) {
    onSelectionChange(selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id]);
  }

  function openEmailDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const detailsField = form.elements.namedItem("details") as HTMLTextAreaElement;
    if (!detailsField.value.trim()) {
      detailsField.setCustomValidity("Please tell us a little about your project.");
      detailsField.reportValidity();
      return;
    }

    const values = new FormData(form);
    const value = (name: string) => String(values.get(name) ?? "").trim();
    const preferences = works.filter(work => selected.includes(work.id)).map(work => work.title);
    const body = [
      "Hello MTCC,",
      "",
      "I would like to discuss a private project with your team.",
      "",
      "PROJECT PREFERENCES",
      preferences.length ? preferences.map(title => `- ${title}`).join("\n") : "Please help us define the works needed for our project.",
      "",
      "CONTACT DETAILS",
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      `Phone: ${value("phone") || "Not provided"}`,
      `Company: ${value("company") || "Not provided"}`,
      "",
      "PROJECT DETAILS",
      `Island / location: ${value("location") || "Not provided"}`,
      `Expected timeline: ${value("timeline") || "Not provided"}`,
      "",
      value("details"),
    ].join("\n");

    const emailDraft = document.createElement("a");
    emailDraft.href = `mailto:info@mtcc.com.mv?subject=${encodeURIComponent("Private project enquiry")}&body=${encodeURIComponent(body)}`;
    emailDraft.hidden = true;
    document.body.append(emailDraft);
    emailDraft.click();
    emailDraft.remove();
  }

  return <dialog
    ref={dialog}
    id="project-contact-dialog"
    className={styles.dialog}
    aria-labelledby={titleId}
    aria-describedby={descriptionId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={event => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button, input, textarea, select, summary, [tabindex]")).filter(element => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden");
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) { event.preventDefault(); heading.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement as HTMLElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}
  >
    <form className={styles.form} onSubmit={openEmailDraft}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Private project enquiry</p>
          <h2 ref={heading} id={titleId} tabIndex={-1}>Tell us about your project<span>.</span></h2>
          <p id={descriptionId} className={styles.intro}>Share your requirements and contact details with the MTCC team.</p>
        </div>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close project enquiry"><X size={22} aria-hidden="true" /></button>
      </header>

      <div className={styles.content}>
        <fieldset className={styles.preferences}>
          <legend>Project preferences <span>{selected.length} selected</span></legend>
          {selected.length ? <ul className={styles.selectedWorks} aria-label="Selected project preferences">
            {works.filter(work => selected.includes(work.id)).map(work => <li key={work.id}><Check size={13} aria-hidden="true" />{work.title}</li>)}
          </ul> : <p className={styles.empty}>Still planning? Our team can help you define the works you need.</p>}
          <details className={styles.preferenceEditor}>
            <summary>Change project preferences <ChevronDown size={16} aria-hidden="true" /></summary>
            <p className={styles.hint}>Choose the works you would like to discuss with our team.</p>
            <div className={styles.options}>
              {works.map(work => <label key={work.id} className={styles.option}>
                <input type="checkbox" name="preferences" value={work.id} checked={selected.includes(work.id)} onChange={() => toggleWork(work.id)} />
                <span className={styles.checkbox} aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                <span>{work.title}</span>
              </label>)}
            </div>
          </details>
        </fieldset>

        <div className={styles.detailsHeading}><h3>Your details</h3><span>* Required</span></div>
        <div className={styles.fields}>
          <label className={styles.field} htmlFor={`${uid}-name`}>Name <span>*</span><input id={`${uid}-name`} name="name" autoComplete="name" required pattern=".*\S.*" maxLength={120} /></label>
          <label className={styles.field} htmlFor={`${uid}-email`}>Email <span>*</span><input id={`${uid}-email`} name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          <label className={styles.field} htmlFor={`${uid}-phone`}>Phone <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
          <label className={styles.field} htmlFor={`${uid}-company`}>Company <input id={`${uid}-company`} name="company" autoComplete="organization" maxLength={160} /></label>
          <label className={styles.field} htmlFor={`${uid}-location`}>Island / location <input id={`${uid}-location`} name="location" maxLength={180} placeholder="Where is your project?" /></label>
          <label className={styles.field} htmlFor={`${uid}-timeline`}>Expected timeline <input id={`${uid}-timeline`} name="timeline" maxLength={120} placeholder="e.g. Within the next 6 months" /></label>
          <label className={`${styles.field} ${styles.fullWidth}`} htmlFor={`${uid}-details`}>Project details <span>*</span><textarea id={`${uid}-details`} name="details" required maxLength={4000} rows={4} placeholder="Tell us about the scope, scale and any specific requirements." onInput={event => event.currentTarget.setCustomValidity("")} /></label>
        </div>
      </div>

      <footer className={styles.footer}>
        <p><Mail size={17} aria-hidden="true" /><span>Opens your email app with a draft to <strong>info@mtcc.com.mv</strong>. Review it before sending.</span></p>
        <button type="submit" className={styles.submit}>Open email draft <ArrowUpRight size={18} aria-hidden="true" /></button>
      </footer>
    </form>
  </dialog>;
}
