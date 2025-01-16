CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(100) NOT NULL,
                       role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(100) NOT NULL,
                        genre VARCHAR(50),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorite_movies (
                                 id SERIAL PRIMARY KEY,
                                 user_id INT NOT NULL,
                                 movie_id INT NOT NULL,
                                 FOREIGN KEY (user_id) REFERENCES users(id),
                                 FOREIGN KEY (movie_id) REFERENCES movies(id),
                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
