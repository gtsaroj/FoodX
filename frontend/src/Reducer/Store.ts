import { configureStore } from "@reduxjs/toolkit";
import CardReducer from "./CardReducer";

export const Store = configureStore({
    reducer: {
        cart : CardReducer
    }
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch