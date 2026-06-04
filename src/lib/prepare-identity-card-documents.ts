import { compressImageFileIfNeeded } from "@/lib/compress-image-file";
import type { IdentityCardFormData } from "@/lib/schemas/profile-setup.schema";
import type { UploadIdDocsPayload } from "@/services/onboard.service";

export async function prepareIdentityCardDocumentsForUpload(
  data: IdentityCardFormData,
): Promise<UploadIdDocsPayload> {
  const [idCardFront, idCardBack] = await Promise.all([
    compressImageFileIfNeeded(data.idCardFront),
    compressImageFileIfNeeded(data.idCardBack),
  ]);

  return {
    idCardFront,
    idCardBack,
  };
}
