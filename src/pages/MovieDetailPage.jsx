import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getMovieDetail } from "../api/tmdb";
import { getPosterUrl, getBackdropUrl, getAvatarUrl } from "../utils/imageHelpers";
import { formatDate, getYear } from "../utils/formatDate";
import { formatRuntime } from "../utils/formatRuntime";
import { RatingRing } from "../components/ui/RatingRing";
import { TrailerModal } from "../components/ui/TrailerModal";
import { WatchlistButton } from "../features/watchlist/WatchlistButton";
import { MovieCard } from "../components/ui/MovieCard";
import { DetailSkeleton, MovieCardSkeleton } from "../components/ui/Skeleton";

export default function MovieDetailPage() {
    const { id } = useParams();
    const [showTrailer, setShowTrailer] = useState(false);

    const { data: movie, isLoading, error } = useQuery({
        queryKey: ["movie", id],
        queryFn: () => getMovieDetail(id),
    });

    if (isLoading) return <DetailSkeleton />;

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <span className="text-5xl">⚠️</span>
            <p className="text-[var(--muted)]">Failed to load movie details.</p>
            <Link to="/" className="text-[var(--accent)] hover:underline">← Go Home</Link>
        </div>
    );

    if (!movie) return null;

    // Get trailer
    const trailer = movie.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    // Get cast
    const cast = movie.credits?.cast?.slice(0, 10) || [];

    // Get similar
    const similar = movie.similar?.results?.slice(0, 8) || [];

    // Get genres
    const genres = movie.genres || [];

    return (
        <div className="min-h-screen">

            {/* ── BACKDROP HERO ── */}
            <div className="relative w-full h-[55vh] overflow-hidden">
                <img
                    src={getBackdropUrl(movie.backdrop_path)}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-6xl mx-auto px-4 -mt-40 relative z-10 pb-16">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left — Poster */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="shrink-0"
                    >
                        <div className="w-48 md:w-56 mx-auto md:mx-0">
                            <img
                                src={getPosterUrl(movie.poster_path)}
                                alt={movie.title}
                                className="w-full rounded-2xl shadow-2xl border border-[var(--border)]"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/300x450/18181b/71717a?text=No+Image";
                                }}
                            />
                            {/* Watchlist Button */}
                            <div className="mt-3">
                                <WatchlistButton item={{ ...movie, media_type: "movie" }} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex-1 pt-2"
                    >
                        {/* Title */}
                        <h1 className="font-syne font-black text-3xl md:text-4xl leading-tight mb-2">
                            {movie.title}
                        </h1>

                        {/* Tagline */}
                        {movie.tagline && (
                            <p className="text-[var(--muted)] italic text-sm mb-4">
                                "{movie.tagline}"
                            </p>
                        )}

                        {/* Meta Row */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)] mb-5">
                            <span>{formatDate(movie.release_date)}</span>
                            <span>•</span>
                            <span>{formatRuntime(movie.runtime)}</span>
                            {movie.original_language && (
                                <>
                                    <span>•</span>
                                    <span className="uppercase font-mono text-xs">
                                        {movie.original_language}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Rating + Trailer */}
                        <div className="flex items-center gap-5 mb-5">
                            <div className="flex items-center gap-3">
                                <RatingRing rating={movie.vote_average} size={64} />
                                <div>
                                    <div className="text-xs text-[var(--muted)]">User Score</div>
                                    <div className="text-xs text-[var(--muted)]">
                                        {movie.vote_count?.toLocaleString()} votes
                                    </div>
                                </div>
                            </div>

                            {trailer && (
                                <button
                                    onClick={() => setShowTrailer(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white font-semibold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all"
                                >
                                    ▶ Watch Trailer
                                </button>
                            )}
                        </div>

                        {/* Genres */}
                        {genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {genres.map((g) => (
                                    <Link
                                        key={g.id}
                                        to={`/genre/${g.id}/${g.name}`}
                                        className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 transition-colors"
                                    >
                                        {g.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Overview */}
                        <div className="mb-6">
                            <h3 className="font-syne font-bold text-sm text-[var(--label)] mb-2 uppercase tracking-wider">
                                Overview
                            </h3>
                            <p className="text-[var(--label)] text-sm leading-relaxed">
                                {movie.overview || "No overview available."}
                            </p>
                        </div>

                        {/* Extra Info */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { label: "Status", value: movie.status },
                                { label: "Budget", value: movie.budget > 0 ? `$${(movie.budget / 1000000).toFixed(0)}M` : "Unknown" },
                                { label: "Revenue", value: movie.revenue > 0 ? `$${(movie.revenue / 1000000).toFixed(0)}M` : "Unknown" },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3">
                                    <div className="text-xs text-[var(--muted)] font-mono uppercase mb-1">{label}</div>
                                    <div className="text-sm font-semibold">{value}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── CAST ── */}
                {cast.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12"
                    >
                        <h2 className="font-syne font-bold text-xl mb-5">🎭 Top Cast</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
                            {cast.map((person) => (
                                <Link
                                    key={person.id}
                                    to={`/person/${person.id}`}
                                    className="shrink-0 w-24 group text-center"
                                >
                                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[var(--border)] group-hover:border-[var(--accent)] transition-colors mb-2">
                                        <img
                                            src={getAvatarUrl(person.profile_path) || "https://via.placeholder.com/80x80/18181b/71717a?text=?"}
                                            alt={person.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/80x80/18181b/71717a?text=?";
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                                        {person.name}
                                    </p>
                                    <p className="text-xs text-[var(--muted)] line-clamp-1">
                                        {person.character}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── SIMILAR MOVIES ── */}
                {similar.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12"
                    >
                        <h2 className="font-syne font-bold text-xl mb-5">🎬 Similar Movies</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                            {similar.map((item) => (
                                <MovieCard key={item.id} item={{ ...item, media_type: "movie" }} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ── TRAILER MODAL ── */}
            {showTrailer && trailer && (
                <TrailerModal
                    videoKey={trailer.key}
                    onClose={() => setShowTrailer(false)}
                />
            )}
        </div>
    );
}