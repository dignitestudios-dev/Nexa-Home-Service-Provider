"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";

import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";

export type GalleryMediaItem = {
  id: string;
  url: string;
  isVideo: boolean;
};

type MediaGalleryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: GalleryMediaItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  title?: string;
};

export default function MediaGalleryModal({
  open,
  onOpenChange,
  items,
  currentIndex,
  onIndexChange,
  title = "Media gallery",
}: MediaGalleryModalProps) {
  const currentItem = items[currentIndex];
  const hasMultiple = items.length > 1;

  const goToPrevious = () => {
    if (!hasMultiple) return;
    onIndexChange(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    if (!hasMultiple) return;
    onIndexChange(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && hasMultiple) {
        event.preventDefault();
        onIndexChange(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
      }

      if (event.key === "ArrowRight" && hasMultiple) {
        event.preventDefault();
        onIndexChange(
          currentIndex === items.length - 1 ? 0 : currentIndex + 1,
        );
      }

      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, items.length, hasMultiple, onIndexChange, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/70 backdrop-blur-[2px]" />

        <DialogPrimitive.Content className="fixed inset-0 z-[210] flex outline-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0">
          <DialogTitle className="sr-only">{title}</DialogTitle>

          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6">
            {hasMultiple ? (
              <p className="rounded-full bg-black/35 px-3 py-1 text-[14px] font-medium text-white">
                {currentIndex + 1} / {items.length}
              </p>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/50"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {hasMultiple ? (
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/50 sm:left-6 sm:h-12 sm:w-12"
              aria-label="Previous item"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : null}

          <div className="flex h-full w-full items-center justify-center px-14 py-16 sm:px-20">
            {currentItem?.isVideo ? (
              <video
                key={currentItem.url}
                src={currentItem.url}
                controls
                autoPlay
                className="max-h-[calc(100vh-8rem)] max-w-[calc(100vw-7rem)] object-contain"
              />
            ) : currentItem ? (
              <Image
                key={currentItem.url}
                src={currentItem.url}
                alt={`Portfolio item ${currentIndex + 1}`}
                width={1600}
                height={1200}
                className="max-h-[calc(100vh-8rem)] max-w-[calc(100vw-7rem)] object-contain"
                unoptimized
              />
            ) : null}
          </div>

          {hasMultiple ? (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/50 sm:right-6 sm:h-12 sm:w-12"
              aria-label="Next item"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
