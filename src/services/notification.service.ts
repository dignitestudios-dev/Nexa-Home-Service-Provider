import { API } from "@/lib/axios";

export const notificationService = {
  getMyNotifications: async () => {
    const { data } = await API.get("/notification/me");
    return data;
  },

  getCount: async () => {
    const { data } = await API.get("/notification/count");
    return data;
  },

  markAsRead: async (notificationId: string) => {
    const { data } = await API.patch("/notification/read", {
      notificationId,
      id: notificationId,
    });
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await API.patch("/notification/all");
    return data;
  },

  clearAll: async () => {
    const { data } = await API.delete("/notification/clear");
    return data;
  },

  deleteNotification: async (notificationId: string) => {
    const id = notificationId.trim();
    const { data } = await API.delete(
      `/notification/${encodeURIComponent(id)}/delete`,
    );
    return data;
  },
};
