import { API } from "@/lib/axios";
import type {
  PromoteAdvertisementPayload,
  PromoteAdvertisementResponse,
} from "@/types/advertisement.types";

type GetMyAdvertisementsParams = {
  page?: number;
  limit?: number;
  package?: string;
  startDate?: string;
  endDate?: string;
};

export const advertisementService = {
  promote: async (
    payload: PromoteAdvertisementPayload,
  ): Promise<PromoteAdvertisementResponse> => {
    const formData = new FormData();
    formData.append("media", payload.media);
    formData.append("addressId", payload.addressId);
    formData.append("targetRadiusMiles", String(payload.targetRadiusMiles));
    formData.append("categoryId", payload.categoryId);
    formData.append("link", payload.link);
    formData.append("planId", payload.planId);
    formData.append("success_url", payload.success_url);
    formData.append("cancel_url", payload.cancel_url);

    const { data } = await API.post<PromoteAdvertisementResponse>(
      "/advertisement/promote",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  },

  getMyAdvertisements: async ({
    page = 1,
    limit = 10,
    package: packageFilter,
    startDate,
    endDate,
  }: GetMyAdvertisementsParams = {}) => {
    const params: Record<string, string | number> = { page, limit };

    if (packageFilter) {
      params.package = packageFilter;
    }

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    const { data } = await API.get("/advertisement/my", { params });
    return data;
  },
};
