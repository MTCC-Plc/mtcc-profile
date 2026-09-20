"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import SiteImage from "./site-image";
import styles from "./vendor-registration-section.module.css";

const VENDOR_PORTAL_URL =
  "https://portal.mtcc.com.mv/login?appid=cd6eab61-ff52-4950-aa72-60454cbdc693&response_type=token&redirect_uri=https%3A%2F%2Fvendor.mtcc.com.mv%2Fauth%2Fcallback";

const STEPS = [
  "Scan the code or open the vendor portal",
  "Sign in, or create your MTCC portal account",
  "Complete your vendor registration and submit",
];

const SUPPLIES = [
  "Construction materials", "Rock and aggregates", "Machinery and spare parts",
  "Marine supplies", "Subcontract works", "Professional services", "Logistics",
];

export function VendorRegistrationSection() {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copyLink() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(VENDOR_PORTAL_URL);
      ok = true;
    } catch {
      ok = false;
    }
    setCopied(ok ? "done" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied("idle"), 2600);
  }

  return (
    <section id="vendors" className={styles.section} aria-labelledby="vendors-title">
      <div className="shell">
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Vendors</p>
          <h2 id="vendors-title">Register as a vendor <span>with MTCC.</span></h2>
          <p className={styles.intro}>Suppliers, subcontractors and service providers: join the MTCC vendor list to be considered for the materials, equipment and services behind 868 projects and a nationwide transport network.</p>
        </header>

        <div className={styles.layout}>
          <div>
            <ol className={styles.steps}>
              {STEPS.map(step => <li key={step}>{step}</li>)}
            </ol>

            <ul className={styles.chips} aria-label="Examples of what vendors supply">
              {SUPPLIES.map(item => <li key={item}>{item}</li>)}
            </ul>

            <div className={styles.actions}>
              <a className={styles.primary} href={VENDOR_PORTAL_URL} target="_blank" rel="noopener noreferrer">
                Open the vendor portal <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <button type="button" className={styles.copy} onClick={copyLink}>
                {copied === "done" ? <><Check size={16} aria-hidden="true" /> Link copied</> : <><Copy size={16} aria-hidden="true" /> Copy link</>}
              </button>
            </div>
            <p className={styles.note} role={copied === "failed" ? "alert" : undefined}>
              {copied === "failed"
                ? "Copying was blocked. Press and hold the button above, or use the portal link."
                : <>Portal: <b>vendor.mtcc.com.mv</b>, sign-in through portal.mtcc.com.mv</>}
            </p>
          </div>

          <figure className={styles.qr}>
            <div className={styles.tile}>
              <SiteImage src="/assets/mtcc-vendor-qr.svg" width={220} height={220} alt="QR code that opens the MTCC vendor registration portal" />
            </div>
            <figcaption>
              <strong>Scan to register</strong>
              <span>Opens the MTCC vendor registration portal</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
