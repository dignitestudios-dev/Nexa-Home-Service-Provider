// services/profileSetup.service.ts

import { API } from "@/lib/axios";

// =========================
// TYPES
// =========================

export interface CompleteProfilePayload {
  name: string;
  overview?: string;
  referralCode?: string;

  label: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;

  longitude: number;
  latitude: number;

  categoryIDs: string[];
}

export interface UploadBusinessDocsPayload {
  businessLicense?: File;
  taxRegistration?: File;
  businessOwnershipCert?: File;
  proofOfAddress?: File;
}

export interface UploadPortfolioPayload {
  portfolioMedia: File[];
}

export interface UploadIdDocsPayload {
  idCardFront?: File;

  idCardBack?: File;
}

// =========================
// SERVICE
// =========================

export const profileSetupService = {
  completeProfile: async (payload: CompleteProfilePayload) => {
    const formData = new FormData();

    formData.append("name", payload.name);

    if (payload.overview) {
      formData.append("overview", payload.overview);
    }

    if (payload.referralCode) {
      formData.append("referralCode", payload.referralCode);
    }

    formData.append("label", payload.label);
    formData.append("address", payload.address);
    formData.append("country", payload.country);
    formData.append("state", payload.state);
    formData.append("city", payload.city);
    formData.append("zipCode", payload.zipCode);

    formData.append("longitude", String(payload.longitude));
    formData.append("latitude", String(payload.latitude));

    // multiple categoryIDs
    payload.categoryIDs.forEach((id) => {
      formData.append("categoryIDs", id);
    });

    // formData.append("categoryIDs", JSON.stringify(payload.categoryIDs));

    const { data } = await API.post("/user/complete-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  uploadBusinessDocs: async (payload: UploadBusinessDocsPayload) => {
    const formData = new FormData();

    if (payload.businessLicense) {
      formData.append("businessLicense", payload.businessLicense);
    }

    if (payload.taxRegistration) {
      formData.append("taxRegistration", payload.taxRegistration);
    }

    if (payload.businessOwnershipCert) {
      formData.append("businessOwnershipCert", payload.businessOwnershipCert);
    }

    if (payload.proofOfAddress) {
      formData.append("proofOfAddress", payload.proofOfAddress);
    }

    const { data } = await API.post("/user/upload-business-docs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // UPLOAD PORTFOLIO
  // =========================

  uploadPortfolioMedia: async (payload: UploadPortfolioPayload) => {
    const formData = new FormData();

    payload.portfolioMedia.forEach((file) => {
      formData.append("portfolioMedia", file);
    });

    const { data } = await API.post("/user/upload-portfolio-media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  uploadIdDocs: async (payload: UploadIdDocsPayload) => {
    const formData = new FormData();

    if (payload.idCardFront) {
      formData.append("idCardFront", payload.idCardFront);
    }

    if (payload.idCardBack) {
      formData.append("idCardBack", payload.idCardBack);
    }

    const { data } = await API.post("/user/upload-id-docs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
};
