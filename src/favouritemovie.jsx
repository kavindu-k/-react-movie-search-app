import React from 'react';
import { DEFAULT_POSTER } from './config';

function FavouriteMovie({
  movie,
  removeFavourite,
  removefavourite,
  showModal,
  showmodel
}) {
  const onRemove = removeFavourite || removefavourite;
  const onShow = showModal || showmodel;

  const handleRemove = (event) => {
    event.stopPropagation();

    if (typeof onRemove === 'function') {
      onRemove(movie);
    } else {
      console.error('removeFavourite is not a function');
    }
  };

  const handleCardClick = () => {
    if (typeof onShow === 'function') {
      onShow(movie);
    }
  };

  const posterSrc =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : DEFAULT_POSTER;

  return (
    <li
      className="favourite-movie"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={posterSrc}
        alt={movie.Title || 'Movie poster'}
        onError={(e) => {
          e.currentTarget.src = DEFAULT_POSTER;
        }}
      />

      <div className="favourite-movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">{movie.Year}</p>
      </div>

      <button
        className="remove-button"
        type="button"
        onClick={handleRemove}
      >
        Remove from Favourites
      </button>
    </li>
  );
}

export default FavouriteMovie;
