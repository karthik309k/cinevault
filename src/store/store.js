import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "../features/watchlist/watchlistSlice";

export const store = configureStore({
    reducer: {
        watchlist: watchlistReducer,
    },
});