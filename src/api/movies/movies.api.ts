import { requestJson } from '@/api/http/http-client'
import { mapMovieDetails, mapPaginatedMovies } from '@/api/movies/movies.mappers'
import { getMockMovieById, getMockMovies } from '@/api/movies/movies.mock'
import type {
  MoviesListResponse,
  MovieApiResponse,
  MoviesQueryParams,
} from '@/api/movies/movies.types'
import { ApiError } from '@/api/http/http-client'

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

const shouldUseMockApi = !__POISKKINO_HAS_API_KEY__

export async function getMovies(params?: MoviesQueryParams) {
  if (shouldUseMockApi) {
    return getMockMovies(params)
  }

  try {
    const response = await requestJson<MoviesListResponse>({
      path: '/movie',
      query: createMoviesQuery(params),
    })

    return mapPaginatedMovies(response)
  } catch (error) {
    if (error instanceof ApiError && [401, 403, 429].includes(error.status)) {
      return getMockMovies(params)
    }

    throw error
  }
}

export async function getMovieById(movieId: string | number) {
  if (shouldUseMockApi) {
    return getMockMovieById(movieId)
  }

  try {
    const response = await requestJson<MovieApiResponse>({
      path: `/movie/${movieId}`,
      query: {
        selectFields: MOVIE_DETAILS_FIELDS,
      },
    })

    return mapMovieDetails(response)
  } catch (error) {
    if (error instanceof ApiError && [401, 403, 429].includes(error.status)) {
      return getMockMovieById(movieId)
    }

    throw error
  }
}
