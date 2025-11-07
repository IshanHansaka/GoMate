// In src/store/store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
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
import authReducer from '../features/auth/authSlice';

// 1. Configuration for redux-persist
const persistConfig = {
  key: 'root', // The key for the storage
  storage: AsyncStorage, // The storage engine
  whitelist: ['auth'], // ONLY persist the 'auth' slice
};

// 2. Combine all our reducers
const rootReducer = combineReducers({
  auth: authReducer,
  // We will add api slices here later
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
    }),
});

// 5. Create the persistor
export const persistor = persistStore(store);

// 6. Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
