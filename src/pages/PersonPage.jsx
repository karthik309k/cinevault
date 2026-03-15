import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getPersonDetail } from "../api/tmdb";
import { getAvatarUrl, getPosterUrl } from "../utils/imageHelpers";
import { formatDate } from "../utils/formatDate";
import { Skeleton } from "../components/ui/Skeleton";

export default function PersonPage() {
    const { id } = useParams();

    const { data: person, isLoading, error } = useQuery({
        queryKey: ["person", id],
        queryFn: () => getPersonDetail(id),
    });

    if (isLoading) return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <Skeleton className="w-48 h-72 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        </div>
    );

    if (error || !person) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <span className="text-5xl">⚠️</span>
            <p className="text-[var(--muted)]">Failed to load person details.</p>
            <Link to="/" className="text-[var(--accent)] hover:underline">← Go Home</Link>
        </div>
    );

    // Known for — top 8 movies
    const knownFor = person.movie_credits?.cast
        ?.sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8) || [];

    // Full filmography sorted by date
    const filmography = person.movie_credits?.cast
        ?.sort((a, b) => {
            const aYear = a.release_date ? new Date(a.release_date).getFullYear() : 0;
            const bYear = b.release_date ? new Date(b.release_date).getFullYear() : 0;
            return bYear - aYear;
        })
        .slice(0, 20) || [];

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-16">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6 font-mono">
                <Link to="/" className="hover:text-[var(--accent)] transition-colors">
                    Home
                </Link>
                <span>/</span>
                <span className="text-[var(--text)]">{person.name}</span>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">

                {/* Photo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="shrink-0"
                >
                    <img
                        src={
                            getAvatarUrl(person.profile_path, "w342") ||
                            "https://via.placeholder.com/200x300/18181b/71717a?text=?"
                        }
                        alt={person.name}
                        className="w-48 rounded-2xl border border-[var(--border)] shadow-2xl mx-auto md:mx-0"
                        onError={(e) => {
                            e.target.src =
                                "https://via.placeholder.com/200x300/18181b/71717a?text=?";
                        }}
                    />
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex-1"
                >
                    <h1 className="font-syne font-black text-3xl mb-2">
                        {person.name}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)] mb-5">
                        {person.known_for_department && (
                            <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-semibold text-xs">
                                {person.known_for_department}
                            </span>
                        )}
                        {person.birthday && (
                            <span>🎂 {formatDate(person.birthday)}</span>
                        )}
                        {person.place_of_birth && (
                            <span>📍 {person.place_of_birth}</span>
                        )}
                        {person.deathday && (
                            <span className="text-red-400">
                                † {formatDate(person.deathday)}
                            </span>
                        )}
                    </div>

                    {/* Biography */}
                    {person.biography ? (
                        <div>
                            <h3 className="font-syne font-bold text-sm text-[var(--label)] mb-2 uppercase tracking-wider">
                                Biography
                            </h3>
                            <p className="text-sm text-[var(--label)] leading-relaxed line-clamp-6">
                                {person.biography}
                            </p>
                        </div>
                    ) : (
                        <p className="text-[var(--muted)] text-sm">
                            No biography available.
                        </p>
                    )}
                </motion.div>
            </div>

            {/* Known For */}
            {knownFor.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-12"
                >
                    <h2 className="font-syne font-bold text-xl mb-5">
                        ⭐ Known For
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                        {knownFor.map((movie) => (
                            <Link
                                key={movie.id}
                                to={`/movie/${movie.id}`}
                                className="group block"
                            >
                                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all mb-2">
                                    <img
                                        src={getPosterUrl(movie.poster_path)}
                                        alt={movie.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://via.placeholder.com/200x300/18181b/71717a?text=No+Image";
                                        }}
                                    />
                                </div>
                                <p className="text-xs font-semibold line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                                    {movie.title}
                                </p>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Filmography */}
            {filmography.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <h2 className="font-syne font-bold text-xl mb-5">
                        🎬 Filmography
                    </h2>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
                        {filmography.map((movie, i) => (
                            <Link
                                key={`${movie.id}-${i}`}
                                to={`/movie/${movie.id}`}
                                className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--surface2)] transition-colors border-b border-[var(--border)] last:border-0 group"
                            >
                                {/* Poster thumb */}
                                <img
                                    src={getPosterUrl(movie.poster_path, "w92")}
                                    alt={movie.title}
                                    className="w-10 h-14 rounded-lg object-cover border border-[var(--border)] shrink-0"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://via.placeholder.com/40x56/18181b/71717a?text=?";
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                                        {movie.title}
                                    </p>
                                    {movie.character && (
                                        <p className="text-xs text-[var(--muted)] line-clamp-1">
                                            as {movie.character}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    {movie.vote_average > 0 && (
                                        <span className="text-xs text-yellow-400 font-mono">
                                            ⭐ {movie.vote_average.toFixed(1)}
                                        </span>
                                    )}
                                    <span className="text-xs text-[var(--muted)] font-mono w-10 text-right">
                                        {movie.release_date
                                            ? new Date(movie.release_date).getFullYear()
                                            : "TBA"}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}