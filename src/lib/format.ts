export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(price: number, previousPrice?: number) {
  if (!previousPrice || previousPrice <= price) return 0;
  return Math.round(((previousPrice - price) / previousPrice) * 100);
}
