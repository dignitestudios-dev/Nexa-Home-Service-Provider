import { API } from "@/lib/axios";

export const userService = {
  getOwn: async () => {
    const { data } = await API.get("/user/own");
    return data;
  },

  getDocs: async () => {
    const { data } = await API.get("/user/docs");
    return data;
  },
};
