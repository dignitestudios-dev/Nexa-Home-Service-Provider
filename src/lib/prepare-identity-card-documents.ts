import { compressImageFileIfNeeded } from "@/lib/compress-image-file";
import type { IdentityCardFormData } from "@/lib/schemas/profile-setup.schema";
import type { UploadIdDocsPayload } from "@/services/onboard.service";

export async function prepareIdentityCardDocumentsForUpload(
  data: IdentityCardFormData,
): Promise<UploadIdDocsPayload> {
  const [idCardFront, idCardBack, einDocument] = await Promise.all([
    data.idCardFront ? compressImageFileIfNeeded(data.idCardFront) : undefined,
    data.idCardBack ? compressImageFileIfNeeded(data.idCardBack) : undefined,
    data.einDocument ? compressImageFileIfNeeded(data.einDocument) : undefined,
  ]);

  return {
    idCardFront,
    idCardBack,
    einDocument,
  };
}
