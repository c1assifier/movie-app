export const ROUTES = {
  home: '/',
  movies: '/movies',
  movieDetails: '/movies/:movieId',
  favorites: '/favorites',
  compare: '/compare',
} as const

export const buildMovieDetailsRoute = (movieId: string | number) => `/movies/${movieId}`
