"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";

import PaginationControls from "@/components/ui/pagination-controls";
import { useReceivedReviewsQuery } from "@/hooks/reviews/use-received-reviews-query";
import { useCurrentUserQuery } from "@/hooks/user/use-current-user-query";
import type { UserReview } from "@/types/review.types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const REVIEWS_PER_PAGE = 9;

function ReviewCardSkeleton() {
  return (
    <div className="relative animate-pulse pt-[61px]">
      <div className="absolute left-[26px] top-0 z-10 h-[122px] w-[122px] rounded-full bg-[#E8E8E8]" />
      <div className="rounded-[34px] bg-[rgba(0,88,100,0.06)] px-5 pb-5 pt-[70px]">
        <div className="mb-3 space-y-2">
          <div className="h-6 w-40 rounded-md bg-[#E8E8E8]" />
          <div className="h-5 w-32 rounded-md bg-[#E8E8E8]" />
          <div className="h-5 w-24 rounded-md bg-[#E8E8E8]" />
        </div>
        <div className="mb-3 flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-[15px] w-[15px] rounded-sm bg-[#E8E8E8]" />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded-md bg-[#E8E8E8]" />
          <div className="h-4 w-full rounded-md bg-[#E8E8E8]" />
          <div className="h-4 w-4/5 rounded-md bg-[#E8E8E8]" />
        </div>
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: REVIEWS_PER_PAGE }).map((_, index) => (
        <ReviewCardSkeleton key={index} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: UserReview }) {
  return (
    <div className="relative min-w-0 pt-[61px]">
      <div className="absolute left-[26px] top-0 z-10 h-[122px] w-[122px] overflow-hidden rounded-full border-4 border-[#F8F8F8] bg-[#005864] shadow-sm">
        {review.profilePictureUrl ? (
          <Image
            src={review.profilePictureUrl}
            alt={`${review.name} profile`}
            width={122}
            height={122}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <span className="flex h-full w-full select-none items-center justify-center text-[22px] font-semibold text-white">
            {review.initials}
          </span>
        )}
      </div>

      <div className="h-full min-w-0 overflow-hidden rounded-[34px] bg-[rgba(0,88,100,0.06)] px-5 pb-5 pt-[70px]">
        <div className="mb-3 flex min-w-0 flex-col items-start gap-[2px]">
          <span className="break-words text-[20px] font-medium leading-[25px] text-[#000000]">
            {review.name}
          </span>
          <span className="break-words text-[16px] font-medium leading-[20px] text-[#005864]">
            {review.jobTitle}
          </span>
          <span className="text-[16px] font-normal leading-[20px] text-[rgba(24,24,24,0.6)]">
            {review.date}
          </span>
        </div>

        <div className="mb-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <Star
              key={starIndex}
              className={`h-[15px] w-[15px] shrink-0 ${
                starIndex < review.rating
                  ? "fill-[#EDAF35] text-[#EDAF35]"
                  : "fill-none text-[rgba(24,24,24,0.2)]"
              }`}
            />
          ))}
        </div>

        <p className="break-words text-[16px] font-normal leading-[26px] text-[rgba(24,24,24,0.6)]">
          {review.comment}
        </p>
      </div>
    </div>
  );
}

export function ReviewsTab() {
  const [page, setPage] = useState(1);
  const { data: currentUser } = useCurrentUserQuery();
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const userId = currentUser?._id ?? storedUser?._id;

  const { data, isLoading, isFetching, isError, refetch } = useReceivedReviewsQuery({
    userId,
    page,
    limit: REVIEWS_PER_PAGE,
  });

  const reviews = data?.reviews ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;
  const showLoading = isLoading || isFetching;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-[20px] font-bold leading-[22px] text-black">Reviews</h3>

      {showLoading ? (
        <ReviewsSkeleton />
      ) : isError ? (
        <div className="rounded-[12px] bg-white p-6 text-center">
          <p className="text-[15px] text-black/70">
            Unable to load reviews. Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : data?.summary.totalReviews === 0 ? (
        <div className="flex h-[220px] items-center justify-center text-[16px] font-medium text-[#005864]">
          No reviews yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4 flex justify-end"
          />
        </>
      )}
    </div>
  );
}
