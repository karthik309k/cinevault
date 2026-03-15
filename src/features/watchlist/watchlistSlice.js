import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = () => {
    try {
        return JSON.parse(localStorage.getItem("cinevault_watchlist")) || [];
    } catch { return []; }
};

const watchlistSlice = createSlice({
    name: "watchlist",
    initialState: loadFromStorage(),
    reducers: {
        addToWatchlist: (state, action) => {
            const exists = state.find((item) => item.id === action.payload.id);
            if (!exists) state.push(action.payload);
            localStorage.setItem("cinevault_watchlist", JSON.stringify(state));
        },
        removeFromWatchlist: (state, action) => {
            const newState = state.filter((item) => item.id !== action.payload);
            localStorage.setItem("cinevault_watchlist", JSON.stringify(newState));
            return newState;
        },
    },
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;