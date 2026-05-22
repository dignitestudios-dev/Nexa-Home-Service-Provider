export const PORTFOLIO_MAX_FILES = 5;

export const PORTFOLIO_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

/** Videos allowed; max size when no separate limit is specified. */
export const PORTFOLIO_VIDEO_MAX_BYTES = 50 * 1024 * 1024;

export const PORTFOLIO_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"] as const;

export const PORTFOLIO_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const PORTFOLIO_ACCEPT_INPUT =
  "image/png,image/jpeg,.png,.jpg,.jpeg,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov";

export function isPortfolioImage(file: File): boolean {
  return PORTFOLIO_IMAGE_MIME_TYPES.includes(
    file.type as (typeof PORTFOLIO_IMAGE_MIME_TYPES)[number],
  );
}

export function isPortfolioVideo(file: File): boolean {
  return PORTFOLIO_VIDEO_MIME_TYPES.includes(
    file.type as (typeof PORTFOLIO_VIDEO_MIME_TYPES)[number],
  );
}

export function validatePortfolioFile(file: File): string | null {
  if (!isPortfolioImage(file) && !isPortfolioVideo(file)) {
    return `"${file.name}" must be PNG/JPEG image or MP4/WebM/MOV video.`;
  }

  if (isPortfolioImage(file) && file.size > PORTFOLIO_IMAGE_MAX_BYTES) {
    return `"${file.name}" exceeds 10MB image limit.`;
  }

  if (isPortfolioVideo(file) && file.size > PORTFOLIO_VIDEO_MAX_BYTES) {
    return `"${file.name}" exceeds 50MB video limit.`;
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
