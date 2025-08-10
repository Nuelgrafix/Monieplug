export const API_BASE_URL = process.env.API_BASE_URL;

export const DATE_TIME_MERIDIAN = 'MMM DD, YYYY hh:mm a';

export const CURRENCIES = ['NGN', 'USD'] as const;

export const CURRENCY_OPTIONS = CURRENCIES.map((el) => ({
  value: el,
  label: el,
}));
