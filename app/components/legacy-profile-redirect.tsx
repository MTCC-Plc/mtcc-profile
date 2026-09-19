"use client";

import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { assetPath } from "../../lib/asset-path";

export default function LegacyProfileRedirect() {
  useEffect(() => {
    const aliases: Record<string, string> = { "#services": "#portfolio", "#service-details": "#portfolio", "#investor-purpose": "#purpose", "#who-we-are": "#about-mtcc", "#trading-products": "#general-trading", "#highlights": "#financials", "#partnership": "#private-projects", "#team": "#workforce" };
    window.location.replace(assetPath("/") + (aliases[window.location.hash] ?? window.location.hash));
  }, []);
  return <main className="legacy-profile"><h1>Explore MTCC</h1><p>Our corporate and investor profiles are now together.</p><a href={assetPath("/")}>Open the complete company profile <ArrowRight size={18} aria-hidden="true" /></a></main>;
}
