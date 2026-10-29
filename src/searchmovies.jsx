import { useState } from 'react';
import { OMDB_API_KEY, OMDB_BASE_URL } from './config';

function SearchMovies({ setMovies }) {
  const [movieTitle, setMovieTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    const title = movieTitle.trim();
    if (!title) {
      setMovies([]);
      setError('Enter a movie title to search.');
      return;
    }

    if (!OMDB_API_KEY) {
      setMovies([]);
      setError('OMDb API key is missing. Please configure an API key.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(title)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search || []);
      } else {
        setMovies([]);
        setError(data.Error || 'No movies found.');
      }
    } catch (err) {
      setMovies([]);
      setError('Could not connect to OMDb. Check your internet connection and API key.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-movies">
      <form onSubmit={handleSearch}>
        <label htmlFor="movie-query">Movie Title</label>
        <input
          id="movie-query"
          type="text"
          name="query"
          value={movieTitle}
          onChange={(event) => setMovieTitle(event.target.value)}
          placeholder="Enter a movie title"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Movie'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SearchMovies;
