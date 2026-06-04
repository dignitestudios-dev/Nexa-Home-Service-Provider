"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseAdHistoryFromResponse } from "@/lib/parse-ad-history-response";
import { advertisementService } from "@/services/advertisement.service";
import {
  AD_HISTORY_PAGE_LIMIT,
  type AdHistoryItem,
} from "@/types/advertisement.types";
import type { RootState } from "@/store/index";

export const AD_HISTORY_QUERY_KEY = ["advertisement", "my"] as const;

type UseAdHistoryQueryOptions = {
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
};

async function fetchAllAdHistory(
  startDate?: string,
  endDate?: string,
): Promise<AdHistoryItem[]> {
  const allItems: AdHistoryItem[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await advertisementService.getMyAdvertisements({
      page,
      limit: AD_HISTORY_PAGE_LIMIT,
      startDate,
      endDate,
    });
    const parsed = parseAdHistoryFromResponse(response);

    allItems.push(...parsed.items);
    totalPages = parsed.pagination.totalPages;
    page += 1;
  }

  return allItems;
}

export function useAdHistoryQuery({
  startDate,
  endDate,
  enabled = true,
}: UseAdHistoryQueryOptions = {}) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: [...AD_HISTORY_QUERY_KEY, startDate ?? "", endDate ?? ""],
    queryFn: () => fetchAllAdHistory(startDate, endDate),
    enabled: enabled && (hasToken || isAuthenticated),
    refetchOnMount: "always",
  });
}
