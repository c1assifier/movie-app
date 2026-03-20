import type { MovieDetails, MovieListItem, PaginatedMovies } from '@/types/movie'
import type { MovieApiResponse, MoviesListResponse } from '@/api/movies/movies.types'

function resolveMovieTitle(movie: MovieApiResponse) {
  return movie.name || movie.alternativeName || 'Без названия'
}

function resolveMovieRating(movie: MovieApiResponse) {
  return movie.rating?.kp ?? movie.rating?.imdb ?? null
}

function resolveMoviePoster(movie: MovieApiResponse) {
  return movie.poster?.url || movie.poster?.previewUrl || null
}

function resolveMovieGenres(movie: MovieApiResponse) {
  return (movie.genres || []).map((genre) => genre.name).filter(Boolean) as string[]
}

export function mapMovieListItem(movie: MovieApiResponse): MovieListItem {
  return {
    id: movie.id,
    title: resolveMovieTitle(movie),
    year: movie.year ?? null,
    rating: resolveMovieRating(movie),
    posterUrl: resolveMoviePoster(movie),
  }
}

export function mapMovieDetails(movie: MovieApiResponse): MovieDetails {
  return {
    id: movie.id,
    title: resolveMovieTitle(movie),
    description: movie.description || movie.shortDescription || null,
    year: movie.year ?? null,
    rating: resolveMovieRating(movie),
    posterUrl: resolveMoviePoster(movie),
    releaseDate: movie.premiere?.world || movie.premiere?.russia || movie.premiere?.digital || null,
    genres: resolveMovieGenres(movie),
    duration: movie.movieLength ?? null,
  }
}

export function mapPaginatedMovies(response: MoviesListResponse): PaginatedMovies {
  return {
    items: response.docs.map(mapMovieListItem),
    page: response.page,
    pages: response.pages,
    total: response.total,
  }
}
