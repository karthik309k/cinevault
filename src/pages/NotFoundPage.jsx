import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NotFoundPage() {
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center gap-6">
            <div className="text-9xl font-syne font-black text-[var(--border)]">
                404
            </div>
            <div>
                <h2 className="font-syne font-bold text-2xl mb-2">
                    Scene Not Found
                </h2>
                <p className="text-[var(--muted)]">
                    This page doesn't exist. Try searching for a movie instead.
                </p>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (q.trim()) navigate(`/search?q=${q.trim()}`);
                }}
                className="flex gap-2 w-full max-w-sm"
            >
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search a movie..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
                />
                <button
                    type="submit"
                    className="px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:opacity-90"
                >
                    Search
                </button>
            </form>
            <Link
                to="/"
                className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
                ← Back to Home
            </Link>
        </div>
    );
}