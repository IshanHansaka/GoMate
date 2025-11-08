import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  // The "reducerPath" is a unique key for this slice
  reducerPath: 'api',

  // We'll use the dummyjson base URL [cite: 41]
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),

  // "endpoints" are the specific API calls we can make
  endpoints: (builder) => ({
    // This is a "mutation" because it changes data (logs the user in)
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login', // The endpoint path
        method: 'POST',
        body: credentials,
      }),
    }),

    // TODO: We will add a 'getDestinations' query here later
  }),
});

// Export the auto-generated hook for the "login" mutation
export const { useLoginMutation } = apiSlice;
