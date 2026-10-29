import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { OMDB_API_KEY, OMDB_BASE_URL, DEFAULT_POSTER } from './config';

function MovieModal({
  movie,
  isOpen,
  isModalOpen,
  ismodalopen,
  closeModal,
  closemodal
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isCurrentlyOpen =
    isOpen !== undefined
      ? isOpen
      : isModalOpen !== undefined
      ? isModalOpen
      : ismodalopen !== undefined
      ? ismodalopen
      : Boolean(movie);

  const handleClose = closeModal || closemodal;

  useEffect(() => {
    if (!isCurrentlyOpen || !movie) {
      setDetails(null);
      setError('');
      setLoading(false);
      return;
    }

    if (!movie.imdbID) {
      setDetails(movie);
      setError('Missing movie ID. Full details cannot be retrieved.');
      setLoading(false);
      return;
    }

    if (!OMDB_API_KEY) {
      setDetails(movie);
      setError('OMDb API key is missing. Please configure a valid key.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchDetails() {
      setLoading(true);
      setError('');

      try {
        const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(
          movie.imdbID
        )}&plot=full`;
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();

        if (data.Response === 'True') {
          setDetails(data);
        } else {
          setDetails(movie);
          setError(data.Error || 'Full details are unavailable.');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setDetails(movie);
          setError('Network error: Could not load full movie details.');
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDetails();
    return () => controller.abort();
  }, [isCurrentlyOpen, movie]);

  if (!movie) return null;

  const currentMovie = details || movie;
  const posterSrc =
    currentMovie.Poster && currentMovie.Poster !== 'N/A'
      ? currentMovie.Poster
      : DEFAULT_POSTER;

  return (
    <Modal
      isOpen={Boolean(isCurrentlyOpen)}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      contentLabel={movie.Title || 'Movie details'}
      className="modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-content">
        <button
          className="close-button"
          type="button"
          onClick={handleClose}
          aria-label="Close movie details"
        >
          &times;
        </button>

        <div className="modal-header">
          <img
            src={posterSrc}
            alt={currentMovie.Title || 'Movie poster'}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_POSTER;
            }}
          />
          <div className="modal-title">
            <h2>{currentMovie.Title || 'Untitled Movie'}</h2>
            <p><strong>Year:</strong> {currentMovie.Year || 'N/A'}</p>
            {loading && <p className="modal-loading">Loading details...</p>}
            {error && <p className="error-message">{error}</p>}
            <p>
              <strong>Plot:</strong>{' '}
              {currentMovie.Plot && currentMovie.Plot !== 'N/A'
                ? currentMovie.Plot
                : 'Plot details are unavailable.'}
            </p>
          </div>
        </div>

        <div className="modal-body">
          <p>
            <strong>Release Date:</strong> {currentMovie.Released || 'N/A'}
          </p>
          <p>
            <strong>Genre:</strong> {currentMovie.Genre || 'N/A'}
          </p>
          <p>
            <strong>Director:</strong> {currentMovie.Director || 'N/A'}
          </p>
          <p>
            <strong>Actors:</strong> {currentMovie.Actors || 'N/A'}
          </p>
          <p>
            <strong>Runtime:</strong> {currentMovie.Runtime || 'N/A'}
          </p>
          <p>
            <strong>IMDb Rating:</strong> {currentMovie.imdbRating || 'N/A'}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default MovieModal;
