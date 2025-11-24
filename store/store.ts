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

const persistConfig = {
  key: 'root_v1',
  storage: SecureStorage,
  whitelist: ['auth', 'favourites'],
  blacklist: [apiSlice.reducerPath, wmataApiSlice.reducerPath],
  keyPrefix: 'secure_',
};

const rootReducer = combineReducers({
  auth: authReducer,
  favourites: favouritesReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [wmataApiSlice.reducerPath]: wmataApiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware, wmataApiSlice.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
