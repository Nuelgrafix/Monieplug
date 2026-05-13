import { deleteCookie, setCookie } from "@/app/lib/cookie-setter";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "@/types/authType";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type AuthSliceType = {
  saveCredentials: any;
  auth?: any;
  user: UserType | User | undefined | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const isWindowDefined = typeof window !== "undefined";
const USER = isWindowDefined ? localStorage.getItem("USER") : null;
let parsedUser = null;

try {
  parsedUser = USER ? JSON.parse(USER) : null;
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(`Failed to parse USER from localStorage: ${error}`);
}

const initialState: AuthSliceType = {
  saveCredentials: [],
  user: parsedUser,
  token: USER,
  isAuthenticated: !!parsedUser,
  auth: undefined,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      if (action.payload.talentData) {
        setCookie("TalentId", action.payload.talentData.id);
      }
      if (action.payload.companyData) {
        setCookie("CompanyId", action.payload.companyData.id);
      }
      setCookie("USER", action.payload.token);
      localStorage.setItem("USER", JSON.stringify(action.payload));
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      deleteCookie("USER");
      deleteCookie("TalentId");
      deleteCookie("CompanyId");
      localStorage.removeItem("USER");
      state.loading = false;
      state.error = null;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      // Also update cookies and localStorage for consistency
      setCookie("USER", action.payload.token);
      localStorage.setItem("USER", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      // Also update cookies and localStorage for consistency
      setCookie("USER", action.payload.token);
      localStorage.setItem("USER", JSON.stringify(action.payload.user));
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  saveUser,
  logout,
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  clearError,
  updateUser,
} = authSlice.actions;
export default authSlice.reducer;
