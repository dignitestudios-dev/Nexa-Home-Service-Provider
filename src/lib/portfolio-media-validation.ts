export const PORTFOLIO_MAX_FILES = 10;

export const PORTFOLIO_IMAGE_MAX_BYTES = 100 * 1024 * 1024;

/** Videos allowed; max size when no separate limit is specified. */
export const PORTFOLIO_VIDEO_MAX_BYTES = 50 * 1024 * 1024;

export const PORTFOLIO_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"] as const;

export const PORTFOLIO_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const PORTFOLIO_ACCEPT_INPUT =
  "image/*,video/*,.png,.jpg,.jpeg,.webp,.gif,.bmp,.svg,.heic,.heif,.mp4,.webm,.mov";

export function isPortfolioImage(file: File): boolean {
  if (file.type && file.type.startsWith("image/")) return true;
  const name = (file.name || "").toLowerCase();
  return /\.(jpe?g|png|webp|gif|bmp|svg|avif|heic|heif|jfif|tiff|ico|raw|cr2|nef)$/i.test(
    name,
  );
}

export function isPortfolioVideo(file: File): boolean {
  if (file.type && file.type.startsWith("video/")) return true;
  const name = (file.name || "").toLowerCase();
  return /\.(mp4|webm|mov|mkv|avi|wmv|flv|m4v|3gp|ogv|ts)$/i.test(name);
}

export function validatePortfolioFile(file: File): string | null {
  if (!isPortfolioImage(file) && !isPortfolioVideo(file)) {
    return `"${file.name}" must be an image or video file.`;
  }

  return null;
}

export function validatePortfolioFileList(files: File[]): string | null {
  if (files.length === 0) {
    return "Please upload at least one image or video.";
  }

  if (files.length > PORTFOLIO_MAX_FILES) {
    return `You can upload up to ${PORTFOLIO_MAX_FILES} items only.`;
  }

  for (const file of files) {
    const error = validatePortfolioFile(file);
    if (error) return error;
  }

  return null;
}
