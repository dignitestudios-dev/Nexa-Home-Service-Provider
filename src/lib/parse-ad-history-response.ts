import type {
  AdHistoryItem,
  AdHistoryMediaType,
  AdHistoryPagination,
  AdHistoryResult,
  AdHistoryFilter,
} from "@/types/advertisement.types";

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseId(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  const record = getRecord(value);
  if (record && typeof record.$oid === "string" && record.$oid.trim()) {
    return record.$oid.trim();
  }

  return "";
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatAdHistoryDate(value: unknown): string {
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

function getMediaType(mimetype: unknown, url: string | null): AdHistoryMediaType {
  if (typeof mimetype === "string") {
    const normalized = mimetype.toLowerCase();
    if (normalized.startsWith("video/")) return "video";
    if (normalized.startsWith("image/")) return "image";
  }

  if (url) {
    if (/\.(mp4|mov|webm|mkv)(\?|$)/i.test(url)) return "video";
    if (/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url)) return "image";
  }

  return "unknown";
}

function getMediaUrl(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  const record = getRecord(value);
  if (!record) return null;

  const candidates = [
    record.location,
    record.url,
    record.path,
    record.mediaUrl,
    record.fileUrl,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

function getFullAddress(item: Record<string, unknown>): string {
  const addressRecord =
    getRecord(item.addressDetails) ??
    getRecord(item.address) ??
    getRecord(item.targetLocation);

  if (!addressRecord) return "-";

  const parts = [
    typeof addressRecord.address === "string" ? addressRecord.address.trim() : "",
    typeof addressRecord.city === "string" ? addressRecord.city.trim() : "",
    typeof addressRecord.state === "string" ? addressRecord.state.trim() : "",
    typeof addressRecord.country === "string" ? addressRecord.country.trim() : "",
    typeof addressRecord.zipCode === "string" ? addressRecord.zipCode.trim() : "",
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "-";
}

function getTargetLocation(item: Record<string, unknown>): string {
  const address =
    getRecord(item.addressDetails) ??
    getRecord(item.address) ??
    getRecord(item.targetLocation);

  if (address) {
    const city = typeof address.city === "string" ? address.city.trim() : "";
    const country =
      typeof address.country === "string" ? address.country.trim() : "";

    if (city && country) {
      return `${city}, ${country}`;
    }

    const formatted =
      typeof address.address === "string" ? address.address.trim() : "";

    if (formatted) return formatted;
  }

  if (typeof item.targetLocation === "string" && item.targetLocation.trim()) {
    return item.targetLocation.trim();
  }

  return "-";
}

function getServiceName(item: Record<string, unknown>): string {
  const service = getRecord(item.service);
  if (typeof service?.name === "string" && service.name.trim()) {
    return service.name.trim();
  }

  const category = getRecord(item.category);
  if (typeof category?.name === "string" && category.name.trim()) {
    return category.name.trim();
  }

  if (typeof item.categoryName === "string" && item.categoryName.trim()) {
    return item.categoryName.trim();
  }

  return "-";
}

function getPackageDetails(item: Record<string, unknown>): {
  packageName: string;
  packageInterval: string;
  packageAmount: number | null;
} {
  const packageRecord =
    getRecord(item.package) ?? getRecord(item.plan);

  const packageName =
    (typeof packageRecord?.name === "string" && packageRecord.name.trim()) ||
    "-";

  const packageInterval =
    (typeof packageRecord?.interval === "string" &&
      packageRecord.interval.trim().toLowerCase()) ||
    packageName.toLowerCase();

  const amount = packageRecord?.amount;
  const packageAmount =
    amount === undefined || amount === null ? null : toNumber(amount);

  return { packageName, packageInterval, packageAmount };
}

function parseAdHistoryItem(value: unknown): AdHistoryItem | null {
  const item = getRecord(value);
  if (!item) return null;

  const id =
    parseId(item._id) ||
    parseId(item.id) ||
    "";

  if (!id) return null;

  const mediaRecord = getRecord(item.media);
  const mediaUrl = getMediaUrl(item.media ?? item.mediaUrl ?? item.adMedia);
  const mediaType = getMediaType(
    mediaRecord?.mimetype ?? mediaRecord?.mimeType ?? item.mediaType,
    mediaUrl,
  );
  const { packageName, packageInterval, packageAmount } = getPackageDetails(item);
  const radiusValue = item.targetRadiusMiles;

  return {
    id,
    createdAt: formatAdHistoryDate(
      item.createdAt ?? item.created_at ?? item.date,
    ),
    activeUntil: formatAdHistoryDate(item.activeUntil),
    status: typeof item.status === "string" ? item.status.trim().toLowerCase() : "",
    mediaUrl,
    mediaType,
    mediaFileName:
      typeof mediaRecord?.fileName === "string"
        ? mediaRecord.fileName.trim()
        : "",
    targetLocation: getTargetLocation(item),
    fullAddress: getFullAddress(item),
    targetRadiusMiles:
      radiusValue === undefined || radiusValue === null
        ? null
        : toNumber(radiusValue),
    serviceName: getServiceName(item),
    link: typeof item.link === "string" ? item.link.trim() : "",
    packageName,
    packageInterval,
    packageAmount,
  };
}

function parsePagination(value: unknown): AdHistoryPagination {
  const pagination = getRecord(value) ?? {};

  return {
    itemsPerPage: toNumber(pagination.itemsPerPage, 10),
    currentPage: toNumber(pagination.currentPage, 1),
    totalItems: toNumber(pagination.totalItems),
    totalPages: Math.max(1, toNumber(pagination.totalPages, 1)),
  };
}

function getHistoryPayload(data: unknown): {
  advertisements: unknown[];
  pagination: AdHistoryPagination;
} {
  const record = getRecord(data);
  if (!record) {
    return {
      advertisements: Array.isArray(data) ? data : [],
      pagination: parsePagination(null),
    };
  }

  if (Array.isArray(record.data)) {
    return {
      advertisements: record.data,
      pagination: parsePagination(record.pagination),
    };
  }

  const nested = getRecord(record.data);

  if (nested) {
    const advertisements = Array.isArray(nested.advertisements)
      ? nested.advertisements
      : Array.isArray(nested.items)
        ? nested.items
        : Array.isArray(nested.ads)
          ? nested.ads
          : [];

    return {
      advertisements,
      pagination: parsePagination(nested.pagination ?? record.pagination),
    };
  }

  return {
    advertisements: Array.isArray(record.advertisements)
      ? record.advertisements
      : Array.isArray(record.data)
        ? record.data
        : [],
    pagination: parsePagination(record.pagination),
  };
}

export function parseAdHistoryFromResponse(data: unknown): AdHistoryResult {
  const { advertisements, pagination } = getHistoryPayload(data);

  return {
    items: advertisements
      .map(parseAdHistoryItem)
      .filter((item): item is AdHistoryItem => item !== null),
    pagination,
  };
}

export function filterAdHistoryByPackage(
  items: AdHistoryItem[],
  filter: AdHistoryFilter,
): AdHistoryItem[] {
  if (filter === "all") {
    return items;
  }

  return items.filter((item) => matchesAdHistoryPackageFilter(item, filter));
}

function matchesAdHistoryPackageFilter(
  item: AdHistoryItem,
  filter: AdHistoryFilter,
): boolean {
  const packageName = item.packageName.trim().toLowerCase();
  const packageInterval = item.packageInterval.trim().toLowerCase();

  switch (filter) {
    case "daily":
      return packageName === "daily" || packageInterval === "day";
    case "weekly":
      return packageName === "weekly" || packageInterval === "week";
    case "monthly":
      return packageName === "monthly" || packageInterval === "month";
    default:
      return true;
  }
}
