import { API } from "@/lib/axios";
import { CATEGORY_ID_PATTERN } from "@/lib/schemas/profile-setup.schema";

function normalizeCategoryIDs(ids: string[]): string[] {
  const unique = [...new Set(ids.map((id) => id.trim()))];
  return unique.filter((id) => CATEGORY_ID_PATTERN.test(id));
}

function appendCategoryIDs(formData: FormData, categoryIDs: string[]) {
  const normalized = normalizeCategoryIDs(categoryIDs);

  if (normalized.length === 1) {
    formData.append("categoryIDs[0]", normalized[0]);
    return;
  }

  normalized.forEach((id) => {
    formData.append("categoryIDs", id);
  });
}

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  overview?: string;
  categoryIDs?: string[];
  profilePicture?: File | null;
};

export type EditPortfolioMediaPayload = {
  portfolioMedia?: File[];
  deleteFileIds?: string[];
};

export const userService = {
  getOwn: async () => {
    const { data } = await API.get("/user/own");
    return data;
  },

  getDocs: async () => {
    const { data } = await API.get("/user/docs");
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const formData = new FormData();

    if (payload.name !== undefined) {
      formData.append("name", payload.name);
    }

    if (payload.phone) {
      formData.append("phone", payload.phone);
    }

    if (payload.overview !== undefined) {
      formData.append("overview", payload.overview);
    }

    if (payload.categoryIDs !== undefined) {
      appendCategoryIDs(formData, payload.categoryIDs);
    }

    if (payload.profilePicture) {
      formData.append("profilePicture", payload.profilePicture);
    }

    const { data } = await API.post("/user/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  editPortfolioMedia: async ({
    portfolioMedia = [],
    deleteFileIds = [],
  }: EditPortfolioMediaPayload) => {
    const formData = new FormData();

    portfolioMedia.forEach((file) => {
      formData.append("portfolioMedia", file);
    });

    deleteFileIds.forEach((fileId) => {
      formData.append("deleteFileIds", fileId);
    });

    const { data } = await API.post("/user/edit-portfolio-media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  deleteAccount: async () => {
    const { data } = await API.delete("/user");
    return data;
  },
};
