import { requestJson } from '@/api/http/http-client'
import { mapMovieDetails, mapPaginatedMovies } from '@/api/movies/movies.mappers'
import type {
  MoviesListResponse,
  MovieApiResponse,
  MoviesQueryParams,
} from '@/api/movies/movies.types'

const MOVIE_LIST_FIELDS = ['id', 'name', 'alternativeName', 'year', 'poster', 'rating']

const MOVIE_DETAILS_FIELDS = [
  'id',
  'name',
  'alternativeName',
  'description',
  'shortDescription',
  'year',
  'movieLength',
  'poster',
  'rating',
  'genres',
  'premiere',
]

function createMoviesQuery(params: MoviesQueryParams = {}) {
  const { page = 1, limit = 50, genres = [], ratingRange, yearRange } = params

  return {
    page,
    limit,
    selectFields: MOVIE_LIST_FIELDS,
    type: 'movie',
    sortField: 'rating.kp',
    sortType: '-1',
    'genres.name': genres,
    'rating.kp': ratingRange ? `${ratingRange.from}-${ratingRange.to}` : undefined,
    year: yearRange ? `${yearRange.from}-${yearRange.to}` : undefined,
  }
}

export async function getMovies(params?: MoviesQueryParams) {
  const response = await requestJson<MoviesListResponse>({
    path: '/movie',
    query: createMoviesQuery(params),
  })

  console.log('movies list response', response)

  return mapPaginatedMovies(response)
}

export async function getMovieById(movieId: string | number) {
  const response = await requestJson<MovieApiResponse>({
    path: `/movie/${movieId}`,
    query: {
      selectFields: MOVIE_DETAILS_FIELDS,
    },
  })

  console.log('movie details response', response)

  return mapMovieDetails(response)
}
