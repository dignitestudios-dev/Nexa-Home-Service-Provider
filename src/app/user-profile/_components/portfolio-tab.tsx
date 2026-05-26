"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUserDocsQuery } from "@/hooks/user/use-user-docs-query";
import type { UserDocFile } from "@/types/user-docs.types";

type TileSize = { colSpan: number; rowSpan: number };

/** Repeating Pinterest-style mix: large, small, tall, wide tiles. */
const TILE_PATTERNS: TileSize[] = [
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 },
];

function dedupePortfolioItems(items: UserDocFile[]): UserDocFile[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.url || item.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getTilePattern(index: number): TileSize {
  return TILE_PATTERNS[index % TILE_PATTERNS.length];
}

function PortfolioSkeleton() {
  return (
    <div className="grid grid-flow-dense grid-cols-2 gap-3 auto-rows-[120px] md:grid-cols-4 md:auto-rows-[130px] md:[grid-template-columns:2fr_1fr_1fr_2fr]">
      {TILE_PATTERNS.map((pattern, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[14px] bg-[#E8E8E8]"
          style={{
            gridColumn: `span ${pattern.colSpan}`,
            gridRow: `span ${pattern.rowSpan}`,
          }}
        />
      ))}
    </div>
  );
}

export function PortfolioTab() {
  const { data, isLoading } = useUserDocsQuery();
  const [previewItem, setPreviewItem] = useState<UserDocFile | null>(null);

  const portfolioItems = useMemo(
    () => dedupePortfolioItems(data?.portfolioMedia ?? []),
    [data?.portfolioMedia],
  );

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
        <div
          className="grid grid-flow-dense grid-cols-2 gap-3 auto-rows-[120px] md:grid-cols-4 md:auto-rows-[130px] md:[grid-template-columns:2fr_1fr_1fr_2fr]"
        >
          {portfolioItems.map((item, index) => {
            const { colSpan, rowSpan } = getTilePattern(index);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPreviewItem(item)}
                className="group relative h-full min-h-0 w-full overflow-hidden rounded-[14px] bg-[rgba(0,88,100,0.08)] cursor-pointer"
                style={{
                  gridColumn: `span ${colSpan}`,
                  gridRow: `span ${rowSpan}`,
                }}
                aria-label="Open portfolio item"
              >
                {item.isVideo ? (
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
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                )}

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

      <Dialog
        open={Boolean(previewItem)}
        onOpenChange={(open) => !open && setPreviewItem(null)}
      >
        <DialogContent className="max-w-[min(960px,95vw)] border-none bg-black/95 p-2 sm:p-4">
          <DialogTitle className="sr-only">Portfolio preview</DialogTitle>
          {previewItem?.url ? (
            previewItem.isVideo ? (
              <video
                src={previewItem.url}
                controls
                autoPlay
                className="mx-auto max-h-[80vh] w-full rounded-[12px] object-contain"
              />
            ) : (
              <Image
                src={previewItem.url}
                alt=""
                width={1200}
                height={800}
                className="mx-auto max-h-[80vh] w-auto max-w-full rounded-[12px] object-contain"
                unoptimized
              />
            )
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
