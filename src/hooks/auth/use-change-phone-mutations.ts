"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import { CURRENT_USER_QUERY_KEY } from "@/hooks/user/use-current-user-query";
import { persistAuthFromResponse, persistAuthUser } from "@/lib/auth-session";
import { authService } from "@/services/auth.service";
import type { RootState } from "@/store/index";
import { singUp } from "@/store/slices/auth-slice";
import type {
  ChangePhonePayload,
  VerifyChangePhonePayload,
} from "@/types/auth.types";

export function useChangePhone() {
  return useMutation({
    mutationFn: (payload: ChangePhonePayload) => authService.changePhone(payload),
  });
}

export function useVerifyChangePhone() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);

  return useMutation({
    mutationFn: (payload: VerifyChangePhonePayload) =>
      authService.verifyChangePhone(payload),
    onSuccess: async (data, variables) => {
      const { user: nextUser } = persistAuthFromResponse(data, dispatch);

      if (!nextUser && user) {
        const updated = {
          ...user,
          phone: variables.phone,
          isPhoneVerified: true,
        };
        persistAuthUser(updated);
        dispatch(singUp(updated));
      }

      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });
}
