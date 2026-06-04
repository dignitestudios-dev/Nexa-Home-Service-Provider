import { API } from "@/lib/axios";

type GetReceivedReviewsParams = {
  userId: string;
  page?: number;
  limit?: number;
};

export const reviewService = {
  getReceivedReviews: async ({
    userId,
    page = 1,
    limit = 10,
  }: GetReceivedReviewsParams) => {
    const { data } = await API.get("/review", {
      params: {
        type: "received",
        userId,
        page,
        limit,
      },
    });
    return data;
  },
};
