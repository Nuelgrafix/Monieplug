import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "cookies-next";
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_API,
  prepareHeaders: (headers) => {
    const token = getCookie("USER");
    headers.set("Authorization", `Bearer ${token}`);
    // headers.set("accept", "application/json");
    // if(!headers.has("Content-Type")){
    //   headers.set("Content-Type","");
    // }
   
  },
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/authent/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/authent/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/authent/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    setPin: builder.mutation({
      query: (pin) => ({
        url: '/authent/set-pin',
        method: 'POST',
        body: { pin },
      }),
    }),
    transferFunds: builder.mutation({
      query: (data) => ({
        url: '/authent/transfer-funds',
        method: 'POST',
        body: data,
      }),
    }),
    verifyAccount: builder.mutation({
      query: (data) => ({
        url: '/authent/verify-account',
        method: 'POST',
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (code) => ({
        url: '/authent/verify-email',
        method: 'POST',
        body: { code },
      }),
    }),
    paymentWebhook: builder.mutation({
      query: (data) => ({
        url: '/authent/webhook/payment',
        method: 'POST',
        body: data,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => '/auth/me',
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/authent/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    sendOtp: builder.mutation({
      query: (email) => ({
        url: '/authent/send-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    getBalance: builder.mutation({
      query: (data) => ({
        url: '/authent/get-balance',
        method: 'POST',
        body: data,
      }),
    }),

    // Events endpoints
    getEvents: builder.query({
      query: () => '/events',
    }),
    getEventById: builder.query({
      query: (id) => `/events/${id}`,
    }),
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
    }),

    // Tickets endpoints
    purchaseTicket: builder.mutation({
      query: (ticketData) => ({
        url: '/tickets/purchase',
        method: 'POST',
        body: ticketData,
      }),
    }),
    getUserTickets: builder.query({
      query: () => '/tickets/my-tickets',
    }),

    // Banks endpoints
    getBanks: builder.query({
      query: () => '/authent/banks',
    }),

    // Payment endpoints
    initiatePayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/initiate',
        method: 'POST',
        body: paymentData,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (reference) => ({
        url: `/payments/verify/${reference}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useSignupMutation,
  useResetPasswordMutation,
  useSetPinMutation,
  useTransferFundsMutation,
  useVerifyAccountMutation,
  useVerifyEmailMutation,
  usePaymentWebhookMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useSendOtpMutation,
  useGetBalanceMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  usePurchaseTicketMutation,
  useGetUserTicketsQuery,
  useGetBanksQuery,
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
} = apiSlice;
