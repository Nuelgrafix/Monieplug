import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "cookies-next";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_API,
  prepareHeaders: (headers) => {
    const token = getCookie("USER");
    if (token) headers.set("Authorization", `Token ${token}`);
  },
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({

    // ── Auth ──────────────────────────────────────────────
    login: builder.mutation({
      query: (credentials) => ({
        url: "/authent/login/",
        method: "POST",
        body: { phone: credentials.phone, password: credentials.password },
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/authent/signup/",
        method: "POST",
        body: userData,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/authent/reset-password/",
        method: "POST",
        body: data,
      }),
    }),
    setPin: builder.mutation({
      query: (pin) => ({
        url: "/authent/set-pin/",
        method: "POST",
        body: pin,
      }),
    }),
    checkTransactionPin: builder.query({
      query: () => "/authent/check-transaction-pin/",
    }),
    transferFunds: builder.mutation({
      query: (data) => ({
        url: "/authent/transfer-funds/",
        method: "POST",
        body: data,
      }),
    }),
    verifyAccount: builder.mutation({
      query: (data) => ({
        url: "/authent/verify-account/",
        method: "POST",
        body: data,
      }),
    }),
    otherBankEnquiry: builder.mutation({
      query: (data) => ({
        url: "/authent/other-bank-enquiry/",
        method: "POST",
        body: { customer: data },
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/authent/verify-email/",
        method: "POST",
        body: data,
      }),
    }),
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/authent/send-otp/",
        method: "POST",
        body: { email },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/authent/forgot-password/",
        method: "POST",
        body: { email },
      }),
    }),
    paymentWebhook: builder.mutation({
      query: (data) => ({
        url: "/authent/webhook/payment/",
        method: "POST",
        body: data,
      }),
    }),
    getBalance: builder.mutation({
      query: (data) => ({
        url: "/authent/get-balance/",
        method: "POST",
        body: data,
      }),
    }),
    getTransactionHistory: builder.mutation({
      query: (data) => ({
        url: "/authent/transaction-history/",
        method: "POST",
        body: data,
      }),
    }),
    getUserById: builder.query({
      query: (id) => `/authent/users/${id}/`,
    }),

    // ── Events ────────────────────────────────────────────
    getEvents: builder.query({
      query: () => "/event/events/",
    }),
    getEventById: builder.query({
      query: (id) => `/event/events/${id}/`,
    }),
    createEvent: builder.mutation({
      // Accepts FormData (for image file upload) or JSON object
      query: (eventData) => ({
        url: "/event/events/",
        method: "POST",
        body: eventData,
      }),
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/event/events/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    patchEvent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/event/events/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/event/events/${id}/`,
        method: "DELETE",
      }),
    }),

    // ── Tickets ───────────────────────────────────────────
    getTickets: builder.query({
      query: () => "/event/tickets/",
    }),
    getTicketById: builder.query({
      query: (id) => `/event/tickets/${id}/`,
    }),
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: "/event/tickets/",
        method: "POST",
        body: ticketData,
      }),
    }),
    updateTicket: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/event/tickets/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    patchTicket: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/event/tickets/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `/event/tickets/${id}/`,
        method: "DELETE",
      }),
    }),
    purchaseTicket: builder.mutation({
      query: (ticketData) => ({
        url: "/tickets/purchase/",
        method: "POST",
        body: ticketData,
      }),
    }),
    ewalletCheckout: builder.mutation({
      query: (data) => ({
        url: "/event/ewallet/checkout/",
        method: "POST",
        body: data,
      }),
    }),
    getUserTickets: builder.query({
      query: () => "/tickets/my-tickets/",
    }),

    // ── Banks ─────────────────────────────────────────────
    getBanks: builder.query({
      query: () => "/authent/banks/",
    }),

    // ── Payments ──────────────────────────────────────────
    initiatePayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payments/initiate/",
        method: "POST",
        body: paymentData,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (reference) => ({
        url: `/payments/verify/${reference}/`,
        method: "GET",
      }),
    }),

    // ── Scan2Pay ──────────────────────────────────────────
    scan2payCheckout: builder.mutation({
      query: (data) => ({
        url: "/scan2pay/checkout/",
        method: "POST",
        body: data,
      }),
    }),
    scan2payUnregistered: builder.mutation({
      query: (data) => ({
        url: "/scan2pay/unregistered/",
        method: "POST",
        body: data,
      }),
    }),
    createQRCode: builder.mutation({
      query: (data) => ({
        url: "/scan2pay/vendor/qrcode/create/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useResetPasswordMutation,
  useSetPinMutation,
  useCheckTransactionPinQuery,
  useTransferFundsMutation,
  useVerifyAccountMutation,
  useOtherBankEnquiryMutation,
  useVerifyEmailMutation,
  usePaymentWebhookMutation,
  useForgotPasswordMutation,
  useSendOtpMutation,
  useGetBalanceMutation,
  useGetTransactionHistoryMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  usePatchEventMutation,
  useDeleteEventMutation,
  useGetTicketsQuery,
  useCreateTicketMutation,
  useGetTicketByIdQuery,
  useUpdateTicketMutation,
  usePatchTicketMutation,
  useDeleteTicketMutation,
  usePurchaseTicketMutation,
  useEwalletCheckoutMutation,
  useGetUserTicketsQuery,
  useGetUserByIdQuery,
  useGetBanksQuery,
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useScan2payCheckoutMutation,
  useScan2payUnregisteredMutation,
  useCreateQRCodeMutation,
} = apiSlice;