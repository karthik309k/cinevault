import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { removeFromWatchlist } from "../features/watchlist/watchlistSlice";
import { getPosterUrl } from "../utils/imageHelpers";
import { getYear } from "../utils/formatDate";
import toast from "react-hot-toast";

const FILTERS = ["All", "Movies", "TV Shows"];

export default function WatchlistPage() {
    const dispatch = useDispatch();
    const watchlist = useSelector((state) => state.watchlist);
    const [filter, setFilter] = useState("All");
    const [sort, setSort] = useState("newest");

    const filtered = watchlist
        .filter((item) => {
            if (filter === "All") return true;
            if (filter === "Movies") return item.media_type === "movie" || item.title;
            if (filter === "TV Shows") return item.media_type === "tv" || item.name;
            return true;
        })
        .sort((a, b) => {
            if (sort === "newest") return watchlist.indexOf(b) - watchlist.indexOf(a);
            if (sort === "oldest") return watchlist.indexOf(a) - watchlist.indexOf(b);
            if (sort === "rating") return (b.vote_average || 0) - (a.vote_average || 0);
            if (sort === "name") {
                const aName = a.title || a.name || "";
                const bName = b.title || b.name || "";
                return aName.localeCompare(bName);
            }
            return 0;
        });

    const handleRemove = (id, name) => {
        dispatch(removeFromWatchlist(id));
        toast(`Removed "${name}" from watchlist`);
    };

    // Empty state
    if (watchlist.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-4">
            <span className="text-8xl">🎬</span>
            <div>
                <h2 className="font-syne font-black text-3xl mb-3">
                    Your Watchlist is Empty
                </h2>
                <p className="text-[var(--muted)] max-w-sm">
                    Start adding movies and shows you want to watch by clicking the heart icon on any title.
                </p>
            </div>
            <Link
                to="/"
                className="px-8 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
                Start Exploring →
            </Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="font-syne font-black text-3xl mb-1">
                    ❤️ My Watchlist
                </h1>
                <p className="text-[var(--muted)]">
                    {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                {/* Filter Tabs */}
                <div className="flex bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 gap-1">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === f
                                    ? "bg-[var(--accent)] text-white"
                                    : "text-[var(--muted)] hover:text-[var(--text)]"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                >
                    <option value="newest">Recently Added</option>
                    <option value="oldest">Oldest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A–Z</option>
                </select>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 text-[var(--muted)]">
                    No {filter} in your watchlist yet.
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                    <AnimatePresence>
                        {filtered.map((item) => {
                            const isTV = item.media_type === "tv" || !!item.name && !item.title;
                            const title = item.title || item.name;
                            const date = item.release_date || item.first_air_date;
                            const linkTo = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="group relative"
                                >
                                    <Link to={linkTo} className="block">
                                        {/* Poster */}
                                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all mb-2">
                                            <img
                                                src={getPosterUrl(item.poster_path)}
                                                alt={title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/200x300/18181b/71717a?text=No+Image";
                                                }}
                                            />

                                            {/* Rating */}
                                            {item.vote_average > 0 && (
                                                <div className="absolute top-2 left-2 bg-black/80 text-xs font-mono font-bold px-2 py-1 rounded-lg text-yellow-400">
                                                    ⭐ {item.vote_average.toFixed(1)}
                                                </div>
                                            )}

                                            {/* Type Badge */}
                                            <div className={`absolute top-2 right-2 text-xs font-mono font-bold px-2 py-1 rounded-lg ${isTV
                                                    ? "bg-blue-500/20 text-blue-400"
                                                    : "bg-red-500/20 text-red-400"
                                                }`}>
                                                {isTV ? "TV" : "Movie"}
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleRemove(item.id, title);
                                                }}
                                                className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-red-500/90 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 active:scale-90"
                                                title="Remove from watchlist"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* Info */}
                                        <p className="text-sm font-semibold line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                                            {title}
                                        </p>
                                        <p className="text-xs text-[var(--muted)]">
                                            {getYear(date)}
                                        </p>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}