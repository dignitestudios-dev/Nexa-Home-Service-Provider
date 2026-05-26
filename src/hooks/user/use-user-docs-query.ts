"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseUserDocsFromResponse } from "@/lib/parse-user-docs";
import { userService } from "@/services/user.service";
import type { RootState } from "@/store/index";

export const USER_DOCS_QUERY_KEY = ["user", "docs"] as const;

export function useUserDocsQuery() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: USER_DOCS_QUERY_KEY,
    queryFn: async () => {
      const response = await userService.getDocs();
      const docs = parseUserDocsFromResponse(response);
      if (!docs) {
        throw new Error("Invalid user docs response");
      }
      return docs;
    },
    enabled: hasToken || isAuthenticated,
  });
}
