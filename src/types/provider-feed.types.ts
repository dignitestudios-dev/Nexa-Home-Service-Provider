export type ProviderFeedJob = {
  id: string;
  categoryName: string;
  title: string;
  description: string;
  when: string;
  type: string;
  status: string;
  jobProviderStatus: string;
  applicationDisplayStatus: string;
};

export type ProviderFeedPagination = {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type ProviderFeedResult = {
  jobs: ProviderFeedJob[];
  pagination: ProviderFeedPagination;
};
