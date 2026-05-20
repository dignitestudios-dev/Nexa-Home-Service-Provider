"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAuthTokenCookie, persistAuthUser } from "@/lib/auth-session";
import { parseUserProfileFromResponse } from "@/lib/parse-user-profile";
import { userService } from "@/services/user.service";
import type { RootState } from "@/store/index";
import { singUp } from "@/store/slices/auth-slice";

export const CURRENT_USER_QUERY_KEY = ["user", "own"] as const;

export function useCurrentUserQuery() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  const query = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      const response = await userService.getOwn();
      const user = parseUserProfileFromResponse(response);
      if (!user) {
        throw new Error("Invalid user profile response");
      }
      return user;
    },
    enabled: hasToken || isAuthenticated,
  });

  useEffect(() => {
    if (!query.data) return;
    persistAuthUser(query.data);
    dispatch(singUp(query.data));
  }, [query.data, dispatch]);

  return query;
}
