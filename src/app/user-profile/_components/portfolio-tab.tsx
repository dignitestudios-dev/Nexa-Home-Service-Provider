"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import MediaGalleryModal from "@/components/media/media-gallery-modal";
import { useUserDocsQuery } from "@/hooks/user/use-user-docs-query";
import type { UserDocFile } from "@/types/user-docs.types";

function dedupePortfolioItems(items: UserDocFile[]): UserDocFile[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.url || item.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function PortfolioSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[4/3] w-full animate-pulse rounded-[14px] bg-[#E8E8E8]"
        />
      ))}
    </div>
  );
}

export function PortfolioTab() {
  const { data, isLoading } = useUserDocsQuery();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const portfolioItems = useMemo(
    () => dedupePortfolioItems(data?.portfolioMedia ?? []),
    [data?.portfolioMedia],
  );

  const galleryItems = useMemo(
    () => portfolioItems.filter((item) => Boolean(item.url)),
    [portfolioItems],
  );

  const openGallery = (item: UserDocFile) => {
    const index = galleryItems.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      setPreviewIndex(index);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[20px] font-bold leading-[22px] text-black">
        Portfolio
      </h3>

      {isLoading ? (
        <PortfolioSkeleton />
      ) : portfolioItems.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-[16px] font-medium text-[#005864]">
          No portfolio media uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {portfolioItems.map((item, index) => {
            return (
              <button
                key={item.id}
                type="button"
                disabled={!item.url}
                onClick={() => openGallery(item)}
                className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[14px] bg-[rgba(0,88,100,0.08)] shadow-sm transition hover:shadow-md disabled:cursor-default"
                aria-label={`Open portfolio item ${index + 1}`}
              >
                {item.url ? (
                  item.isVideo ? (
                    <video
                      src={item.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  )
                ) : null}

                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

                {item.isVideo ? (
                  <div className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                    <div className="ml-[2px] border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      <MediaGalleryModal
        open={previewIndex !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewIndex(null);
        }}
        items={galleryItems}
        currentIndex={previewIndex ?? 0}
        onIndexChange={setPreviewIndex}
        title="Portfolio gallery"
      />
    </div>
  );
}
