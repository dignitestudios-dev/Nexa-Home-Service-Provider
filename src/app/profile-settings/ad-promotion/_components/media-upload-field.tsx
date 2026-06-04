"use client";

import { FolderUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { toast } from "@/lib/toast";

const MAX_MEDIA_FILE_SIZE_MB = 20;
const MAX_MEDIA_FILE_SIZE_BYTES = MAX_MEDIA_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
]);
const ALLOWED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
const ACCEPTED_MEDIA_TYPES =
  "image/png,image/jpeg,image/gif,image/webp,video/*";

function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

function isAllowedImageFile(file: File): boolean {
  const mimeType = file.type.toLowerCase();
  if (ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
    return true;
  }

  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();

  return ALLOWED_IMAGE_EXTENSIONS.includes(extension);
}

type MediaUploadFieldProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
};

export default function MediaUploadField({
  file,
  onFileChange,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      onFileChange(null);
      return;
    }

    if (selectedFile.size > MAX_MEDIA_FILE_SIZE_BYTES) {
      toast.error(
        `File size must be ${MAX_MEDIA_FILE_SIZE_MB}MB or less. Please choose a smaller image or video.`,
      );
      event.target.value = "";
      return;
    }

    if (!isVideoFile(selectedFile) && !isAllowedImageFile(selectedFile)) {
      toast.error("Only PNG, JPEG, GIF, and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    onFileChange(selectedFile);
  };

  const isVideo = file ? isVideoFile(file) : false;

  return (
    <div>
      <p className="text-[16px] font-[500] leading-5 text-black">
        Upload Image/Video
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative mt-2 h-[155px] w-full overflow-hidden rounded-[15px] border border-dashed border-[#005864] bg-[rgba(0,88,100,0.06)] transition hover:opacity-95"
      >
        {previewUrl ? (
          <>
            {isVideo ? (
              <video
                src={previewUrl}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${previewUrl})` }}
                aria-hidden
              />
            )}

            <div className="absolute inset-0 bg-black/35" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
              <FolderUp
                className="h-[29px] w-[29px] text-white"
                strokeWidth={1.8}
              />
              <span className="mt-3 max-w-full truncate text-[14px] leading-[18px] text-white">
                {file?.name ?? "choose file to upload"}
              </span>
              <span className="mt-1 text-[12px] leading-4 text-white/80">
                Tap to change
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-4">
            <FolderUp
              className="h-[29px] w-[29px] text-[#005864]"
              strokeWidth={1.8}
            />
            <span className="mt-3 text-[14px] leading-[18px] text-[#181818]">
              choose file to upload
            </span>
            <span className="mt-1 text-[12px] leading-4 text-[rgba(24,24,24,0.6)]">
              PNG, JPEG, GIF, WebP · Max {MAX_MEDIA_FILE_SIZE_MB}MB
            </span>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MEDIA_TYPES}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
