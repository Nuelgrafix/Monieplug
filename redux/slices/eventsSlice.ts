import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  content?: Array<{ type: string; text: string }>;
}

interface EventsState {
  popularEvents: Event[];
  upcomingEvents: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  popularEvents: [],
  upcomingEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEventsSuccess: (state, action: PayloadAction<{ popular: Event[]; upcoming: Event[] }>) => {
      state.popularEvents = action.payload.popular;
      state.upcomingEvents = action.payload.upcoming;
      state.loading = false;
      state.error = null;
    },
    fetchEventsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentEvent: (state, action: PayloadAction<Event>) => {
      state.currentEvent = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    createEventStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEventSuccess: (state, action: PayloadAction<Event>) => {
      state.upcomingEvents.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    createEventFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loadInitialEvents: (state, action: PayloadAction<{ popular: Event[]; upcoming: Event[] }>) => {
      state.popularEvents = action.payload.popular;
      state.upcomingEvents = action.payload.upcoming;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFailure,
  setCurrentEvent,
  clearCurrentEvent,
  createEventStart,
  createEventSuccess,
  createEventFailure,
  loadInitialEvents,
  clearError,
} = eventsSlice.actions;

export default eventsSlice.reducer;