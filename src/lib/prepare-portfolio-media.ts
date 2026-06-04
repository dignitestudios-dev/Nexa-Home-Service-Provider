import { compressImageFileIfNeeded } from "@/lib/compress-image-file";
import { isPortfolioImage } from "@/lib/portfolio-media-validation";

export async function preparePortfolioMediaForUpload(
  files: File[],
): Promise<File[]> {
  return Promise.all(
    files.map(async (file) => {
      if (!isPortfolioImage(file)) {
        return file;
      }

      return compressImageFileIfNeeded(file);
    }),
  );
}
