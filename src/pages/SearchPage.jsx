import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { searchMulti } from "../api/tmdb";
import { useDebounce } from "../hooks/useDebounce";
import { getPosterUrl, getAvatarUrl } from "../utils/imageHelpers";
import { getYear } from "../utils/formatDate";
import { MovieCardSkeleton } from "../components/ui/Skeleton";
import { WatchlistButton } from "../features/watchlist/WatchlistButton";

const TABS = ["All", "Movies", "TV Shows", "People"];

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [activeTab, setActiveTab] = useState("All");
    const debouncedQuery = useDebounce(query, 400);

    // ── KEY FIX: sync input when URL changes (e.g. from navbar) ──
    useEffect(() => {
        const urlQuery = searchParams.get("q") || "";
        setQuery(urlQuery);
    }, [searchParams]);

    // ── Update URL when debounced query changes ──
    useEffect(() => {
        if (debouncedQuery.trim()) {
            setSearchParams({ q: debouncedQuery });
        } else {
            setSearchParams({});
        }
    }, [debouncedQuery]);

    const { data, isLoading } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: () =>
            searchMulti(debouncedQuery).then((d) => d.results),
        enabled: debouncedQuery.trim().length > 0,
    });

    // Filter results by tab
    const filtered = data?.filter((item) => {
        if (activeTab === "All") return true;
        if (activeTab === "Movies") return item.media_type === "movie";
        if (activeTab === "TV Shows") return item.media_type === "tv";
        if (activeTab === "People") return item.media_type === "person";
        return true;
    }) || [];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Search Bar */}
            <div className="mb-8">
                <h1 className="font-syne font-black text-3xl mb-6">🔍 Search</h1>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies, TV shows, people..."
                    autoFocus
                    className="w-full px-5 py-4 text-lg rounded-2xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none text-[var(--text)] placeholder:text-[var(--muted)] transition-colors"
                />
            </div>

            {/* Filter Tabs — only show when there's a query */}
            {debouncedQuery.trim() && (
                <div className="flex gap-2 mb-6 flex-wrap">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${activeTab === tab
                                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                                    : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)]"
                                }`}
                        >
                            {tab}
                            {tab === "All" && data && (
                                <span className="ml-1.5 text-xs opacity-70">
                                    ({data.length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Results */}
            {!isLoading && debouncedQuery.trim() && (
                <>
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-24 text-center">
                            <span className="text-6xl">😔</span>
                            <h2 className="font-syne font-bold text-xl">
                                No results for "{debouncedQuery}"
                            </h2>
                            <p className="text-[var(--muted)]">
                                Try a different search term
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.04 } },
                            }}
                        >
                            {filtered.map((item) => (
                                <motion.div
                                    key={`${item.media_type}-${item.id}`}
                                    variants={{
                                        hidden: { opacity: 0, y: 15 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                >
                                    {item.media_type === "person" ? (
                                        // Person Card
                                        <Link
                                            to={`/person/${item.id}`}
                                            className="group block text-center"
                                        >
                                            <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all mb-2">
                                                <img
                                                    src={
                                                        getAvatarUrl(item.profile_path, "w342") ||
                                                        "https://via.placeholder.com/200x300/18181b/71717a?text=?"
                                                    }
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/200x300/18181b/71717a?text=?";
                                                    }}
                                                />
                                            </div>
                                            <p className="text-sm font-semibold line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-[var(--muted)] capitalize">
                                                {item.known_for_department}
                                            </p>
                                        </Link>
                                    ) : (
                                        // Movie / TV Card
                                        <Link
                                            to={
                                                item.media_type === "tv"
                                                    ? `/tv/${item.id}`
                                                    : `/movie/${item.id}`
                                            }
                                            className="group block"
                                        >
                                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all mb-2">
                                                <img
                                                    src={getPosterUrl(item.poster_path)}
                                                    alt={item.title || item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/200x300/18181b/71717a?text=No+Image";
                                                    }}
                                                />
                                                {/* Rating Badge */}
                                                {item.vote_average > 0 && (
                                                    <div className="absolute top-2 left-2 bg-black/80 text-xs font-mono font-bold px-2 py-1 rounded-lg text-yellow-400">
                                                        ⭐ {item.vote_average.toFixed(1)}
                                                    </div>
                                                )}
                                                {/* Type Badge */}
                                                <div className={`absolute top-2 right-2 text-xs font-mono font-bold px-2 py-1 rounded-lg ${item.media_type === "tv"
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : "bg-red-500/20 text-red-400"
                                                    }`}>
                                                    {item.media_type === "tv" ? "TV" : "Movie"}
                                                </div>
                                                {/* Watchlist on hover */}
                                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <WatchlistButton item={item} size="sm" />
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                                                {item.title || item.name}
                                            </p>
                                            <p className="text-xs text-[var(--muted)]">
                                                {getYear(item.release_date || item.first_air_date)}
                                            </p>
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </>
            )}

            {/* Empty State — no query typed yet */}
            {!debouncedQuery.trim() && !isLoading && (
                <div className="flex flex-col items-center gap-4 py-24 text-center">
                    <span className="text-6xl">🎬</span>
                    <h2 className="font-syne font-bold text-xl">
                        Discover Movies & Shows
                    </h2>
                    <p className="text-[var(--muted)] max-w-sm">
                        Search for any movie, TV show, or actor above to get started.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {[
                            "Inception",
                            "Breaking Bad",
                            "The Dark Knight",
                            "Stranger Things",
                            "Interstellar",
                            "Game of Thrones",
                        ].map((s) => (
                            <button
                                key={s}
                                onClick={() => setQuery(s)}
                                className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--label)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}