import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getTrending, getTopRated } from "../api/tmdb";
import { MovieCard } from "../components/ui/MovieCard";
import { MovieCardSkeleton } from "../components/ui/Skeleton";
import { getBackdropUrl, getPosterUrl } from "../utils/imageHelpers";
import { WatchlistButton } from "../features/watchlist/WatchlistButton";
import { getYear } from "../utils/formatDate";

// ── Horizontal Scroll Row ──
function MovieRow({ title, items, loading, viewAllLink }) {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-4 px-4 md:px-8">
                <h2 className="font-syne font-bold text-xl text-[var(--text)]">
                    {title}
                </h2>
                {viewAllLink && (
                    <Link
                        to={viewAllLink}
                        className="text-sm text-[var(--accent)] hover:underline font-mono"
                    >
                        View All →
                    </Link>
                )}
            </div>

            <div className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none" }}>
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-36 shrink-0">
                            <MovieCardSkeleton />
                        </div>
                    ))
                    : items?.map((item) => (
                        <div key={item.id} className="w-36 shrink-0">
                            <MovieCard item={item} />
                        </div>
                    ))}
            </div>
        </div>
    );
}

// ── Hero Banner ──
function HeroBanner({ movies }) {
    const [current, setCurrent] = useState(0);

    if (!movies?.length) return null;

    const movie = movies[current];
    const title = movie.title || movie.name;
    const date = movie.release_date || movie.first_air_date;
    const isTV = !movie.title;
    const linkTo = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;

    return (
        <div className="relative w-full h-[70vh] overflow-hidden mb-10">
            {/* Backdrop */}
            <motion.img
                key={movie.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                src={getBackdropUrl(movie.backdrop_path)}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center px-8 md:px-16">
                <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-xl"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 text-xs font-mono bg-[var(--accent)]/20 border border-[var(--accent)]/30 text-[var(--accent)] px-3 py-1.5 rounded-full mb-4">
                        🔥 Trending Now
                    </div>

                    <h1 className="font-syne font-black text-4xl md:text-5xl leading-tight mb-3">
                        {title}
                    </h1>

                    <div className="flex items-center gap-3 text-sm text-[var(--muted)] mb-4">
                        <span className="text-yellow-400 font-bold">
                            ⭐ {movie.vote_average?.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{getYear(date)}</span>
                        <span>•</span>
                        <span className={isTV ? "text-blue-400" : "text-red-400"}>
                            {isTV ? "TV Show" : "Movie"}
                        </span>
                    </div>

                    <p className="text-sm text-[var(--label)] line-clamp-2 mb-6 leading-relaxed">
                        {movie.overview}
                    </p>

                    <div className="flex items-center gap-3">
                        <Link
                            to={linkTo}
                            className="px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all"
                        >
                            ▶ View Details
                        </Link>
                        <WatchlistButton item={movie} size="md" />
                    </div>
                </motion.div>
            </div>

            {/* Thumbnail selectors */}
            <div className="absolute bottom-8 right-8 hidden md:flex gap-3">
                {movies.slice(0, 5).map((m, i) => (
                    <button
                        key={m.id}
                        onClick={() => setCurrent(i)}
                        className={`w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === current
                                ? "border-[var(--accent)] scale-110"
                                : "border-transparent opacity-50 hover:opacity-80"
                            }`}
                    >
                        <img
                            src={getBackdropUrl(m.backdrop_path, "w300")}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── Main HomePage ──
export default function HomePage() {
    const [activeTab, setActiveTab] = useState("movie");

    const { data: trendingMovies, isLoading: loadingMovies } = useQuery({
        queryKey: ["trending", "movie"],
        queryFn: () => getTrending("movie", "week").then((d) => d.results),
    });

    const { data: trendingTV, isLoading: loadingTV } = useQuery({
        queryKey: ["trending", "tv"],
        queryFn: () => getTrending("tv", "week").then((d) => d.results),
    });

    const { data: topRatedMovies, isLoading: loadingTopRated } = useQuery({
        queryKey: ["toprated", "movie"],
        queryFn: () => getTopRated("movie").then((d) => d.results),
    });

    const { data: popularTV, isLoading: loadingPopularTV } = useQuery({
        queryKey: ["popular", "tv"],
        queryFn: () => getTopRated("tv").then((d) => d.results),
    });

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <HeroBanner movies={trendingMovies} />

            {/* Movie / TV Tab Switcher */}
            <div className="flex items-center gap-2 px-4 md:px-8 mb-8">
                <div className="flex bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 gap-1">
                    {["movie", "tv"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab
                                    ? "bg-[var(--accent)] text-white"
                                    : "text-[var(--muted)] hover:text-[var(--text)]"
                                }`}
                        >
                            {tab === "movie" ? "🎬 Movies" : "📺 TV Shows"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rows */}
            {activeTab === "movie" ? (
                <>
                    <MovieRow
                        title="🔥 Trending Movies"
                        items={trendingMovies}
                        loading={loadingMovies}
                    />
                    <MovieRow
                        title="⭐ Top Rated Movies"
                        items={topRatedMovies}
                        loading={loadingTopRated}
                    />
                </>
            ) : (
                <>
                    <MovieRow
                        title="🔥 Trending TV Shows"
                        items={trendingTV}
                        loading={loadingTV}
                    />
                    <MovieRow
                        title="⭐ Top Rated TV Shows"
                        items={popularTV}
                        loading={loadingPopularTV}
                    />
                </>
            )}

            {/* Genre Quick Links */}
            <div className="px-4 md:px-8 pb-16 mt-4">
                <h2 className="font-syne font-bold text-xl mb-4">🏷️ Browse by Genre</h2>
                <div className="flex flex-wrap gap-3">
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
                    ].map((genre) => (
                        <Link
                            key={genre.id}
                            to={`/genre/${genre.id}/${genre.name}`}
                            className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--label)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-semibold"
                        >
                            {genre.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}