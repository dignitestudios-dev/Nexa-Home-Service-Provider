"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Play, Upload, X } from "lucide-react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdatePortfolioMutation } from "@/hooks/user/use-update-portfolio-mutation";
import {
  PORTFOLIO_ACCEPT_INPUT,
  PORTFOLIO_MAX_FILES,
  isPortfolioImage,
  isPortfolioVideo,
  validatePortfolioFile,
} from "@/lib/portfolio-media-validation";
import { toast } from "@/lib/toast";
import type { UserDocFile } from "@/types/user-docs.types";

type NewPortfolioItem = {
  id: string;
  file: File;
  previewUrl: string;
  isImage: boolean;
  isVideo: boolean;
};

type EditPortfolioDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioItems: UserDocFile[];
};

const PORTFOLIO_THUMBNAIL_CLASS =
  "relative aspect-square w-[calc((100%-3.75rem)/6)] shrink-0 overflow-hidden rounded-[12px] bg-[#F1F3F4]";

function createNewPortfolioItem(file: File, index: number): NewPortfolioItem {
  return {
    id: `${file.name}-${file.lastModified}-${index}`,
    file,
    isImage: isPortfolioImage(file),
    isVideo: isPortfolioVideo(file),
    previewUrl: URL.createObjectURL(file),
  };
}

export default function EditPortfolioDialog({
  open,
  onOpenChange,
  portfolioItems,
}: EditPortfolioDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updatePortfolioMutation = useUpdatePortfolioMutation();
  const [keptExisting, setKeptExisting] = useState<UserDocFile[]>([]);
  const [newItems, setNewItems] = useState<NewPortfolioItem[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const initialExistingIds = useMemo(
    () => portfolioItems.map((item) => item.id),
    [portfolioItems],
  );

  useEffect(() => {
    if (!open) return;

    setKeptExisting(portfolioItems);
    setNewItems([]);
    setFormError(null);
    setShowDiscardConfirm(false);
  }, [open, portfolioItems]);

  useEffect(() => {
    return () => {
      newItems.forEach((item) => {
        if (item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [newItems]);

  const totalItems = keptExisting.length + newItems.length;
  const hasUnsavedChanges = useMemo(() => {
    const keptIds = keptExisting.map((item) => item.id).sort().join(",");
    const initialIds = [...initialExistingIds].sort().join(",");

    return keptIds !== initialIds || newItems.length > 0;
  }, [initialExistingIds, keptExisting, newItems.length]);

  const removedMediaIds = useMemo(
    () =>
      initialExistingIds.filter(
        (id) => !keptExisting.some((item) => item.id === id),
      ),
    [initialExistingIds, keptExisting],
  );

  const requestClose = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true);
      return;
    }

    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }

    requestClose();
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    onOpenChange(false);
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    const remaining = PORTFOLIO_MAX_FILES - totalItems;
    if (remaining <= 0) {
      toast.error(`You can upload up to ${PORTFOLIO_MAX_FILES} items only.`);
      return;
    }

    const accepted: File[] = [];

    for (const file of selectedFiles) {
      if (accepted.length >= remaining) {
        toast.error(`Only ${PORTFOLIO_MAX_FILES} items allowed in total.`);
        break;
      }

      const validationError = validatePortfolioFile(file);
      if (validationError) {
        toast.error(validationError);
        continue;
      }

      accepted.push(file);
    }

    if (accepted.length === 0) return;

    setNewItems((current) => [
      ...current,
      ...accepted.map((file, index) =>
        createNewPortfolioItem(file, current.length + index),
      ),
    ]);
  };

  const removeExistingItem = (id: string) => {
    setKeptExisting((current) => current.filter((item) => item.id !== id));
  };

  const removeNewItem = (id: string) => {
    setNewItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const handleSave = async () => {
    setFormError(null);

    if (totalItems === 0) {
      setFormError("Please keep or upload at least one portfolio item.");
      toast.error("Please keep or upload at least one portfolio item.");
      return;
    }

    if (!hasUnsavedChanges) {
      onOpenChange(false);
      return;
    }

    try {
      await updatePortfolioMutation.mutateAsync({
        newFiles: newItems.map((item) => item.file),
        removedMediaIds,
      });

      onOpenChange(false);
    } catch {
      setFormError("Unable to update portfolio. Please try again.");
    }
  };

  const isUploadDisabled =
    updatePortfolioMutation.isPending || totalItems >= PORTFOLIO_MAX_FILES;

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-[20px] p-0 sm:max-w-[680px]"
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="border-b border-black/5 px-6 py-5">
          <DialogTitle className="text-[24px] font-semibold leading-[30px] text-[#1C1C1C]">
            Edit Portfolio
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-6 py-5">
          <p className="text-[14px] leading-5 text-[rgba(24,24,24,0.7)]">
            Upload up to {PORTFOLIO_MAX_FILES} items — PNG or JPEG images (max
            10MB each) and MP4, WebM, or MOV videos.
          </p>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={PORTFOLIO_ACCEPT_INPUT}
              multiple
              className="hidden"
              disabled={isUploadDisabled}
              onChange={(event) => {
                handleFilesSelected(Array.from(event.target.files ?? []));
                event.target.value = "";
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadDisabled}
              className="relative flex h-[140px] w-full flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#005864] bg-[rgba(0,88,100,0.06)] px-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload size={28} className="text-[#005864]" />
              <p className="mt-3 text-[15px] font-medium leading-[19px] text-[#1C1C1C]">
                Upload Image or Video
              </p>
              <p className="mt-1 text-[14px] leading-[18px] text-black/70">
                {totalItems}/{PORTFOLIO_MAX_FILES} items selected
              </p>
            </button>
          </div>

          {totalItems > 0 ? (
            <div className="flex flex-wrap gap-3">
              {keptExisting.map((item) => (
                <div key={item.id} className={PORTFOLIO_THUMBNAIL_CLASS}>
                  {item.url ? (
                    item.isVideo ? (
                      <div className="relative h-full w-full">
                        <video
                          src={item.url}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                          <Play size={20} className="fill-white text-white" />
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.fileName}
                        fill
                        sizes="90px"
                        className="object-cover"
                        unoptimized
                      />
                    )
                  ) : null}

                  <button
                    type="button"
                    onClick={() => removeExistingItem(item.id)}
                    disabled={updatePortfolioMutation.isPending}
                    className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                    aria-label={`Remove ${item.fileName}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {newItems.map((item) => (
                <div key={item.id} className={PORTFOLIO_THUMBNAIL_CLASS}>
                  {item.isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : item.isVideo ? (
                    <div className="relative h-full w-full">
                      <video
                        src={item.previewUrl}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <Play size={20} className="fill-white text-white" />
                      </div>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => removeNewItem(item.id)}
                    disabled={updatePortfolioMutation.isPending}
                    className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[12px] bg-[#F8F8F8] px-4 py-6 text-center text-[14px] text-[#005864]">
              No portfolio media yet. Upload your first item above.
            </div>
          )}

          {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={requestClose}
              disabled={updatePortfolioMutation.isPending}
              className="h-11 rounded-[12px] px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={updatePortfolioMutation.isPending}
              className="h-11 rounded-[12px] bg-[#005864] px-8 text-white hover:bg-[#004851]"
            >
              {updatePortfolioMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog
      open={showDiscardConfirm}
      onOpenChange={(isOpen) => {
        if (!isOpen) setShowDiscardConfirm(false);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="z-[220] bg-black/50 backdrop-blur-md" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-[230] grid w-[360px] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-[360px]">
          <div className="flex flex-col items-center px-5 pb-5 pt-8">
            <AlertTriangle
              className="h-[42px] w-[42px] text-[#F01A1A]"
              strokeWidth={2.2}
              aria-hidden
            />

            <div className="mt-3 flex w-full max-w-[280px] flex-col items-center gap-2 text-center">
              <DialogTitle className="w-full text-[24px] font-[700] capitalize leading-[30px] text-[#181818]">
                Unsaved Changes
              </DialogTitle>
              <DialogDescription className="w-full text-[16px] font-[400] leading-5 text-[#181818]/80">
                You have unsaved changes. Are you sure you want to exit without
                saving?
              </DialogDescription>
            </div>

            <div className="mt-6 grid w-full grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="h-[49px] cursor-pointer rounded-[12px] bg-[rgba(0,88,100,0.06)] text-[12px] font-[600] leading-[15px] text-[#005864] transition hover:bg-[rgba(0,88,100,0.1)]"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmDiscard}
                className="h-[49px] cursor-pointer rounded-[12px] bg-[#F01A1A] text-[12px] font-[600] leading-[15px] text-white transition hover:bg-[#d91717]"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
    </>
  );
}
