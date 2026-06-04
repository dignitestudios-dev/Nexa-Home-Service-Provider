export const CREDIT_PRICE_PER_UNIT = 1;

export const MIN_CUSTOM_CREDITS = 100;
export const MAX_CUSTOM_CREDITS = 100_000;

export function calculateCreditPackagePrice(credits: number): number {
  const normalizedCredits = Math.max(0, credits);
  return (
    Math.round(normalizedCredits * CREDIT_PRICE_PER_UNIT * 100) / 100
  );
}

export function formatCreditPrice(price: number): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
