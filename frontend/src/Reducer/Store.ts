import { combineReducers, configureStore } from "@reduxjs/toolkit";
import CardReducer, { favouriteReducer } from "./Reducer";
import OrderReducer from "./OrderReducer";
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
import authReducer from "./authReducer";

// const loginRoot = combineReducers({
//   authRegister: registerSlice,
//   authLogin: loginSlice,
// });
// const Product = combineReducers({
//   cart: CardReducer,
//   order: OrderReducer,
//   favourite: favouriteReducer,
// });

const rootReducer = combineReducers({
  auth: authReducer,
  cart: CardReducer,
  order: OrderReducer,
  favourite: favouriteReducer,
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

export let persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
