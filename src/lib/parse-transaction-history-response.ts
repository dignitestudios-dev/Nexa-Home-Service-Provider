import type {
  TransactionDetail,
  TransactionHistoryItem,
  TransactionHistoryPagination,
  TransactionHistoryResult,
  TransactionHistoryStatus,
  TransactionPlanSummary,
} from "@/types/transaction-history.types";

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatTransactionDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    }

    return value;
  }

  return "";
}

function capitalizeWords(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getDescription(item: Record<string, unknown>): string {
  const metadata = getRecord(item.metadata);
  const rawDescription =
    (typeof item.description === "string" && item.description.trim()) ||
    (typeof metadata?.description === "string" && metadata.description.trim()) ||
    "";

  if (rawDescription) {
    return rawDescription;
  }

  const purpose =
    typeof item.purpose === "string" ? item.purpose.trim().toLowerCase() : "";
  const plan = getRecord(item.plan);

  const planType =
    (typeof plan?.type === "string" && plan.type.trim().toLowerCase()) ||
    (typeof metadata?.planType === "string" &&
      metadata.planType.trim().toLowerCase()) ||
    "";

  const planName =
    (typeof plan?.name === "string" && plan.name.trim()) ||
    (typeof metadata?.planName === "string" && metadata.planName.trim()) ||
    "";

  if (
    purpose === "credit_purchase" ||
    purpose === "wallet_credit_purchase" ||
    planType === "credit"
  ) {
    return "Credit purchases";
  }

  if (purpose === "credit_spent" || purpose === "credits_spent") {
    return "Credits spent";
  }

  if (planType === "advertisement") {
    return "Ad promotions";
  }

  if (planType === "badge") {
    return "Verified badge purchases";
  }

  if (planType === "category") {
    return "Advanced category Purchased";
  }

  if (planName) {
    if (purpose === "subscription_payment") {
      return `${planName} payment`;
    }

    if (purpose === "subscription_purchase") {
      return `${planName} purchased`;
    }

    return planName;
  }

  if (purpose) {
    return capitalizeWords(purpose);
  }

  return "-";
}

function getCurrency(item: Record<string, unknown>): string {
  const plan = getRecord(item.plan);
  const planMetadata = getRecord(plan?.metadata);
  const metadata = getRecord(item.metadata);
  const currency =
    (typeof item.currency === "string" && item.currency.trim()) ||
    (typeof planMetadata?.currency === "string" &&
      planMetadata.currency.trim()) ||
    (typeof metadata?.currency === "string" && metadata.currency.trim()) ||
    "usd";

  return currency.toLowerCase();
}

function getRawTransactionDate(item: Record<string, unknown>): string {
  const raw =
    item.createdAt ?? item.created_at ?? item.date ?? item.transactionDate;

  return typeof raw === "string" ? raw.trim() : "";
}

function parseTransactionStatus(value: unknown): {
  status: TransactionHistoryStatus;
  statusLabel: string;
} {
  if (typeof value !== "string" || !value.trim()) {
    return { status: "other", statusLabel: "-" };
  }

  const normalized = value.trim().toLowerCase();

  if (
    normalized === "success" ||
    normalized === "succeeded" ||
    normalized === "completed"
  ) {
    return { status: "success", statusLabel: "Success" };
  }

  if (
    normalized === "failed" ||
    normalized === "failure" ||
    normalized === "error" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return { status: "failed", statusLabel: "Failed" };
  }

  if (normalized === "pending" || normalized === "processing") {
    return { status: "pending", statusLabel: "Pending" };
  }

  return {
    status: "other",
    statusLabel: capitalizeWords(normalized),
  };
}

function parseTransactionItem(value: unknown): TransactionHistoryItem | null {
  const item = getRecord(value);
  if (!item) return null;

  const id =
    (typeof item._id === "string" && item._id) ||
    (typeof item.id === "string" && item.id) ||
    "";

  if (!id) return null;

  const amountValue =
    item.amount ?? item.price ?? item.total ?? item.value ?? item.credits;
  const rawDate = getRawTransactionDate(item);
  const { status, statusLabel } = parseTransactionStatus(item.status);

  return {
    id,
    date: formatTransactionDate(rawDate),
    createdAt: rawDate,
    description: getDescription(item),
    status,
    statusLabel,
    amount: toNumber(amountValue),
    currency: getCurrency(item),
  };
}

function parsePagination(value: unknown): TransactionHistoryPagination {
  const pagination = getRecord(value) ?? {};

  return {
    itemsPerPage: toNumber(pagination.itemsPerPage, 10),
    currentPage: toNumber(pagination.currentPage, 1),
    totalItems: toNumber(pagination.totalItems),
    totalPages: Math.max(1, toNumber(pagination.totalPages, 1)),
  };
}

function getHistoryPayload(data: unknown): {
  transactions: unknown[];
  pagination: TransactionHistoryPagination;
} {
  const record = getRecord(data);
  if (!record) {
    return {
      transactions: [],
      pagination: parsePagination(null),
    };
  }

  const nested = getRecord(record.data);

  if (nested) {
    const transactions = Array.isArray(nested.transactions)
      ? nested.transactions
      : Array.isArray(nested.items)
        ? nested.items
        : Array.isArray(nested.history)
          ? nested.history
          : [];

    return {
      transactions,
      pagination: parsePagination(nested.pagination),
    };
  }

  const transactions = Array.isArray(record.transactions)
    ? record.transactions
    : Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.history)
        ? record.history
        : Array.isArray(record.data)
          ? record.data
          : [];

  return {
    transactions,
    pagination: parsePagination(record.pagination),
  };
}

export function parseTransactionHistoryFromResponse(
  data: unknown,
): TransactionHistoryResult {
  const { transactions, pagination } = getHistoryPayload(data);

  return {
    items: transactions
      .map(parseTransactionItem)
      .filter((item): item is TransactionHistoryItem => item !== null),
    pagination,
  };
}

export function formatTransactionAmount(
  amount: number,
  currency = "usd",
): string {
  if (currency.toLowerCase() === "usd") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  }

  return `${amount.toFixed(4)} ${currency.toUpperCase()}`;
}

function parsePlanSummary(value: unknown): TransactionPlanSummary | null {
  const plan = getRecord(value);
  if (!plan) return null;

  const id =
    (typeof plan._id === "string" && plan._id) ||
    (typeof plan.id === "string" && plan.id) ||
    "";
  const name = typeof plan.name === "string" ? plan.name.trim() : "";
  const type = typeof plan.type === "string" ? plan.type.trim() : "";
  const interval =
    typeof plan.interval === "string" ? plan.interval.trim() : "";

  if (!id && !name) return null;

  return {
    id,
    name,
    type,
    interval,
    amount: toNumber(plan.amount),
  };
}

function getTransactionDetailRecord(
  data: unknown,
): Record<string, unknown> | null {
  const record = getRecord(data);
  if (!record) return null;

  const nested = getRecord(record.data);
  if (!nested) return record;

  return getRecord(nested.transaction) ?? nested;
}

export function parseTransactionDetailFromResponse(
  data: unknown,
): TransactionDetail | null {
  const transactionRecord = getTransactionDetailRecord(data);
  if (!transactionRecord) return null;

  const base = parseTransactionItem(transactionRecord);
  if (!base) return null;

  const errorMessage =
    typeof transactionRecord.errorMessage === "string"
      ? transactionRecord.errorMessage.trim() || null
      : typeof transactionRecord.error_message === "string"
        ? transactionRecord.error_message.trim() || null
        : null;

  return {
    ...base,
    transactionType:
      typeof transactionRecord.type === "string"
        ? transactionRecord.type.trim()
        : "",
    purpose:
      typeof transactionRecord.purpose === "string"
        ? transactionRecord.purpose.trim()
        : "",
    platformFee: toNumber(transactionRecord.platformFee),
    paymentFee: toNumber(transactionRecord.paymentFee),
    netAmount:
      transactionRecord.netAmount == null
        ? null
        : toNumber(transactionRecord.netAmount),
    paymentMethodType:
      typeof transactionRecord.paymentMethodType === "string"
        ? transactionRecord.paymentMethodType.trim()
        : "",
    errorMessage,
    plan: parsePlanSummary(transactionRecord.plan),
  };
}

export function formatTransactionLabel(value: string): string {
  if (!value.trim()) return "-";
  return capitalizeWords(value);
}
