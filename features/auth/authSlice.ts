import { AuthState, AuthTokens, AuthUser } from '@/types/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AuthState = {
  user: null,
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  expiresInMins: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser | null;
        tokens: AuthTokens;
        expiresInMins?: number;
      }>
    ) => {
      if (
        !action.payload.tokens.accessToken ||
        !action.payload.tokens.refreshToken
      ) {
        throw new Error('Missing tokens in setCredentials');
      }

      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.expiresInMins = action.payload.expiresInMins;
    },

    logout: (state) => {
      state.user = null;
      state.tokens = {
        accessToken: '',
        refreshToken: '',
      };
      state.expiresInMins = undefined;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  !!state.auth.tokens.accessToken;
