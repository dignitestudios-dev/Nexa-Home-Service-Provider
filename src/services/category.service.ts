// services/category.service.ts

import { API } from "@/lib/axios";

// =========================
// TYPES
// =========================

export interface CategoryItem {
  _id: string;
  name: string;
  credits: number | null;

  icon?: {
    _id: string;
    filename: string;
    location: string;
  };
}

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data: CategoryItem[];
}

// =========================
// SERVICE
// =========================

export const categoryService = {
  getCategories: async (
    page = 1,
    limit = 10,
  ): Promise<GetCategoriesResponse> => {
    const { data } = await API.get(`/category?page=${page}&limit=${limit}`);

    return data;
  },
};
