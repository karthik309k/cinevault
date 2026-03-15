import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store/store";
import { Navbar } from "./components/layout/Navbar";

import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import TVDetailPage from "./pages/TVDetailPage";
import SearchPage from "./pages/SearchPage";
import GenrePage from "./pages/GenrePage";
import WatchlistPage from "./pages/WatchlistPage";
import PersonPage from "./pages/PersonPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/tv/:id" element={<TVDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/genre/:id/:name" element={<GenrePage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/person/:id" element={<PersonPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--surface2)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                fontFamily: "'DM Sans', sans-serif",
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}