export const BASE_CREDIT_RATE = {
  credits: 100,
  price: 50,
} as const;

export const CREDIT_PRICE_PER_UNIT =
  BASE_CREDIT_RATE.price / BASE_CREDIT_RATE.credits;

export const MIN_CUSTOM_CREDITS = 100;
export const MAX_CUSTOM_CREDITS = 10000;

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
