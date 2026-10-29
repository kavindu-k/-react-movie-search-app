import React, { useState } from 'react';
import SearchMovies from './searchmovies';
import FavouritesList from './favouriteslist';
import MovieModal from './moviemodal';
import { DEFAULT_POSTER } from './config';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const addFavourite = (movie) => {
    if (!movie || !movie.imdbID) return;
    setFavourites((previous) => {
      const exists = previous.some(
        (item) => item.imdbID === movie.imdbID
      );

      return exists ? previous : [...previous, movie];
    });
  };

  const removeFavourite = (movie) => {
    if (!movie || !movie.imdbID) return;
    setFavourites((previous) =>
      previous.filter((item) => item.imdbID !== movie.imdbID)
    );
  };

  const showModal = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="App app">
      <header className="app-header">
        <h1 className="app-title">Movie Search App</h1>
        <p>Search for your favourite movies.</p>
      </header>

      <section className="search-section">
        <SearchMovies setMovies={setMovies} />
      </section>

      <section className="movies-section results-section">
        <h2>Search Results</h2>

        {movies.length === 0 ? (
          <p className="empty-message">No movies found. Search for a movie to begin.</p>
        ) : (
          <div className="movie-list">
            {movies.map((movie) => (
              <div
                className="movie-card"
                key={movie.imdbID}
                onClick={() => showModal(movie)}
              >
                <img
                  src={
                    movie.Poster && movie.Poster !== 'N/A'
                      ? movie.Poster
                      : DEFAULT_POSTER
                  }
                  alt={movie.Title || 'Movie poster'}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_POSTER;
                  }}
                />

                <div className="movie-info">
                  <h3 className="movie-title">{movie.Title}</h3>
                  <p className="movie-year">{movie.Year}</p>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      addFavourite(movie);
                    }}
                  >
                    Add to Favourites
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="favourites-section">
        <FavouritesList
          favourites={favourites}
          removeFavourite={removeFavourite}
          removefavourite={removeFavourite}
          showModal={showModal}
          showmodel={showModal}
        />
      </section>

      <MovieModal
        movie={selectedMovie}
        isOpen={Boolean(selectedMovie)}
        isModalOpen={Boolean(selectedMovie)}
        ismodalopen={Boolean(selectedMovie)}
        closeModal={closeModal}
        closemodal={closeModal}
      />
    </div>
  );
}

export default App;
