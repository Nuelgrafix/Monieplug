// Application constants and configuration

// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    UPDATE: '/events',
    DELETE: '/events',
    BY_ID: (id: string) => `/events/${id}`,
  },
  TICKETS: {
    PURCHASE: '/tickets/purchase',
    MY_TICKETS: '/tickets/my-tickets',
    VALIDATE: '/tickets/validate',
  },
  PAYMENTS: {
    INITIATE: '/payments/initiate',
    VERIFY: '/payments/verify',
    WEBHOOK: '/payments/webhook',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  LANDING: '/landingpage',
  DASHBOARD: '/dashboard',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/dashboard/profile',
  EVENTS: '/dashboard/events',
  EVENT_DETAILS: (id: string) => `/dashboard/events/${id}`,
  SCAN_TO_PAY: '/dashboard/scantopay',
  SETTINGS: '/dashboard/settings',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  MODAL_Z_INDEX: 50,
  LOADING_SPINNER_SIZE: 32,
  PAGINATION_LIMIT: 20,
} as const;

// Validation Constants
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  EVENT: {
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
  },
} as const;

// Payment Constants
export const PAYMENT_CONSTANTS = {
  CURRENCY: 'NGN',
  CHARGES_PERCENTAGE: 0.025, // 2.5%
  MINIMUM_CHARGE: 250,
  SUPPORTED_CURRENCIES: ['NGN', 'USD', 'EUR'],
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    DOCUMENTS: ['application/pdf', 'text/plain'],
  },
  EVENT_IMAGE_MAX_SIZE: 2 * 1024 * 1024, // 2MB for event images
} as const;

// Cache Constants
export const CACHE_KEYS = {
  EVENTS: 'events',
  USER_EVENTS: 'user_events',
  USER_PROFILE: 'user_profile',
  PAYMENT_HISTORY: 'payment_history',
} as const;

export const CACHE_TTL = {
  EVENTS: 5 * 60 * 1000, // 5 minutes
  USER_DATA: 10 * 60 * 1000, // 10 minutes
  PAYMENT_DATA: 30 * 60 * 1000, // 30 minutes
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access to this resource is forbidden.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  EVENT_NOT_FOUND: 'Event not found.',
  TICKET_SOLD_OUT: 'This event is sold out.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  EVENT_CREATED: 'Event created successfully!',
  TICKET_PURCHASED: 'Ticket purchased successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
} as const;

// Status Constants
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Event Categories
export const EVENT_CATEGORIES = [
  'Music',
  'Sports',
  'Technology',
  'Business',
  'Arts',
  'Food & Drink',
  'Health',
  'Education',
  'Entertainment',
  'Other',
] as const;

// Ticket Types
export const TICKET_TYPES = [
  { label: 'Regular', price: 13000, color: 'bg-orange-100 text-orange-500' },
  { label: 'Standard', price: 50000, color: 'bg-blue-100 text-blue-500' },
  { label: 'Premium', price: 100000, color: 'bg-indigo-100 text-indigo-500' },
] as const;

// Color Constants
export const COLORS = {
  PRIMARY: '#1E35C8',
  SECONDARY: '#5075FF',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
  BACKGROUND: '#F5F5F5',
  CARD_BACKGROUND: '#FFFFFF',
} as const;

// Animation Constants
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN_OUT: 'ease-in-out',
    EASE_OUT: 'ease-out',
    EASE_IN: 'ease-in',
  },
} as const;