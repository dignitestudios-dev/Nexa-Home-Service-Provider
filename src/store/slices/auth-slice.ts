import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
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
    },
    singUp: (
      state,
      action: PayloadAction<{
        token: { access: string; refresh: string };
      }>,
    ) => {
      state.isAuthenticated = true;
      state.isGuestMode = false;
      state.accessToken = action.payload.token.access;
      state.refreshToken = action.payload.token.refresh;
      state.user = action.payload.user;
      state.isResetPasswordFlow = action.payload.isResetPasswordFlow || false;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token.access);
      localStorage.removeItem("guest_mode");
    },
  },
});

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
