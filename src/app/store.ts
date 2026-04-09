import { configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'

import migraineReducer from '@/features/migraine/migraineSlice'

// ─── Storage adapter ──────────────────────────────────────────────────────────
// Defined inline to avoid Vite CJS→ESM interop issues with redux-persist/lib/storage

const storage = {
  getItem:    (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem:    (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
}

// Persist only the migraine slice — avoids double-serialization that happens
// when wrapping a combineReducers result with persistReducer.
const persistedMigraineReducer = persistReducer(
  { key: 'neura-migraine', storage, version: 1 },
  migraineReducer,
)

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    migraine: persistedMigraineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of the entire Redux state tree */
export type RootState   = ReturnType<typeof store.getState>
/** Type of the store's `dispatch` function */
export type AppDispatch = typeof store.dispatch
