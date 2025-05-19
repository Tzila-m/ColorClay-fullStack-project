import apiSlice from "./apiSlice"

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (registerUser) => ({
        url: "/api/register",
        method: "POST",
        body: registerUser,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLogoutMutation } = authApiSlice;

export default authApiSlice;
