export type PromoteAdvertisementPayload = {
  media: File;
  addressId: string;
  targetRadiusMiles: number;
  categoryId: string;
  link: string;
  planId: string;
  success_url: string;
  cancel_url: string;
};

export type PromoteAdvertisementResponse = {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
};

export type AdHistoryFilter = "all" | "daily" | "weekly" | "monthly";

export type AdHistoryMediaType = "image" | "video" | "unknown";

export type AdHistoryItem = {
  id: string;
  createdAt: string;
  activeUntil: string;
  status: string;
  mediaUrl: string | null;
  mediaType: AdHistoryMediaType;
  mediaFileName: string;
  targetLocation: string;
  fullAddress: string;
  targetRadiusMiles: number | null;
  serviceName: string;
  link: string;
  packageName: string;
  packageInterval: string;
  packageAmount: number | null;
};

export type AdHistoryPagination = {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type AdHistoryResult = {
  items: AdHistoryItem[];
  pagination: AdHistoryPagination;
};

export const AD_HISTORY_PAGE_LIMIT = 10;
