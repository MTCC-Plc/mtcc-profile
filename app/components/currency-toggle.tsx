"use client";

import { CurrencySymbol } from "./currency-symbol";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Currency } from "../../lib/currency";

const CurrencyContext = createContext<{ currency: Currency; setCurrency: (currency: Currency) => void }>({ currency: "MVR", setCurrency: () => {} });

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, updateCurrency] = useState<Currency>("MVR");
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { const saved = localStorage.getItem("mtcc-currency"); if (saved === "USD" || saved === "MVR") updateCurrency(saved); } catch { /* Storage is optional. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  function setCurrency(next: Currency) {
    updateCurrency(next);
    try { localStorage.setItem("mtcc-currency", next); } catch { /* Keep the in-memory selection. */ }
  }
  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
}

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  return <div className="currency-toggle" role="group" aria-label="Display currency">
    {(["MVR", "USD"] as const).map(code => <button key={code} type="button" aria-pressed={currency === code} aria-label={`Show amounts in ${code === "MVR" ? "Maldivian rufiyaa (MVR)" : "US dollars (USD)"}`} onClick={() => setCurrency(code)}><span className="currency-symbol" aria-hidden="true"><CurrencySymbol currency={code} /></span><span>{code}</span></button>)}
  </div>;
}
