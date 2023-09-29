import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: bulder => ({
    login: bulder.mutation({
      query: credentials => ({
        url: '/login',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    register: bulder.mutation({
      query: credentials => ({
        url: '/register',
        method: 'POST',
        body: { ...credentials }
      })
    }),
  })
});

export const {
  useLoginMutation,
  useRegisterMutation
} = authApiSlice;