import { apiSlice } from "../slices/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    talentLogin: builder.mutation({
      query: (data) => ({
        url: "talent/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    companyLogin: builder.mutation({
      query: (data) => ({
        url: "company/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    talentRegister: builder.mutation({
      query: (data) => ({
        url: "talent/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    companyRegister: builder.mutation({
      query: (data) => ({
        url: "company/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    talentSendOtp: builder.mutation({
      query: (data) => ({
        url: "talent/auth/signup/send_otp",
        method: "POST",
        body: data,
      }),
    }),
    companySendOtp: builder.mutation({
      query: (data) => ({
        url: "company/auth/signup/send_otp",
        method: "POST",
        body: data,
      }),
    }),
    talentValidateOtp: builder.mutation({
      query: (data) => ({
        url: "talent/auth/validate_otp",
        method: "POST",
        body: data,
      }),
    }),
    companyValidateOtp: builder.mutation({
      query: (data) => ({
        url: "company/auth/validate_otp",
        method: "POST",
        body: data,
      }),
    }),
    talentforgotPasswordSendOtp: builder.mutation({
      query: (data) => ({
        url: "talent/auth/forgot_password/send_otp",
        method: "POST",
        body: data,
      }),
    }),
    talentForgotPasswordReset: builder.mutation({
      query: (data) => ({
        url: "talent/auth/forgot_password",
        method: "POST",
        body: data,
      }),
    }),
    companyforgotPasswordSendOtp: builder.mutation({
      query: (data) => ({
        url: "company/auth/forgot_password/send_otp",
        method: "POST",
        body: data,
      }),
    }),
    companyForgotPasswordReset: builder.mutation({
      query: (data) => ({
        url: "company/auth/forgot_password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useTalentLoginMutation,
  useCompanyLoginMutation,
  useTalentRegisterMutation,
  useCompanyRegisterMutation,
  useTalentSendOtpMutation,
  useCompanySendOtpMutation,
  useTalentValidateOtpMutation,
  useCompanyValidateOtpMutation,
  useCompanyForgotPasswordResetMutation,
  useTalentForgotPasswordResetMutation,
  useCompanyforgotPasswordSendOtpMutation,
  useTalentforgotPasswordSendOtpMutation,
} = authApiSlice;
