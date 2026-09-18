"use client";

import { useEffect } from "react";
import { assetPath } from "../../lib/asset-path";

export default function LegacyProfileRedirect() {
  useEffect(() => {
    const aliases: Record<string, string> = { "#investor-purpose": "#purpose", "#who-we-are": "#about-mtcc", "#trading-products": "#general-trading" };
    window.location.replace(assetPath("/") + (aliases[window.location.hash] ?? window.location.hash));
  }, []);
  return <main className="legacy-profile"><h1>Explore MTCC</h1><p>Our corporate and investor profiles are now together.</p><a href={assetPath("/")}>Open the complete company profile →</a></main>;
}
