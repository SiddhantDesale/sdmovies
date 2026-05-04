import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import logo from "../assests/logo.png";

import {
  getPopularMovies,
  getTrailer,
  searchMovies,
  getMoviesByLanguage,
  getMoviesByGenre,
  getWebSeries,
} from "../services/api";

import { GENRES, LANGUAGES } from "../constants/filterData";

import MovieCard from "./MovieCard";
import TrailerModal from "./TrailerModal";
import MovieSlider from "./MovieSlider";
import Navbar from "./Navbar";

export default function MovieList() {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Latest Releases");
  const [trailerKey, setTrailerKey] = useState(null);

  const [error, setError] = useState(null);
  const [slowLoading, setSlowLoading] = useState(false);

  const requestIdRef = useRef(0);

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const trailerId = queryParams.get("trailer");

  // INDUSTRY (buttons)
  const industryMap = {
    bollywood: { code: "hi", name: "Bollywood" },
    hollywood: { code: "en", name: "Hollywood" },
    tollywood: { code: "te", name: "Tollywood" },
  };

  // LANGUAGE (dropdown)
  const languageMap = Object.fromEntries(
    LANGUAGES.map((l) => [l.key, { code: l.code, name: l.name }]),
  );

  // GENRE
  const genreMap = Object.fromEntries(
    GENRES.map((g) => [g.key, { id: g.id, name: g.name }]),
  );

  // COMMON FETCH
  const fetchMovies = async (apiCall, newTitle) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setMovies(null);
    setTitle(newTitle);
    setError(null);
    setSlowLoading(false);

    // Start slow timer
    const timer = setTimeout(() => {
      if (requestId === requestIdRef.current) {
        setSlowLoading(true);
      }
    }, 10000);

    try {
      const res = await apiCall();

      if (requestId !== requestIdRef.current) return;

      setMovies(res.data?.results || []);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setError("Failed to load movies. Please try again.");
      setMovies([]);
    } finally {
      clearTimeout(timer);
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  // ROUTE HANDLER
  useEffect(() => {
    setError(null);

    const path = location.pathname;

    // SEARCH ROUTE
    if (path.startsWith("/search/")) {
      const query = decodeURIComponent(params.query || "");
      fetchMovies(() => searchMovies(query), `Search: ${query}`);
      return;
    }

    // WEB SERIES
    if (path === "/webseries") {
      fetchMovies(getWebSeries, "Web Series");
      return;
    }

    // Language
    if (path.startsWith("/language/")) {
      const key = params.lang?.toLowerCase();

      // FIRST: industry buttons
      if (industryMap[key]) {
        const obj = industryMap[key];
        fetchMovies(() => getMoviesByLanguage(obj.code), obj.name);
      }

      // SECOND: dropdown languages
      else if (languageMap[key]) {
        const obj = languageMap[key];
        fetchMovies(() => getMoviesByLanguage(obj.code), obj.name);
      }

      // Genre
    } else if (path.startsWith("/genre/")) {
      const key = params.genre?.toLowerCase();
      const genreObj = genreMap[key];

      if (genreObj) {
        fetchMovies(() => getMoviesByGenre(genreObj.id), genreObj.name);
      }

      // Default
    } else {
      fetchMovies(getPopularMovies, "Latest Releases");
    }

    return () => {
      requestIdRef.current++;
    };
  }, [location.pathname]);

  // SEARCH
  const handleSearch = (query) => {
    if (!query.trim()) return;
    navigate(`/search/${encodeURIComponent(query)}`);
  };

  // HANDLED TRAILER FROM URL
  useEffect(() => {
    if (!trailerId) {
      setTrailerKey(null);
      setError(null);
      return;
    }

    getTrailer(trailerId)
      .then((res) => {
        if (res.data === "NOT_FOUND") {
          setError("Trailer not available 😢");
          setTrailerKey(null);
          return;
        }
        setError(null);
        setTrailerKey(res.data);
      })
      .catch(() => {
        setError("Error loading trailer");
        setTrailerKey(null);
      });
  }, [trailerId]);

  // CLICK MOVIE (Trailer)
  const handleMovieClick = (id) => {
    navigate(`${location.pathname}?trailer=${id}`);
  };

  // CLOSE TRAILER
  const closeTrailer = () => {
    setError(null);
    navigate(location.pathname);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (trailerId) {
        setTrailerKey(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [trailerId]);

  // LOADING
  if (loading || movies === null) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <div className="loader"></div>
        <h3 style={{ marginTop: "20px", color: "#aaa" }}>
          {slowLoading ? "Server is starting... please wait ⏳" : "Loading..."}
        </h3>
      </div>
    );
  }

  return (
    <div>
      {/* LOGO */}
      <button className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="SDMovies" className="logo-img" />{" "}
      </button>

      {/* Slider */}
      <MovieSlider />

      {/* Navbar */}
      <Navbar navigate={navigate} handleSearch={handleSearch} />

      {/* TITLE */}
      <h2 className="section-title">
        <FaFolder color="white" /> {title}
      </h2>

      {/* MOVIES */}
      {error ? (
        <h2 style={{ textAlign: "center" }}>{error}</h2>
      ) : movies.length === 0 ? (
        <h2 style={{ textAlign: "center" }}>No movies found 😢</h2>
      ) : (
        <div className="grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-click"
              role="button"
              tabIndex={0}
              onClick={() => handleMovieClick(movie.id)}
              onKeyDown={(e) => e.key === "Enter" && handleMovieClick(movie.id)}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {/* Trailer */}
      <TrailerModal trailerKey={trailerKey} onClose={closeTrailer} />
    </div>
  );
}
