"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import { CURRENT_USER_QUERY_KEY } from "@/hooks/user/use-current-user-query";
import { persistAuthUser } from "@/lib/auth-session";
import { parseUserProfileFromResponse } from "@/lib/parse-user-profile";
import { toast } from "@/lib/toast";
import {
  userService,
  type UpdateProfilePayload,
} from "@/services/user.service";
import type { RootState } from "@/store/index";
import { singUp } from "@/store/slices/auth-slice";

export function useUpdateProfileMutation() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      userService.updateProfile(payload),
    onSuccess: (response, variables) => {
      const parsedUser = parseUserProfileFromResponse(response);

      if (parsedUser) {
        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, parsedUser);
        persistAuthUser(parsedUser);
        dispatch(singUp(parsedUser));
      } else if (currentUser) {
        const updatedCategories =
          variables.categoryIDs?.map((id) => {
            const existing = currentUser.selectedCategories?.find(
              (category) => category.id === id,
            );

            return {
              id,
              name: existing?.name ?? "",
            };
          }) ?? currentUser.selectedCategories;

        const updatedUser = {
          ...currentUser,
          name: variables.name ?? currentUser.name,
          phone: variables.phone ?? currentUser.phone,
          overview: variables.overview ?? currentUser.overview,
          selectedCategories: updatedCategories,
        };

        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, updatedUser);
        persistAuthUser(updatedUser);
        dispatch(singUp(updatedUser));
      }

      void queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      toast.fromApiSuccess(response, "Profile updated successfully.");
    },
    onError: (error) => {
      toast.fromApiError(error, "Unable to update profile. Please try again.");
    },
  });
}
