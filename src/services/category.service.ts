import { API } from "@/lib/axios";

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

export interface CategoryPagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data: CategoryItem[];
  pagination?: CategoryPagination;
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseCategory(raw: unknown): CategoryItem | null {
  const item = getRecord(raw);
  if (!item) return null;

  const id =
    (typeof item._id === "string" && item._id.trim()) ||
    (typeof item.id === "string" && item.id.trim()) ||
    "";

  if (!id) return null;

  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!name) return null;

  const credits =
    item.credits === null || item.credits === undefined
      ? null
      : toNumber(item.credits, NaN);

  const iconRecord = getRecord(item.icon);

  return {
    _id: id,
    name,
    credits: credits != null && Number.isFinite(credits) ? credits : null,
    icon: iconRecord
      ? {
          _id:
            (typeof iconRecord._id === "string" && iconRecord._id) ||
            (typeof iconRecord.id === "string" && iconRecord.id) ||
            "",
          filename:
            typeof iconRecord.filename === "string" ? iconRecord.filename : "",
          location:
            typeof iconRecord.location === "string" ? iconRecord.location : "",
        }
      : undefined,
  };
}

function parsePagination(raw: unknown): CategoryPagination {
  const pagination = getRecord(raw) ?? {};

  return {
    itemsPerPage: toNumber(pagination.itemsPerPage, 10),
    currentPage: toNumber(pagination.currentPage, 1),
    totalItems: toNumber(pagination.totalItems),
    totalPages: Math.max(1, toNumber(pagination.totalPages, 1)),
  };
}

function parseCategoriesResponse(data: unknown): GetCategoriesResponse {
  const record = getRecord(data);
  if (!record) {
    return {
      success: false,
      message: "",
      data: [],
      pagination: parsePagination(null),
    };
  }

  const nested = getRecord(record.data);
  const list = Array.isArray(record.data)
    ? record.data
    : Array.isArray(nested?.categories)
      ? nested.categories
      : Array.isArray(nested?.data)
        ? nested.data
        : Array.isArray(record.categories)
          ? record.categories
          : [];

  const resolvedPagination = getRecord(nested?.pagination)
    ? parsePagination(nested?.pagination)
    : getRecord(record.pagination)
      ? parsePagination(record.pagination)
      : parsePagination({
          itemsPerPage: list.length || 10,
          currentPage: 1,
          totalItems: list.length,
          totalPages: 1,
        });

  return {
    success: Boolean(record.success),
    message: typeof record.message === "string" ? record.message : "",
    data: list
      .map(parseCategory)
      .filter((item): item is CategoryItem => item !== null),
    pagination: resolvedPagination,
  };
}

const CATEGORIES_PAGE_LIMIT = 100;

export const categoryService = {
  getCategories: async (
    page = 1,
    limit = CATEGORIES_PAGE_LIMIT,
  ): Promise<GetCategoriesResponse> => {
    const { data } = await API.get(`/category`, {
      params: { page, limit },
    });

    return parseCategoriesResponse(data);
  },

  getAllCategories: async (
    limit = CATEGORIES_PAGE_LIMIT,
  ): Promise<GetCategoriesResponse> => {
    const allCategories: CategoryItem[] = [];
    let page = 1;
    let totalPages = 1;
    let lastResponse: GetCategoriesResponse | null = null;

    while (page <= totalPages) {
      const response = await categoryService.getCategories(page, limit);
      lastResponse = response;
      allCategories.push(...response.data);
      totalPages = response.pagination?.totalPages ?? 1;

      // Safety: stop if API returns empty page before totalPages ends
      if (response.data.length === 0) break;

      page += 1;
    }

    // Deduplicate by id in case pages overlap
    const uniqueCategories = Array.from(
      new Map(allCategories.map((item) => [item._id, item])).values(),
    );

    return {
      success: lastResponse?.success ?? true,
      message: lastResponse?.message ?? "",
      data: uniqueCategories,
      pagination: {
        itemsPerPage: uniqueCategories.length,
        currentPage: 1,
        totalItems: uniqueCategories.length,
        totalPages: 1,
      },
    };
  },
};
