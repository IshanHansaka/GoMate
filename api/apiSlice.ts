import { logout, setCredentials } from '@/features/auth/authSlice';
import { RootState } from '@/store/store';
import { AuthTokens, LoginFormData, LoginResponse } from '@/types/auth';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type {
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthUser } from '../types/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://dummyjson.com',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Enhanced baseQuery with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired — attempt refresh
    const refreshToken = (api.getState() as RootState).auth.tokens
      ?.refreshToken;
    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken, expiresInMins: 60 },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const user = (api.getState() as RootState).auth.user;
      api.dispatch(
        setCredentials({ user, tokens: refreshResult.data as AuthTokens })
      );
      // Retry original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginFormData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => '/auth/me',
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      },
    }),
    // ...other endpoints
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery } = apiSlice;
