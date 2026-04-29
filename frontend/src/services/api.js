import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});

// Popular
export const getPopularMovies = () => API.get("/popular");

// Trailer
export const getTrailer = (id) => API.get(`/${id}/trailer`);

// Search
export const searchMovies = (query) => API.get(`/search?query=${query}`);

// Language filter
export const getMoviesByLanguage = (lang) => API.get(`/language?lang=${lang}`);

// Genre filter
export const getMoviesByGenre = (genre) => API.get(`/genre?genre=${genre}`);

// Web series
export const getWebSeries = () => API.get("/webseries");
