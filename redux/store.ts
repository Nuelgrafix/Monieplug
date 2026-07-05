import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import authReducer from "./slices/authSlice";
import saveCredentialsReducer from "./slices/saveCredentials";
import eventsReducer from "./slices/eventsSlice";
import ticketsReducer from "./slices/ticketsSlice";
import uiReducer from "./slices/uiSlice";
import transactionHistoryReducer from "./slices/transactionHistorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    saveCredentials: saveCredentialsReducer,
    events: eventsReducer,
    tickets: ticketsReducer,
    ui: uiReducer,
    transactionHistory: transactionHistoryReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
