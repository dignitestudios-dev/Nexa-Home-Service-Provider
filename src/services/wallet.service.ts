import { API } from "@/lib/axios";

export const walletService = {
  getProviderDashboard: async () => {
    const { data } = await API.get("/wallet/provider/dashboard");
    return data;
  },
};
