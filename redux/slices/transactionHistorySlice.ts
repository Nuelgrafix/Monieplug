import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionHistoryItem } from "@/types/authType";

interface TransactionHistoryState {
  transactions: TransactionHistoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionHistoryState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionHistorySlice = createSlice({
  name: "transactionHistory",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<TransactionHistoryItem[]>) => {
      state.transactions = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setTransactions, setLoading, setError, clearTransactions } =
  transactionHistorySlice.actions;
export default transactionHistorySlice.reducer;
