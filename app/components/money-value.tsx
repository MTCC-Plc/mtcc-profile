/** Keep the symbol visually separate while preserving the complete spoken value. */
export function MoneyValue({ value }: { value: string }) {
  const match = value.match(/^((?:≈ )?(?:Rf|\$)) (.+)$/);
  return match ? <><span className="money-symbol">{match[1]}</span>{" "}{match[2]}</> : <>{value}</>;
}
