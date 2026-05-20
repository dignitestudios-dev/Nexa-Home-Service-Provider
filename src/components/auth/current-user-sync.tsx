"use client";

import { useCurrentUserQuery } from "@/hooks/user/use-current-user-query";

/** Fetches `/user/own` and syncs profile into Redux + localStorage. */
export function CurrentUserSync() {
  useCurrentUserQuery();
  return null;
}
