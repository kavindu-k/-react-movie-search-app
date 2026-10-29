import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders movie search input and header', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/enter a movie title/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /search movie/i })).toBeInTheDocument();
});

test('searches and displays movie results, handles missing posters', async () => {
  const fakeSearchResults = {
    Response: 'True',
    Search: [
      {
        Title: 'Inception',
        Year: '2010',
        imdbID: 'tt1375666',
        Type: 'movie',
        Poster: 'N/A'
      }
    ]
  };

  global.fetch = jest.fn().mockResolvedValueOnce({
    json: async () => fakeSearchResults
  });

  render(<App />);

  fireEvent.change(screen.getByPlaceholderText(/enter a movie title/i), {
    target: { value: 'Inception' }
  });
  fireEvent.click(screen.getByRole('button', { name: /search movie/i }));

  await waitFor(() => {
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });
  expect(screen.getByText('2010')).toBeInTheDocument();
  const posterImg = screen.getByAltText('Inception');
  expect(posterImg.src).toContain('placehold.co');
});

test('clicking a movie opens modal, shows loading then details, and closes on close button', async () => {
  const fakeSearchResults = {
    Response: 'True',
    Search: [
      {
        Title: 'Interstellar',
        Year: '2014',
        imdbID: 'tt0816692',
        Type: 'movie',
        Poster: 'https://example.com/poster.jpg'
      }
    ]
  };

  const fakeDetails = {
    Title: 'Interstellar',
    Year: '2014',
    Released: '07 Nov 2014',
    Genre: 'Adventure, Drama, Sci-Fi',
    Director: 'Christopher Nolan',
    Actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
    Runtime: '169 min',
    imdbRating: '8.7',
    Plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
    Poster: 'https://example.com/poster.jpg',
    Response: 'True'
  };

  let resolveDetailsFetch;
  const detailsPromise = new Promise((resolve) => {
    resolveDetailsFetch = resolve;
  });

  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      json: async () => fakeSearchResults
    })
    .mockImplementationOnce(() => detailsPromise);

  render(<App />);

  fireEvent.change(screen.getByPlaceholderText(/enter a movie title/i), {
    target: { value: 'Interstellar' }
  });
  fireEvent.click(screen.getByRole('button', { name: /search movie/i }));

  await waitFor(() => {
    expect(screen.getByText('Interstellar')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Interstellar'));

  expect(screen.getByText(/loading details/i)).toBeInTheDocument();

  resolveDetailsFetch({
    json: async () => fakeDetails
  });

  await waitFor(() => {
    expect(screen.getByText(/adventure, drama, sci-fi/i)).toBeInTheDocument();
  });
  expect(screen.getByText(/christopher nolan/i)).toBeInTheDocument();
  expect(screen.getByText(/matthew mcconaughey/i)).toBeInTheDocument();
  expect(screen.getByText(/169 min/i)).toBeInTheDocument();
  expect(screen.getByText(/8\.7/i)).toBeInTheDocument();
  expect(screen.getByText(/07 Nov 2014/i)).toBeInTheDocument();
  expect(screen.getByText(/a team of explorers travel through a wormhole/i)).toBeInTheDocument();

  const closeButton = screen.getByRole('button', { name: /close movie details/i });
  fireEvent.click(closeButton);

  await waitFor(() => {
    expect(screen.queryByText(/adventure, drama, sci-fi/i)).not.toBeInTheDocument();
  });
});

test('adding to favourites, removing, and clicking favourite opens modal', async () => {
  const fakeSearchResults = {
    Response: 'True',
    Search: [
      {
        Title: 'The Matrix',
        Year: '1999',
        imdbID: 'tt0133093',
        Type: 'movie',
        Poster: 'https://example.com/matrix.jpg'
      }
    ]
  };

  const fakeMatrixDetails = {
    Title: 'The Matrix',
    Year: '1999',
    Released: '31 Mar 1999',
    Genre: 'Action, Sci-Fi',
    Director: 'Lana Wachowski, Lilly Wachowski',
    Actors: 'Keanu Reeves, Laurence Fishburne',
    Runtime: '136 min',
    imdbRating: '8.7',
    Plot: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld...',
    Poster: 'https://example.com/matrix.jpg',
    Response: 'True'
  };

  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      json: async () => fakeSearchResults
    })
    .mockResolvedValueOnce({
      json: async () => fakeMatrixDetails
    });

  render(<App />);

  fireEvent.change(screen.getByPlaceholderText(/enter a movie title/i), {
    target: { value: 'Matrix' }
  });
  fireEvent.click(screen.getByRole('button', { name: /search movie/i }));

  await waitFor(() => {
    expect(screen.getByText('The Matrix')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: /add to favourites/i }));

  expect(screen.getByRole('button', { name: /remove from favourites/i })).toBeInTheDocument();

  const favouriteItem = screen.getByText('My Favourite Movies').closest('section').querySelector('.favourite-movie');
  fireEvent.click(favouriteItem);

  await waitFor(() => {
    expect(screen.getByText(/lana wachowski/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: /close movie details/i }));

  fireEvent.click(screen.getByRole('button', { name: /remove from favourites/i }));
  expect(screen.queryByRole('button', { name: /remove from favourites/i })).not.toBeInTheDocument();
});

test('handles API errors and network failures in modal', async () => {
  const fakeSearchResults = {
    Response: 'True',
    Search: [
      {
        Title: 'Error Movie',
        Year: '2020',
        imdbID: 'tt9999999',
        Type: 'movie',
        Poster: 'N/A'
      }
    ]
  };

  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      json: async () => fakeSearchResults
    })
    .mockResolvedValueOnce({
      json: async () => ({
        Response: 'False',
        Error: 'Invalid API key!'
      })
    });

  render(<App />);

  fireEvent.change(screen.getByPlaceholderText(/enter a movie title/i), {
    target: { value: 'Error Movie' }
  });
  fireEvent.click(screen.getByRole('button', { name: /search movie/i }));

  await waitFor(() => {
    expect(screen.getByText('Error Movie')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Error Movie'));

  await waitFor(() => {
    expect(screen.getByText(/invalid api key!/i)).toBeInTheDocument();
  });
});
