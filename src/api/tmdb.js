import tmdbApi from "./axiosConfig";

// ── Trending ──
export const getTrending = (type = "movie", time = "week") =>
    tmdbApi.get(`/trending/${type}/${time}`).then((r) => r.data);

// ── Movie Details ──
export const getMovieDetail = (id) =>
    tmdbApi.get(`/movie/${id}?append_to_response=credits,videos,similar`).then((r) => r.data);

// ── TV Details ──
export const getTVDetail = (id) =>
    tmdbApi.get(`/tv/${id}?append_to_response=credits,videos,similar`).then((r) => r.data);

// ── Search ──
export const searchMulti = (query, page = 1) =>
    tmdbApi.get(`/search/multi?query=${query}&page=${page}`).then((r) => r.data);

// ── Genre List ──
export const getGenres = (type = "movie") =>
    tmdbApi.get(`/genre/${type}/list`).then((r) => r.data);

// ── Movies by Genre ──
export const getByGenre = (genreId, page = 1, sort = "popularity.desc") =>
    tmdbApi
        .get(`/discover/movie?with_genres=${genreId}&sort_by=${sort}&page=${page}&vote_count.gte=100`)
        .then((r) => r.data);

// ── Person Detail ──
export const getPersonDetail = (id) =>
    tmdbApi.get(`/person/${id}?append_to_response=movie_credits`).then((r) => r.data);

// ── Top Rated ──
export const getTopRated = (type = "movie", page = 1) =>
    tmdbApi.get(`/${type}/top_rated?page=${page}`).then((r) => r.data);

// ── Popular ──
export const getPopular = (type = "movie", page = 1) =>
    tmdbApi.get(`/${type}/popular?page=${page}`).then((r) => r.data);