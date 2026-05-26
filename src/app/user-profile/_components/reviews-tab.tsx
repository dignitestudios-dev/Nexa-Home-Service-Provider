import React from "react";
import { Star } from "lucide-react";

export interface Review {
  name: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsTabProps {
  reviews?: Review[];
}

const DEFAULT_REVIEWS: Review[] = [
  {
    name: "Alexander Jack",
    initials: "AJ",
    rating: 5,
    comment:
      "Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi. Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi.",
    date: "09/09/2025",
  },
  {
    name: "Alexander Jack",
    initials: "AJ",
    rating: 4,
    comment:
      "Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi. Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi.",
    date: "09/09/2025",
  },
  {
    name: "Alexander Jack",
    initials: "AJ",
    rating: 5,
    comment:
      "Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi. Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi.",
    date: "09/09/2025",
  },
];

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviews = DEFAULT_REVIEWS,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-[20px] font-bold leading-[22px] text-black">
        Reviews
      </h3>

      {/* 3-column grid matching Figma layout */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <div key={i} className="relative pt-[61px]">
            {/* Floating avatar — overlaps top of card */}
            <div className="absolute left-[26px] top-0 z-10 h-[122px] w-[122px] rounded-full border-4 border-[#F8F8F8] bg-[#005864] flex items-center justify-center shadow-sm">
              <span className="text-[22px] font-semibold text-white select-none">
                {r.initials}
              </span>
            </div>

            {/* Card body */}
            <div className="rounded-[34px] bg-[rgba(0,88,100,0.06)] px-5 pb-5 pt-[70px] h-full">
              {/* Name + date row */}
              <div className="mb-3 flex flex-col items-start gap-[2px]">
                <span className="text-[20px] font-medium leading-[25px] text-[#000000]">
                  {r.name}
                </span>
                <span className="text-[16px] font-normal leading-[20px] text-[rgba(24,24,24,0.6)]">
                  {r.date}
                </span>
              </div>

              {/* Stars */}
              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-[15px] w-[15px] ${
                      s < r.rating
                        ? "fill-[#EDAF35] text-[#EDAF35]"
                        : "fill-none text-[rgba(24,24,24,0.2)]"
                    }`}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-[16px] font-normal leading-[26px] text-[rgba(24,24,24,0.6)]">
                {r.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
