import { useEffect, useState } from "react";
import { getPopularMovies } from "../services/api";

export default function MovieSlider() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getPopularMovies()
      .then((res) => {
        setMovies(res.data?.results || []);
      })
      .catch(() => setMovies([]));
  }, []);

  // ❌ Don't render if no movies yet
  if (!movies || movies.length === 0) return null;

  // ✅ Duplicate movies for smooth loop
  const loopMovies = [...movies, ...movies];

  return (
    <div className="slider">
      <div className="slider-track">
        {loopMovies.map((movie, index) => (
          <img
            key={index}
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}
