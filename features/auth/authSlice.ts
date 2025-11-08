import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define what our auth state looks like
interface AuthState {
  user: { name: string; email: string } | null;
  token: string | null;
}

// Define the initial (logged out) state
const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  // "Reducers" are functions that update the state
  reducers: {
    // This action will be "dispatched" when the user logs in
    setCredentials: (
      state,
      action: PayloadAction<{
        user: { name: string; email: string };
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // This action will be "dispatched" when the user logs out
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

// Export the actions so we can use them in our components
export const { setCredentials, logout } = authSlice.actions;

// Export the reducer to add to our store
export default authSlice.reducer;

// (Optional but helpful) "Selectors" to easily get data from the store
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  !!state.auth.token;
