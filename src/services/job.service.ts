import { API } from "@/lib/axios";

type ProviderFeedParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: "one-time" | "recurring";
  categoryIds?: string[];
  radius?: number;
};

type MyApplicationsParams = {
  tab: "applied" | "confirmed" | "completed";
  page?: number;
  limit?: number;
};

export const jobService = {
  getProviderFeed: async ({
    page = 1,
    limit = 10,
    search,
    type,
    categoryIds,
    radius,
  }: ProviderFeedParams = {}) => {
    const trimmedSearch = search?.trim();
    const params: Record<string, string | number | string[]> = {
      page,
      limit,
    };

    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    if (type) {
      params.type = type;
    }

    if (categoryIds?.length) {
      params.category = categoryIds;
    }

    if (radius != null) {
      params.radius = radius;
    }

    const { data } = await API.get("/job/provider-feed", {
      params,
      paramsSerializer: {
        indexes: null,
      },
    });
    return data;
  },

  getMyApplications: async ({
    tab,
    page = 1,
    limit = 10,
  }: MyApplicationsParams) => {
    const { data } = await API.get("/job/my-applications", {
      params: { tab, page, limit },
    });
    return data;
  },

  getJobById: async (jobId: string) => {
    const { data } = await API.get(`/job/provider/${jobId}`);
    return data;
  },

  applyToJob: async (jobId: string) => {
    const { data } = await API.post(`/job/${jobId}/apply`);
    return data;
  },
};
