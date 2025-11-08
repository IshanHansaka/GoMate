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
import authReducer from '../features/auth/authSlice';

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
  key: 'root', // The key for the storage
  storage: SecureStorage, // The storage engine
  whitelist: ['auth'], // ONLY persist the 'auth' slice
  blacklist: [apiSlice.reducerPath], // <-- 2. Add API to blacklist
};

// 2. Combine all our reducers
const rootReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer, // <-- 3. Add the api reducer
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
    }).concat(apiSlice.middleware), // <-- 4. Add the api middleware
});

// 5. Create the persistor
export const persistor = persistStore(store);

// 6. Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
