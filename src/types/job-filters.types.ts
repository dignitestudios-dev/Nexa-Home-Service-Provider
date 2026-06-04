export type JobTypeFilter = "one-time" | "recurring" | null;

export type JobFilters = {
  jobType: JobTypeFilter;
  categoryIds: string[];
  distanceMiles: number;
};

export const DEFAULT_JOB_FILTERS: JobFilters = {
  jobType: null,
  categoryIds: [],
  distanceMiles: 25,
};

export const MIN_FILTER_DISTANCE_MILES = 1;
export const MAX_FILTER_DISTANCE_MILES = 75;

export const MAX_FILTER_CATEGORIES = 20;
