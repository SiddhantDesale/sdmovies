import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/movies",
  timeout: 10000,
});

// ✅ Popular
export const getPopularMovies = () => API.get("/popular");

// ✅ Trailer
export const getTrailer = (id) => API.get(`/${id}/trailer`);

// ✅ Search
export const searchMovies = (query) => API.get(`/search?query=${query}`);

// ✅ Language filter (FIXED)
export const getMoviesByLanguage = (lang) => API.get(`/language?lang=${lang}`);

// ✅ Genre filter (FIXED)
export const getMoviesByGenre = (genre) => API.get(`/genre?genre=${genre}`);

export const getWebSeries = () => API.get("/webseries");
