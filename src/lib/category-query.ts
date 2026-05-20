// queries/category.query.ts

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export function useGetCategories(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["categories", page, limit],

    queryFn: () => categoryService.getCategories(page, limit),
  });
}
