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

  const [openDropdown, setOpenDropdown] = useState(null);

  const requestIdRef = useRef(0);

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

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

    try {
      const res = await apiCall();

      if (requestId !== requestIdRef.current) return;

      setMovies(res.data?.results || []);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setMovies([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  // ROUTE HANDLER
  useEffect(() => {
    const path = location.pathname;

    // WEB SERIES
    if (path === "/webseries") {
      fetchMovies(getWebSeries, "Web Series");
      return;
    }

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
    } else if (path.startsWith("/genre/")) {
      const key = params.genre?.toLowerCase();
      const genreObj = genreMap[key];

      if (genreObj) {
        fetchMovies(() => getMoviesByGenre(genreObj.id), genreObj.name);
      }
    } else {
      fetchMovies(getPopularMovies, "Latest Releases");
    }
  }, [location.pathname]);

  // SEARCH
  const handleSearch = (query) => {
    if (!query.trim()) return;
    fetchMovies(() => searchMovies(query), `Search: ${query}`);
  };

  // TRAILER
  const handleMovieClick = (id) => {
    setError(null);

    getTrailer(id)
      .then((res) => {
        if (res.data === "NOT_FOUND") {
          setError("Trailer not available 😢");
          return;
        }
        setTrailerKey(res.data);
      })
      .catch(() => setError("Error loading trailer"));
  };

  // LOADING
  if (loading || movies === null) {
    return <div className="loader"></div>;
  }

  return (
    <div>
      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="SDMovies" className="logo-img" />{" "}
      </div>

      {/* Slider */}
      <MovieSlider />

      {/* Navbar */}
      <Navbar
        navigate={navigate}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        handleSearch={handleSearch}
      />

      {/* TITLE */}
      <h2 className="section-title">
        <FaFolder color="white" /> {title}
      </h2>

      {/* ERROR MESSAGE */}
      {error && <div className="error-message">{error}</div>}

      {/* MOVIES */}
      {movies.length === 0 ? (
        <h2 style={{ textAlign: "center" }}>No movies found 😢</h2>
      ) : (
        <div className="grid">
          {movies.map((movie) => (
            <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {/* Trailer */}
      <TrailerModal
        trailerKey={trailerKey}
        onClose={() => setTrailerKey(null)}
      />
    </div>
  );
}
