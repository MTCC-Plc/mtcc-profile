import type { ContentBlock, Metric, ProfilePageData } from "../app/types/profile";

export type Currency = "MVR" | "USD";
// Rf is an internal text token; CurrencyText renders the official MMA vector.
export const currencySymbols: Record<Currency, string> = { MVR: "Rf", USD: "$" };
// Presentation rate only; existing amounts supplied in both currencies take priority.
export const MVR_PER_USD = 15.42;
const money = /^(MVR|USD)\s+([\d,.]+)([BM]?)$/;

export function isMoney(value: string) {
  return /^(?:≈\s*)?(?:Rf|\$)\s/.test(value);
}

export function currencyMetrics(metrics: Metric[], currency: Currency): Metric[] {
  return metrics.flatMap((metric, index) => {
    const match = metric.value.match(money);
    if (!match) return [metric];
    const [, originalCurrency, amount, suffix] = match;
    // Pair only adjacent matching labels, so distinct same-currency metrics survive.
    const partnerIndex = [index - 1, index + 1].find(i => {
      const other = metrics[i];
      const otherMatch = other?.value.match(money);
      return other?.label === metric.label && otherMatch && otherMatch[1] !== originalCurrency;
    });
    if (partnerIndex !== undefined && originalCurrency !== currency) return [];
    if (originalCurrency === currency) return [{ ...metric, value: `${currencySymbols[currency]} ${amount}${suffix}` }];
    const converted = Number(amount.replaceAll(",", "")) * (currency === "USD" ? 1 / MVR_PER_USD : MVR_PER_USD);
    return [{ ...metric, value: `≈ ${currencySymbols[currency]} ${converted.toLocaleString("en-US", { maximumFractionDigits: 2 })}${suffix}`,
      note: [metric.note, "Approximate equivalent · $1 = Rf 15.42"].filter(Boolean).join(" · ") }];
  });
}

function currencyBlock(block: ContentBlock, currency: Currency): ContentBlock {
  if (block.type === "metrics") return { ...block, metrics: currencyMetrics(block.metrics, currency) };
  if (block.type !== "table" || !block.columns.some(column => /^MVR\b/.test(column)) || !block.columns.some(column => /^USD\b/.test(column))) return block;
  const indices = block.columns.flatMap((column, index) => /^(MVR|USD)\b/.test(column) && !column.startsWith(currency) ? [] : [index]);
  return { ...block,
    columns: indices.map(index => block.columns[index].replace(currency, `${currencySymbols[currency]} ${currency}`)),
    rows: block.rows.map(row => indices.map(index => row[index])),
  };
}

export function profileInCurrency(profile: ProfilePageData, currency: Currency): ProfilePageData {
  return { ...profile, hero: { ...profile.hero, metrics: currencyMetrics(profile.hero.metrics, currency) },
    sections: profile.sections.map(section => {
      if (section.type === "metrics") return { ...section, metrics: currencyMetrics(section.metrics, currency) };
      if (section.type === "content") return { ...section, blocks: section.blocks.map(block => currencyBlock(block, currency)) };
      return section;
    }),
  };
}
