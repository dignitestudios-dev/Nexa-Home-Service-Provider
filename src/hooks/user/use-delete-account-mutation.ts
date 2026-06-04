"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { clearAuthSession } from "@/lib/auth-session";
import { toast } from "@/lib/toast";
import { userService } from "@/services/user.service";

export function useDeleteAccountMutation() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => userService.deleteAccount(),
    onSuccess: (response) => {
      clearAuthSession(dispatch);
      queryClient.clear();
      toast.fromApiSuccess(response, "Account deleted successfully.");
      router.replace("/auth/login");
    },
    onError: (error) => {
      toast.fromApiError(error, "Failed to delete account. Please try again.");
    },
  });
}
