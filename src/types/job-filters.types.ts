export type JobTypeFilter = "one-time" | "recurring" | null;

export type JobFilters = {
  jobType: JobTypeFilter;
  categoryIds: string[];
  distanceMiles: number;
};

export const DEFAULT_JOB_FILTERS: JobFilters = {
  jobType: null,
  categoryIds: [],
  distanceMiles: 10,
};

export const MAX_FILTER_CATEGORIES = 20;
