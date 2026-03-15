import { Link } from "react-router-dom";
import { getPosterUrl } from "../../utils/imageHelpers";
import { getYear } from "../../utils/formatDate";
import { WatchlistButton } from "../../features/watchlist/WatchlistButton";

export function MovieCard({ item }) {
    const isTV = item.media_type === "tv" || item.first_air_date;
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const linkTo = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;

    return (
        <Link to={linkTo} className="group relative block">
            <div className="relative overflow-hidden rounded-xl bg-[var(--surface)] border border-[var(--border)] transition-all duration-300 group-hover:border-[var(--accent)]/50 group-hover:scale-[1.03] group-hover:shadow-2xl">
                {/* Poster */}
                <div className="aspect-[2/3] overflow-hidden">
                    <img
                        src={getPosterUrl(item.poster_path)}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x450/18181b/71717a?text=No+Image";
                        }}
                    />
                </div>

                {/* Rating Badge */}
                {item.vote_average > 0 && (
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-xs font-mono font-bold px-2 py-1 rounded-lg text-yellow-400 border border-yellow-400/20">
                        ⭐ {item.vote_average.toFixed(1)}
                    </div>
                )}

                {/* Type Badge */}
                <div className={`absolute top-2 right-2 text-xs font-mono font-bold px-2 py-1 rounded-lg ${isTV ? "bg-blue-500/20 text-blue-400 border border-blue-400/20" : "bg-red-500/20 text-red-400 border border-red-400/20"}`}>
                    {isTV ? "TV" : "Movie"}
                </div>

                {/* Watchlist Button */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <WatchlistButton item={item} size="sm" />
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Title below card */}
            <div className="mt-2 px-1">
                <h3 className="text-sm font-semibold text-[var(--text)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                    {title}
                </h3>
                <p className="text-xs text-[var(--muted)]">{getYear(date)}</p>
            </div>
        </Link>
    );
}