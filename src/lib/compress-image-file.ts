const COMPRESSIBLE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

const COMPRESS_IF_LARGER_THAN_BYTES = 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2048;
const TARGET_MAX_BYTES = 1.5 * 1024 * 1024;
const INITIAL_JPEG_QUALITY = 0.85;
const MIN_JPEG_QUALITY = 0.55;
const QUALITY_STEP = 0.08;

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    image.src = objectUrl;
  });
}

function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to compress image"));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

function getScaledDimensions(
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } {
  const largestSide = Math.max(width, height);

  if (largestSide <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / largestSide;

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function buildCompressedFileName(fileName: string): string {
  const baseName = fileName.replace(/\.[^.]+$/, "").trim() || "document";
  return `${baseName}.jpg`;
}

export function shouldCompressImageFile(file: File): boolean {
  return (
    COMPRESSIBLE_IMAGE_TYPES.has(file.type) &&
    file.size > COMPRESS_IF_LARGER_THAN_BYTES
  );
}

export async function compressImageFileIfNeeded(file: File): Promise<File> {
  if (!shouldCompressImageFile(file)) {
    return file;
  }

  const image = await loadImageElement(file);
  const { width, height } = getScaledDimensions(
    image.naturalWidth,
    image.naturalHeight,
    MAX_IMAGE_DIMENSION,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = INITIAL_JPEG_QUALITY;
  let blob = await canvasToJpegBlob(canvas, quality);

  while (blob.size > TARGET_MAX_BYTES && quality > MIN_JPEG_QUALITY) {
    quality = Math.max(MIN_JPEG_QUALITY, quality - QUALITY_STEP);
    blob = await canvasToJpegBlob(canvas, quality);
  }

  return new File([blob], buildCompressedFileName(file.name), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export async function compressImageFilesIfNeeded(
  files: File[],
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImageFileIfNeeded(file)));
}
