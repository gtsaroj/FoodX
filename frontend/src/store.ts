import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { favouriteReducer } from "./reducer/favourite.reducer";

import OrderReducer from "./reducer/order.reducer";
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
import { authReducer } from "./reducer/user.reducer";
import { cartReducer } from "./reducer/product.reducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  order: OrderReducer,
  favourite: favouriteReducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducerPersist = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
  reducer: {
    root: reducerPersist,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
