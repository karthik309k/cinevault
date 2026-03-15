import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getByGenre } from "../api/tmdb";
import { MovieCard } from "../components/ui/MovieCard";
import { MovieCardSkeleton } from "../components/ui/Skeleton";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const SORT_OPTIONS = [
    { label: "Popularity", value: "popularity.desc" },
    { label: "Rating", value: "vote_average.desc" },
    { label: "Newest", value: "release_date.desc" },
    { label: "Oldest", value: "release_date.asc" },
];

export default function GenrePage() {
    const { id, name } = useParams();
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("popularity.desc");
    const [allMovies, setAllMovies] = useState([]);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // First page query
    const { data, isLoading } = useQuery({
        queryKey: ["genre", id, sort],
        queryFn: async () => {
            setAllMovies([]);
            setPage(1);
            setHasMore(true);
            const res = await getByGenre(id, 1, sort);
            setAllMovies(res.results);
            return res;
        },
    });

    // Load more function for infinite scroll
    const loadMore = useCallback(async () => {
        if (isFetchingMore || !hasMore) return;
        const nextPage = page + 1;
        if (data && nextPage > data.total_pages) {
            setHasMore(false);
            return;
        }
        setIsFetchingMore(true);
        try {
            const res = await getByGenre(id, nextPage, sort);
            setAllMovies((prev) => [...prev, ...res.results]);
            setPage(nextPage);
            if (nextPage >= res.total_pages) setHasMore(false);
        } finally {
            setIsFetchingMore(false);
        }
    }, [isFetchingMore, hasMore, page, id, sort, data]);

    // Intersection observer ref
    const loaderRef = useInfiniteScroll(loadMore);

    const GENRE_EMOJIS = {
        Action: "💥", Comedy: "😂", Horror: "👻",
        "Science Fiction": "🚀", Romance: "❤️", Thriller: "😱",
        Animation: "🎨", Drama: "🎭", Adventure: "🗺️", Mystery: "🔍",
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-2 font-mono">
                        <Link to="/" className="hover:text-[var(--accent)] transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-[var(--text)]">Genre</span>
                        <span>/</span>
                        <span className="text-[var(--accent)]">{name}</span>
                    </div>
                    <h1 className="font-syne font-black text-3xl">
                        {GENRE_EMOJIS[name] || "🎬"} {name}
                    </h1>
                    {data && (
                        <p className="text-sm text-[var(--muted)] mt-1">
                            {data.total_results?.toLocaleString()} titles found
                        </p>
                    )}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--muted)]">Sort by:</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Genre Pills — Quick Switch */}
            <div className="flex flex-wrap gap-2 mb-8">
                {[
                    { id: 28, name: "Action" },
                    { id: 35, name: "Comedy" },
                    { id: 27, name: "Horror" },
                    { id: 878, name: "Sci-Fi" },
                    { id: 10749, name: "Romance" },
                    { id: 53, name: "Thriller" },
                    { id: 16, name: "Animation" },
                    { id: 18, name: "Drama" },
                    { id: 12, name: "Adventure" },
                    { id: 9648, name: "Mystery" },
                ].map((g) => (
                    <Link
                        key={g.id}
                        to={`/genre/${g.id}/${g.name}`}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${g.id === Number(id)
                                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                                : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            }`}
                    >
                        {g.name}
                    </Link>
                ))}
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 18 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.03 } },
                    }}
                >
                    {allMovies.map((movie, i) => (
                        <motion.div
                            key={`${movie.id}-${i}`}
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <MovieCard item={{ ...movie, media_type: "movie" }} />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Infinite Scroll Loader */}
            {!isLoading && hasMore && (
                <div ref={loaderRef} className="flex justify-center py-12">
                    {isFetchingMore && (
                        <div className="flex items-center gap-3 text-[var(--muted)]">
                            <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Loading more...</span>
                        </div>
                    )}
                </div>
            )}

            {/* End of results */}
            {!hasMore && allMovies.length > 0 && (
                <div className="text-center py-12 text-[var(--muted)] text-sm">
                    You've seen all {allMovies.length} titles in {name} 🎬
                </div>
            )}
        </div>
    );
}