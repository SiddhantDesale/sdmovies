package com.sdmovies.backend.controller;

import com.sdmovies.backend.service.MovieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")

public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // Popular Movies
    @GetMapping("/popular")
    public Map<String, Object> getPopularMovies() {
        return safeResponse(movieService.getPopularMovies());

    }

    // Trailer
    @GetMapping("/{id}/trailer")
    public String getTrailer(@PathVariable Long id) {
        String key = movieService.getMovieTrailer(id);

        return (key == null) ? "NOT_FOUND" : key;
    }

    // Search
    @GetMapping("/search")
    public Map<String, Object> searchMovies(@RequestParam String query) {
        Map<String, Object> response = movieService.searchMovies(query);
        return safeResponse(response);
    }

    @GetMapping("/webseries")
    public Map<String, Object> getWebSeries() {
        Map<String, Object> response = movieService.getWebSeries();
        return safeResponse(response);
    }

    // Language Filter
    @GetMapping("/language")
    public Map<String, Object> getByLanguage(@RequestParam String lang) {
        Map<String, Object> response = movieService.getMoviesByLanguage(lang);
        return safeResponse(response);
    }

    // Genre Filter
    @GetMapping("/genre")
    public Map<String, Object> getByGenre(@RequestParam String genre) {
        Map<String, Object> response = movieService.getMoviesByGenre(genre);
        return safeResponse(response);
    }

    // SAFE RESPONSE
    private Map<String, Object> safeResponse(Map<String, Object> response) {
        if (response == null || !response.containsKey("results")) {
            return Map.of("results", List.of());
        }
        return response;
    }
}
