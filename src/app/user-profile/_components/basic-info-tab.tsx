"use client";

import { useCurrentUserQuery } from "@/hooks/user/use-current-user-query";
import type { User } from "@/store/slices/auth-slice";

type BasicInfoTabProps = {
  overview?: string | null;
  user?: User | null;
};

function ServiceSkeleton() {
  return (
    <div className="flex flex-wrap gap-[7px]">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[36px] w-32 animate-pulse rounded-full bg-[#E8E8E8]"
        />
      ))}
    </div>
  );
}

export function BasicInfoTab({ overview, user: userProp }: BasicInfoTabProps) {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUserQuery();

  const user = userProp ?? currentUser;
  const selectedCategories = (user?.selectedCategories ?? []).filter((category) =>
    category.name.trim(),
  );

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="text-[20px] font-bold leading-[22px] text-black">Overview</h3>
        <p className="max-w-full break-words whitespace-pre-wrap text-[16px] font-normal leading-[26px] text-[rgba(24,24,24,0.8)]">
          {overview?.trim() || "No overview provided."}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-[20px] font-bold leading-[22px] text-black">Services</h3>
        {isUserLoading ? (
          <ServiceSkeleton />
        ) : selectedCategories.length > 0 ? (
          <div className="flex flex-wrap gap-[7px]">
            {selectedCategories.map((category) => (
              <span
                key={category.id}
                className="rounded-full bg-[rgba(0,88,100,0.06)] px-[10px] py-[8px] text-[16px] font-normal leading-[20px] text-[#005864]"
              >
                {category.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[16px] leading-[26px] text-[rgba(24,24,24,0.8)]">
            No services added yet.
          </p>
        )}
      </div>
    </div>
  );
}
