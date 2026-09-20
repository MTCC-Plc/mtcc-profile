"use client";

import { ArrowUpRight, Check, ChevronDown, CircleCheckBig, LoaderCircle, Mail, Send, TriangleAlert, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { enquiryRecipient, enquirySubject, formatEnquiryText, type EnquiryFields, type EnquiryResponse } from "../../lib/enquiry";
import styles from "./project-contact-dialog.module.css";
import { TurnstileWidget, type TurnstileHandle } from "./turnstile-widget";

// Both values are inlined at build time. On Cloudflare Pages the endpoint is
// `/api/enquiry` (see functions/api/enquiry.ts); when it is unset, for example
// on GitHub Pages, the dialog falls back to opening an email draft.
const enquiryEndpoint = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

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
  const turnstile = useRef<TurnstileHandle>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
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

  function close() {
    setStatus({ kind: "idle" });
    onClose();
  }

  function toggleWork(id: string) {
    onSelectionChange(selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id]);
  }

  function readFields(form: HTMLFormElement): EnquiryFields | null {
    const detailsField = form.elements.namedItem("details") as HTMLTextAreaElement;
    if (!detailsField.value.trim()) {
      detailsField.setCustomValidity("Please tell us a little about your project.");
      detailsField.reportValidity();
      return null;
    }

    const values = new FormData(form);
    const value = (name: string) => String(values.get(name) ?? "").trim();
    return {
      name: value("name"),
      email: value("email"),
      phone: value("phone"),
      company: value("company"),
      location: value("location"),
      timeline: value("timeline"),
      details: value("details"),
      preferences: works.filter(work => selected.includes(work.id)).map(work => work.title),
    };
  }

  function openEmailDraft(fields: EnquiryFields) {
    const emailDraft = document.createElement("a");
    emailDraft.href = `mailto:${enquiryRecipient}?subject=${encodeURIComponent(enquirySubject)}&body=${encodeURIComponent(formatEnquiryText(fields))}`;
    emailDraft.hidden = true;
    document.body.append(emailDraft);
    emailDraft.click();
    emailDraft.remove();
  }

  async function sendEnquiry(form: HTMLFormElement, fields: EnquiryFields) {
    setStatus({ kind: "sending" });
    try {
      const response = await fetch(enquiryEndpoint!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website: String(new FormData(form).get("website") ?? ""), turnstileToken: turnstile.current?.getToken() ?? "" }),
      });
      const result = (await response.json().catch(() => null)) as EnquiryResponse | null;
      if (!response.ok || !result?.ok) throw new Error(result && !result.ok ? result.error : "We could not send your enquiry right now.");
      setStatus({ kind: "sent" });
      form.reset();
    } catch (error) {
      turnstile.current?.reset();
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "We could not send your enquiry right now." });
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = readFields(form);
    if (!fields) return;
    if (enquiryEndpoint) void sendEnquiry(form, fields);
    else openEmailDraft(fields);
  }

  function retryByEmail(form: HTMLFormElement) {
    const fields = readFields(form);
    if (fields) openEmailDraft(fields);
  }

  return <dialog
    ref={dialog}
    id="project-contact-dialog"
    className={styles.dialog}
    aria-labelledby={titleId}
    aria-describedby={descriptionId}
    onCancel={event => { event.preventDefault(); close(); }}
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
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }}
  >
    <form className={styles.form} onSubmit={submit} aria-busy={status.kind === "sending"}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Private project enquiry</p>
          <h2 ref={heading} id={titleId} tabIndex={-1}>Tell us about your project<span>.</span></h2>
          <p id={descriptionId} className={styles.intro}>Share your requirements and contact details with the MTCC team.</p>
        </div>
        <button type="button" className={styles.close} onClick={close} aria-label="Close project enquiry"><X size={22} aria-hidden="true" /></button>
      </header>

      {status.kind === "sent" ? <div className={`${styles.content} ${styles.sent}`} role="status">
        <CircleCheckBig size={44} strokeWidth={1.6} aria-hidden="true" />
        <h3>Thank you, your enquiry has been sent.</h3>
        <p>The MTCC team will review your project and get back to you at the email address you provided.</p>
        <button type="button" className={styles.submit} onClick={close}>Done</button>
      </div> : <div className={styles.content}>
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
          {/* Honeypot: hidden from people, filled in by simple bots. The function discards submissions that fill it. */}
          <div className={styles.honeypot} aria-hidden="true"><label htmlFor={`${uid}-website`}>Website</label><input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
          {enquiryEndpoint && turnstileSiteKey ? <TurnstileWidget ref={turnstile} siteKey={turnstileSiteKey} className={`${styles.fullWidth} ${styles.turnstile}`} /> : null}
        </div>
      </div>}

      {status.kind === "sent" ? null : <footer className={styles.footer}>
        {status.kind === "error" ? <p className={styles.error} role="alert">
          <TriangleAlert size={17} aria-hidden="true" />
          <span>{status.message} <button type="button" className={styles.fallback} onClick={event => retryByEmail(event.currentTarget.form!)}>Open an email draft instead</button></span>
        </p> : enquiryEndpoint ? <p><Mail size={17} aria-hidden="true" /><span>Your enquiry goes directly to the MTCC team at <strong>{enquiryRecipient}</strong>. We reply to the email address you provide.</span></p>
        : <p><Mail size={17} aria-hidden="true" /><span>Opens your email app with a draft to <strong>{enquiryRecipient}</strong>. Review it before sending.</span></p>}
        {enquiryEndpoint
          ? <button type="submit" className={styles.submit} disabled={status.kind === "sending"}>{status.kind === "sending" ? <>Sending <LoaderCircle size={18} className={styles.spinner} aria-hidden="true" /></> : <>Send enquiry <Send size={17} aria-hidden="true" /></>}</button>
          : <button type="submit" className={styles.submit}>Open email draft <ArrowUpRight size={18} aria-hidden="true" /></button>}
      </footer>}
    </form>
  </dialog>;
}
