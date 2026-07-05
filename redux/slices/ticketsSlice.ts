import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TicketType {
  label: string;
  price: number;
  color: string;
}

export interface TicketVariation {
  id: number;
  name: string;
  fee: string;
  image: string;
  date: string;
}

interface TicketsState {
  selectedTicketIndex: number;
  quantity: number;
  contactInfo: {
    fullName: string;
    email: string;
    confirmEmail: string;
  };
  ticketVariations: TicketVariation[];
  purchaseLoading: boolean;
  purchaseError: string | null;
  purchaseSuccess: boolean;
}

const initialState: TicketsState = {
  selectedTicketIndex: 0,
  quantity: 1,
  contactInfo: {
    fullName: '',
    email: '',
    confirmEmail: '',
  },
  ticketVariations: [
    { id: Date.now(), name: '', fee: '', image: '', date: '' },
  ],
  purchaseLoading: false,
  purchaseError: null,
  purchaseSuccess: false,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    selectTicket: (state, action: PayloadAction<number>) => {
      state.selectedTicketIndex = action.payload;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = Math.max(1, action.payload);
    },
    updateContactInfo: (state, action: PayloadAction<Partial<TicketsState['contactInfo']>>) => {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
    },
    addTicketVariation: (state) => {
      state.ticketVariations.push({
        id: Date.now(),
        name: '',
        fee: '',
        image: '',
        date: '',
      });
    },
    updateTicketVariation: (state, action: PayloadAction<{ id: number; field: Exclude<keyof TicketVariation, 'id'>; value: string }>) => {
      const { id, field, value } = action.payload;
      const variation = state.ticketVariations.find(v => v.id === id);
      if (variation) {
        variation[field] = value;
      }
    },
    removeTicketVariation: (state, action: PayloadAction<number>) => {
      state.ticketVariations = state.ticketVariations.filter(v => v.id !== action.payload);
    },
    purchaseStart: (state) => {
      state.purchaseLoading = true;
      state.purchaseError = null;
      state.purchaseSuccess = false;
    },
    purchaseSuccess: (state) => {
      state.purchaseLoading = false;
      state.purchaseError = null;
      state.purchaseSuccess = true;
    },
    purchaseFailure: (state, action: PayloadAction<string>) => {
      state.purchaseLoading = false;
      state.purchaseError = action.payload;
      state.purchaseSuccess = false;
    },
    resetPurchase: (state) => {
      state.purchaseLoading = false;
      state.purchaseError = null;
      state.purchaseSuccess = false;
    },
    resetTicketFlow: (state) => {
      state.selectedTicketIndex = 0;
      state.quantity = 1;
      state.contactInfo = { fullName: '', email: '', confirmEmail: '' };
      state.purchaseLoading = false;
      state.purchaseError = null;
      state.purchaseSuccess = false;
    },
  },
});

export const {
  selectTicket,
  setQuantity,
  updateContactInfo,
  addTicketVariation,
  updateTicketVariation,
  removeTicketVariation,
  purchaseStart,
  purchaseSuccess,
  purchaseFailure,
  resetPurchase,
  resetTicketFlow,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;