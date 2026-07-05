import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "@/types/authType";

export type credentialsLoginState = {
  loginResponse: UserType | undefined | null; // Define the proper type based on the response structure
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

const initialState: credentialsLoginState = {
  loginResponse: parsedUser,
};
const saveCredentials = createSlice({
  name: "saveCredentials",
  initialState,
  reducers: {
    saveUserDetails: (state, action) => {
      console.log("action", action)
      localStorage.setItem("USER", JSON.stringify(action.payload));
      state.loginResponse = action.payload;
    },
    clearUserDetails: (state) => {
      state.loginResponse = null;
      localStorage.removeItem("USER");
    },
  },
});

export const { saveUserDetails, clearUserDetails } = saveCredentials.actions;
export default saveCredentials.reducer;
