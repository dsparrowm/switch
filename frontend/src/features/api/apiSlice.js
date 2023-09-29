import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../utils/APIRoutes';
// import { login, logout } from '../auth/authSlice';


const baseQuery = fetchBaseQuery({
  baseUrl: host,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

// Leave this here incase we need to refresh tokens later
const baseQueryWithWrapper =  async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  // Refresh token here.
  // if (result?.error?.originalStatus === 403) {

  // } else {

  // }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithWrapper,
  endpoints: build => ({})
});