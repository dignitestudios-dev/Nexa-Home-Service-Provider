"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseReviewsFromResponse } from "@/lib/parse-reviews-response";
import { reviewService } from "@/services/review.service";
import type { RootState } from "@/store/index";

export const RECEIVED_REVIEWS_QUERY_KEY = ["review", "received"] as const;

type UseReceivedReviewsQueryOptions = {
  userId?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
};

export function useReceivedReviewsQuery({
  userId,
  page = 1,
  limit = 10,
  enabled = true,
}: UseReceivedReviewsQueryOptions) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: [...RECEIVED_REVIEWS_QUERY_KEY, userId, page, limit],
    queryFn: async () => {
      const response = await reviewService.getReceivedReviews({
        userId: userId!,
        page,
        limit,
      });
      const result = parseReviewsFromResponse(response);
      if (!result) {
        throw new Error("Invalid reviews response");
      }
      return result;
    },
    enabled: (hasToken || isAuthenticated) && Boolean(userId) && enabled,
  });
}
