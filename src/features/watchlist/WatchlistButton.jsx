import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist, removeFromWatchlist } from "./watchlistSlice";
import toast from "react-hot-toast";

export function WatchlistButton({ item, size = "md" }) {
    const dispatch = useDispatch();
    const watchlist = useSelector((state) => state.watchlist);
    const isInWatchlist = watchlist.some((w) => w.id === item.id);

    const toggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWatchlist) {
            dispatch(removeFromWatchlist(item.id));
            toast("Removed from watchlist");
        } else {
            dispatch(addToWatchlist(item));
            toast.success("Added to watchlist! ❤️");
        }
    };

    const sizeClass = size === "sm"
        ? "w-8 h-8 text-sm"
        : "w-10 h-10 text-base";

    return (
        <button
            onClick={toggle}
            className={`${sizeClass} rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${isInWatchlist
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-red-500/30"
                    : "bg-black/60 backdrop-blur-sm text-white border border-white/20 hover:bg-[var(--accent)]/80"
                }`}
            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
            {isInWatchlist ? "❤️" : "🤍"}
        </button>
    );
}