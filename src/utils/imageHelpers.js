const BASE = "https://image.tmdb.org/t/p";

export const getPosterUrl = (path, size = "w500") =>
    path ? `${BASE}/${size}${path}` : "/no-poster.png";

export const getBackdropUrl = (path, size = "w1280") =>
    path ? `${BASE}/${size}${path}` : null;

export const getAvatarUrl = (path, size = "w185") =>
    path ? `${BASE}/${size}${path}` : null;