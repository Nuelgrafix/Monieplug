import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  createEvent: boolean;
  purchaseTicket: boolean;
  eventDetails: boolean;
}

interface UIState {
  modals: ModalState;
  loading: {
    global: boolean;
    specific: Record<string, boolean>;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
}

const initialState: UIState = {
  modals: {
    createEvent: false,
    purchaseTicket: false,
    eventDetails: false,
  },
  loading: {
    global: false,
    specific: {},
  },
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<keyof ModalState>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof ModalState>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      state.modals = {
        createEvent: false,
        purchaseTicket: false,
        eventDetails: false,
      };
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setSpecificLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading.specific[action.payload.key] = action.payload.loading;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  openModal,
  closeModal,
  closeAllModals,
  setGlobalLoading,
  setSpecificLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;