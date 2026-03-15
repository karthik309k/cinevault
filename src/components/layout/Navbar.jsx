import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

export function Navbar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const watchlist = useSelector((state) => state.watchlist);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            setSearch("");
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
                <Link
                    to="/"
                    className="font-syne font-black text-xl text-[var(--accent)] shrink-0"
                >
                    🎬 CineVault
                </Link>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search movies, shows..."
                        className="w-full px-4 py-2 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none text-[var(--text)] placeholder:text-[var(--muted)]"
                    />
                </form>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-2 ml-auto">
                    <Link to="/" className="text-sm text-[var(--label)] hover:text-[var(--text)] px-3 py-1.5 rounded-lg hover:bg-[var(--surface)] transition-all">
                        Home
                    </Link>
                    <Link to="/search" className="text-sm text-[var(--label)] hover:text-[var(--text)] px-3 py-1.5 rounded-lg hover:bg-[var(--surface)] transition-all">
                        Search
                    </Link>
                    <Link
                        to="/watchlist"
                        className="text-sm text-[var(--label)] hover:text-[var(--text)] px-3 py-1.5 rounded-lg hover:bg-[var(--surface)] transition-all flex items-center gap-1.5"
                    >
                        ❤️ Watchlist
                        {watchlist.length > 0 && (
                            <span className="text-xs bg-[var(--accent)] text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {watchlist.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}