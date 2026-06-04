import {
  DEFAULT_JOB_FILTERS,
  MAX_FILTER_DISTANCE_MILES,
  MIN_FILTER_DISTANCE_MILES,
  type JobFilters,
  type JobTypeFilter,
} from "@/types/job-filters.types";

export type HomeJobsPageParams = {
  filters: JobFilters;
  search: string;
};

type SearchParamsLike = {
  get: (key: string) => string | null;
};

function parseJobType(value: string | null): JobTypeFilter {
  if (value === "one-time" || value === "recurring") {
    return value;
  }

  return null;
}

function parseCategoryIds(value: string | null): string[] {
  if (!value?.trim()) return [];

  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function parseDistance(value: string | null): number {
  if (!value?.trim()) {
    return DEFAULT_JOB_FILTERS.distanceMiles;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_JOB_FILTERS.distanceMiles;
  }

  return Math.min(
    MAX_FILTER_DISTANCE_MILES,
    Math.max(MIN_FILTER_DISTANCE_MILES, Math.round(parsed)),
  );
}

export function parseHomeJobsPageParams(
  searchParams: SearchParamsLike,
): HomeJobsPageParams {
  return {
    search: searchParams.get("q")?.trim() ?? "",
    filters: {
      jobType: parseJobType(searchParams.get("type")),
      categoryIds: parseCategoryIds(searchParams.get("categories")),
      distanceMiles: parseDistance(searchParams.get("distance")),
    },
  };
}

export function buildHomeJobsPageQueryString({
  filters,
  search,
}: HomeJobsPageParams): string {
  const params = new URLSearchParams();

  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    params.set("q", trimmedSearch);
  }

  if (filters.jobType) {
    params.set("type", filters.jobType);
  }

  if (filters.categoryIds.length > 0) {
    params.set("categories", filters.categoryIds.join(","));
  }

  if (filters.distanceMiles !== DEFAULT_JOB_FILTERS.distanceMiles) {
    params.set("distance", String(filters.distanceMiles));
  }

  return params.toString();
}

export function buildHomeJobsPageHref(params: HomeJobsPageParams): string {
  const query = buildHomeJobsPageQueryString(params);
  return query ? `/home?${query}` : "/home";
}

export function sanitizeHomeReturnTo(value: string | null | undefined): string {
  if (!value?.trim()) return "/home";

  try {
    const decoded = decodeURIComponent(value.trim());
    if (!decoded.startsWith("/home") || decoded.startsWith("//")) {
      return "/home";
    }

    return decoded;
  } catch {
    return "/home";
  }
}

export function buildJobDetailHref(
  jobId: string,
  homeParams: HomeJobsPageParams,
): string {
  const returnTo = encodeURIComponent(buildHomeJobsPageHref(homeParams));
  return `/jobs/${jobId}?returnTo=${returnTo}`;
}
