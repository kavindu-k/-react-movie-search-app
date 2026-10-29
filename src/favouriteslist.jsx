import React from 'react';
import FavouriteMovie from './favouritemovie';

function FavouritesList({
  favourites = [],
  removeFavourite,
  removefavourite,
  showModal,
  showmodel
}) {
  const onRemove = removeFavourite || removefavourite;
  const onShow = showModal || showmodel;

  return (
    <section className="favourites-container">
      <h2>My Favourite Movies</h2>

      {favourites.length > 0 ? (
        <ul className="favourites-list">
          {favourites.map((movie) => (
            <FavouriteMovie
              key={movie.imdbID}
              movie={movie}
              removeFavourite={onRemove}
              removefavourite={onRemove}
              showModal={onShow}
              showmodel={onShow}
            />
          ))}
        </ul>
      ) : (
        <p className="empty-message">No favourite movies found.</p>
      )}
    </section>
  );
}

export default FavouritesList;
