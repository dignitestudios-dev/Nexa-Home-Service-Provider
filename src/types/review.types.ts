export type ReviewImage = {
  id: string;
  url: string;
  fileName?: string;
};

export type UserReview = {
  id: string;
  name: string;
  initials: string;
  profilePictureUrl: string | null;
  jobTitle: string;
  rating: number;
  comment: string;
  date: string;
  images?: ReviewImage[];
};

export type ReviewRatingDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type ReviewsSummary = {
  averageRating: number;
  totalReviews: number;
  distribution: ReviewRatingDistribution;
};

export type ReviewsPagination = {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type ReviewsResult = {
  summary: ReviewsSummary;
  reviews: UserReview[];
  pagination: ReviewsPagination;
};
