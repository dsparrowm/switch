import { apiSlice } from "../api/apiSlice";

export const organizationApiSlice = apiSlice.injectEndpoints({
  endpoints: bulder => ({
    getOrganizationById: bulder.query({
      query: orgId => `/api/organizations/?id=${orgId}`
    }),
  })
});

export const {
  useGetOrganizationByIdQuery
} = organizationApiSlice;