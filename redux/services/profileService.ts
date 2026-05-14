import { getCookie } from "cookies-next";
import { apiSlice } from "../slices/apiSlice";
const token = getCookie("USER");
export const ProfileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      talentProfileUpdate: builder.mutation({
        query: (data) => ({
          url: "talent/profile/upload_details",
          method: "POST",
          body: data,
        }),
      }),
      getTalentProfile: builder.query({
        query: (id) => ({
          url: `talent/profile/get_details/${id}`,
        }),
      }),
      talentProfileEdit: builder.mutation({
        query: (data) => ({
          url: "talent/profile/update_details",
          method: "PATCH",
          body: data,
        }),
      }),
    }),
  });
  export const {
 useTalentProfileUpdateMutation,
 useTalentProfileEditMutation,
 useGetTalentProfileQuery,
  } = ProfileApiSlice;
  