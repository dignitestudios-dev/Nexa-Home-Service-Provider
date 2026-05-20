"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  getAuthTokenCookie,
  getPersistedAuthUser,
} from "@/lib/auth-session";
import { setToken, singUp } from "@/store/slices/auth-slice";

/** Restores JWT + user from cookie/localStorage after refresh. */
export function AuthHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getAuthTokenCookie();
    if (token) {
      dispatch(setToken(token));
    }

    const storedUser = getPersistedAuthUser();
    if (storedUser) {
      dispatch(singUp(storedUser));
    }
  }, [dispatch]);

  return null;
}
