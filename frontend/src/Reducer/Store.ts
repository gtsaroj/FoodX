import { configureStore } from "@reduxjs/toolkit";
import CardReducer from "./Reducer";
import authReducer from "./authReducer";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedCardReducer = persistReducer(persistConfig, CardReducer);
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const Store = configureStore({
  reducer: {
    cart: persistedCardReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
