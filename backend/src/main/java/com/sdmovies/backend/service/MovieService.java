package com.sdmovies.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class MovieService {

    @Value("${tmdb.api.key}")
    private String apiKey;
    private static final String BASE_URL = "https://api.themoviedb.org/3";


    private final RestTemplate restTemplate = new RestTemplate();


    @PostConstruct
public void check() {
    System.out.println("API KEY = " + apiKey);
}

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchWithRetry( String url) {

        for (int i = 0; i < 3; i++) {
            try {
                Map<String, Object> response =
                        restTemplate.getForObject(url, Map.class);

                if (response != null && response.get("results") != null) {
                    return response;
                }

                try {
                    Thread.sleep(300);
                } catch (InterruptedException ignored) {}


            } catch (Exception e) {
                System.err.println("API error: " + e.getMessage());

            }
        }

        return Map.of("results", List.of());
    }

    // POPULAR MOVIES
    public Map<String, Object> getPopularMovies() {
        String url = BASE_URL + "/movie/popular?api_key=" + apiKey;
        return fetchWithRetry(url);
    }

    // WEB SERIES
    public Map<String, Object> getWebSeries() {
        String url = BASE_URL +"/discover/tv?api_key=" + apiKey;
        return fetchWithRetry(url);
    }

    // SEARCH
    public Map<String, Object> searchMovies(String query) {

        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);

            String url = BASE_URL + "/search/movie?api_key="
                    + apiKey + "&query=" + encodedQuery;

            return fetchWithRetry(url);

        } catch (Exception e) {
            System.err.println("API error: " + e.getMessage());

            return Map.of("results", List.of());
        }
    }

    // LANGUAGE FILTER
    public Map<String, Object> getMoviesByLanguage(String language) {

        String url = BASE_URL + "/discover/movie?api_key="
                + apiKey + "&with_original_language=" + language;

        return fetchWithRetry(url);
    }

    // GENRE FILTER
    public Map<String, Object> getMoviesByGenre(String genreId) {

        String url = BASE_URL + "/discover/movie?api_key="
                + apiKey + "&with_genres=" + genreId;

        return fetchWithRetry(url);
    }

    // TRAILER
    @SuppressWarnings("unchecked")
    public String getMovieTrailer(Long movieId) {

        String url = BASE_URL + "/movie/" + movieId + "/videos?api_key=" + apiKey;

        try {
            Map<String, Object> response =
                    restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("results")) {

                List<Map<String, Object>> results =
                        (List<Map<String, Object>>) response.get("results");

                // 1️⃣ Trailer
                for (Map<String, Object> video : results) {
                    if ("Trailer".equals(video.get("type")) &&
                        "YouTube".equals(video.get("site"))) {
                        return (String) video.get("key");
                    }
                }

                // 2️⃣ Teaser
                for (Map<String, Object> video : results) {
                    if ("Teaser".equals(video.get("type")) &&
                        "YouTube".equals(video.get("site"))) {
                        return (String) video.get("key");
                    }
                }

                // 3️⃣ Fallback
                for (Map<String, Object> video : results) {
                    if ("YouTube".equals(video.get("site"))) {
                        return (String) video.get("key");
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("API error: " + e.getMessage());

        }

        return "NOT_FOUND";
    }
}
