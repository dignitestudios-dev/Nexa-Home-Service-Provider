import { useQuery } from "@tanstack/react-query";

import { categoryService } from "@/services/category.service";

export const CATEGORIES_QUERY_KEY = ["categories", "all"] as const;

/** Fetches every category page so dropdowns show the full list. */
export function useGetCategories(_page = 1, _limit = 100) {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoryService.getAllCategories(),
  });
}
