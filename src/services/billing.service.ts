import { API } from "@/lib/axios";

export type CreateCheckoutSessionPayload = {
  amount: number;
  success_url: string;
  cancel_url: string;
};

export const billingService = {
  createCheckoutSession: async (payload: CreateCheckoutSessionPayload) => {
    const { data } = await API.post("/billing/checkout-session", payload);
    return data;
  },
};
