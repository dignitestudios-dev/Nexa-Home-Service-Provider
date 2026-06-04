"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { USER_DOCS_QUERY_KEY } from "@/hooks/user/use-user-docs-query";
import { toast } from "@/lib/toast";
import { userService } from "@/services/user.service";

type UpdatePortfolioPayload = {
  newFiles: File[];
  removedMediaIds: string[];
};

export function useUpdatePortfolioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ newFiles, removedMediaIds }: UpdatePortfolioPayload) => {
      if (newFiles.length === 0 && removedMediaIds.length === 0) {
        throw new Error("At least one portfolio change is required.");
      }

      return userService.editPortfolioMedia({
        portfolioMedia: newFiles,
        deleteFileIds: removedMediaIds,
      });
    },
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: USER_DOCS_QUERY_KEY });
      toast.fromApiSuccess(response, "Portfolio updated successfully.");
    },
    onError: (error) => {
      toast.fromApiError(error, "Unable to update portfolio. Please try again.");
    },
  });
}
