import type { User } from "@/store/slices/auth-slice";

export interface OwnUserProfileResponse {
  success?: boolean;
  message?: string;
  data?: User;
}
