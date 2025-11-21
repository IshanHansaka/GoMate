import { combineReducers, configureStore } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import { apiSlice } from '../api/apiSlice';
import { wmataApiSlice } from '../api/wmataApiSlice';
import authReducer from '../features/auth/authSlice';
import favouritesReducer from '../features/favourites/favouritesSlice';

interface SecureStorageInterface {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

const SecureStorage: SecureStorageInterface = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn('SecureStore getItem error:', e);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.warn('SecureStore setItem error:', e);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn('SecureStore removeItem error:', e);
    }
  },
};

// 1. Configuration for redux-persist
const persistConfig = {
  key: 'root_v1', // Changed key to reset persisted state and fix "Unexpected key" error
  storage: SecureStorage, // The storage engine
  whitelist: ['auth', 'favourites'], // ONLY persist the 'auth' and 'favourites' slices
  blacklist: [apiSlice.reducerPath, wmataApiSlice.reducerPath], // <-- 2. Add API to blacklist
  keyPrefix: 'secure_', // optional prefix to distinguish in SecureStore
};

// 2. Combine all our reducers
const rootReducer = combineReducers({
  auth: authReducer,
  favourites: favouritesReducer,
  [apiSlice.reducerPath]: apiSlice.reducer, // <-- 3. Add the api reducer
  [wmataApiSlice.reducerPath]: wmataApiSlice.reducer,
});

// 3. Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  // This middleware is required for redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware, wmataApiSlice.middleware), // <-- 4. Add the api middleware
});

// 5. Create the persistor
export const persistor = persistStore(store);

// 6. Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
