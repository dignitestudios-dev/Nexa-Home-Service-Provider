import { compressImageFileIfNeeded } from "@/lib/compress-image-file";
import type { BusinessDocumentsFormData } from "@/lib/schemas/profile-setup.schema";
import type { UploadBusinessDocsPayload } from "@/services/onboard.service";

export async function prepareBusinessDocumentsForUpload(
  data: BusinessDocumentsFormData,
): Promise<UploadBusinessDocsPayload> {
  const [
    businessLicense,
    taxRegistration,
    ownershipCertificate,
    proofOfAddress,
  ] = await Promise.all([
    compressImageFileIfNeeded(data.businessLicense),
    compressImageFileIfNeeded(data.taxRegistration),
    compressImageFileIfNeeded(data.ownershipCertificate),
    compressImageFileIfNeeded(data.proofOfAddress),
  ]);

  return {
    businessLicense,
    taxRegistration,
    businessOwnershipCert: ownershipCertificate,
    proofOfAddress,
  };
}
