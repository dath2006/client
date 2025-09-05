import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
