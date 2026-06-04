export function parseCheckoutSessionUrl(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  const candidates = [
    record.url,
    record.checkoutUrl,
    record.checkout_url,
    record.sessionUrl,
    record.session_url,
    nested?.url,
    nested?.checkoutUrl,
    nested?.checkout_url,
    nested?.sessionUrl,
    nested?.session_url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.startsWith("http")) {
      return candidate;
    }
  }

  return null;
}
