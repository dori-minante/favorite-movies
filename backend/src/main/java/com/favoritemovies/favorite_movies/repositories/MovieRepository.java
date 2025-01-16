package com.favoritemovies.favorite_movies.repositories;

import com.favoritemovies.favorite_movies.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}
