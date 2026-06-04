import { API } from "@/lib/axios";
import type { SubscriptionPlanType } from "@/types/subscription-plan.types";

export type CreateCheckoutSessionPayload = {
  amount: number;
  success_url: string;
  cancel_url: string;
};

type GetSubscriptionPlansParams = {
  type: SubscriptionPlanType;
};

export type CancelSubscriptionPayload = {
  planId: string;
};

export type PurchaseSubscriptionPayload = {
  planId: string;
  success_url: string;
  cancel_url: string;
};

type GetTransactionsParams = {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export const billingService = {
  createCheckoutSession: async (payload: CreateCheckoutSessionPayload) => {
    const { data } = await API.post("/billing/checkout-session", payload);
    return data;
  },

  getSubscriptionPlans: async ({ type }: GetSubscriptionPlansParams) => {
    const { data } = await API.get("/billing/subscription-plans", {
      params: { type },
    });
    return data;
  },

  cancelSubscription: async (payload: CancelSubscriptionPayload) => {
    const { data } = await API.post("/billing/subscription-cancel", payload);
    return data;
  },

  purchaseSubscription: async (payload: PurchaseSubscriptionPayload) => {
    const { data } = await API.post("/billing/subscription-purchase", payload);
    return data;
  },

  getTransactions: async ({
    page = 1,
    limit = 10,
    startDate,
    endDate,
  }: GetTransactionsParams = {}) => {
    const params: Record<string, string | number> = { page, limit };

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    const { data } = await API.get("/billing/transactions", { params });
    return data;
  },

  getTransactionById: async (id: string) => {
    const { data } = await API.get(`/billing/transactions/${id}`);
    return data;
  },
};
