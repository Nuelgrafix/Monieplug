export interface UserType {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TransactionHistoryItem {
  date: string;
  description: string;
  amount: string;
  positive: boolean;
}

export interface TransactionHistoryPayload {
  accountNumber: string;
  fromDate: string;
  toDate: string;
  numberOfItems: string;
}

export interface TransactionHistoryResponse {
  transactions?: TransactionHistoryItem[];
  data?: TransactionHistoryItem[];
  results?: TransactionHistoryItem[];
  message?: string;
}