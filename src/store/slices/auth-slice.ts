import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  email: string;
  name: string | null;
  role: string;
  authType: string;
  primaryIdentifier: string;
  phone: string | null;
  contactEmail: string | null;
  profilePicture: string | null;
  overview: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isPasswordSet: boolean;
  isProfileCompleted: boolean;
  identityStatus: string;
  isPartnerApproved: boolean;
  isDeactivatedByAdmin: boolean;
  businessDocsSubmitted: boolean;
  portfolioMediaUploaded: boolean;
  providerServicePlan: string;
  referralCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
    singUp: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      console.log("User signed up:---> action payload 27 ", action.payload);
    },
  },
});

export const { setToken, clearAuth, singUp } = authSlice.actions;
export default authSlice.reducer;
