import type { MoviesQueryParams } from '@/api/movies'

const CURRENT_YEAR = new Date().getFullYear()

export const MOVIES_FILTER_LIMIT = 50
export const MIN_RATING = 1
export const MAX_RATING = 10
export const MIN_YEAR = 1990
export const MAX_YEAR = CURRENT_YEAR

export const MOVIE_GENRES = [
  'боевик',
  'драма',
  'комедия',
  'триллер',
  'ужасы',
  'мелодрама',
  'фантастика',
  'приключения',
  'детектив',
  'мультфильм',
] as const

export type MovieGenre = (typeof MOVIE_GENRES)[number]

export type MoviesFilters = {
  genres: MovieGenre[]
  ratingFrom: number
  ratingTo: number
  yearFrom: number
  yearTo: number
}

export const defaultMoviesFilters: MoviesFilters = {
  genres: [],
  ratingFrom: MIN_RATING,
  ratingTo: MAX_RATING,
  yearFrom: MIN_YEAR,
  yearTo: MAX_YEAR,
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function parseBoundedNumber(
  rawValue: string | null,
  defaultValue: number,
  min: number,
  max: number,
) {
  if (!rawValue) {
    return defaultValue
  }

  const parsedValue = Number(rawValue)

  if (!Number.isFinite(parsedValue)) {
    return defaultValue
  }

  return clampNumber(parsedValue, min, max)
}

function normalizeRange(from: number, to: number) {
  if (from <= to) {
    return { from, to }
  }

  return { from: to, to: from }
}

function isMovieGenre(value: string): value is MovieGenre {
  return MOVIE_GENRES.includes(value as MovieGenre)
}

export function parseMoviesFilters(searchParams: URLSearchParams): MoviesFilters {
  const genres = Array.from(new Set(searchParams.getAll('genres').filter(isMovieGenre)))

  const ratingRange = normalizeRange(
    parseBoundedNumber(searchParams.get('ratingFrom'), MIN_RATING, MIN_RATING, MAX_RATING),
    parseBoundedNumber(searchParams.get('ratingTo'), MAX_RATING, MIN_RATING, MAX_RATING),
  )

  const yearRange = normalizeRange(
    parseBoundedNumber(searchParams.get('yearFrom'), MIN_YEAR, MIN_YEAR, MAX_YEAR),
    parseBoundedNumber(searchParams.get('yearTo'), MAX_YEAR, MIN_YEAR, MAX_YEAR),
  )

  return {
    genres,
    ratingFrom: ratingRange.from,
    ratingTo: ratingRange.to,
    yearFrom: yearRange.from,
    yearTo: yearRange.to,
  }
}

export function buildMoviesSearchParams(filters: MoviesFilters) {
  const searchParams = new URLSearchParams()

  filters.genres.forEach((genre) => {
    searchParams.append('genres', genre)
  })

  if (filters.ratingFrom !== MIN_RATING) {
    searchParams.set('ratingFrom', String(filters.ratingFrom))
  }

  if (filters.ratingTo !== MAX_RATING) {
    searchParams.set('ratingTo', String(filters.ratingTo))
  }

  if (filters.yearFrom !== MIN_YEAR) {
    searchParams.set('yearFrom', String(filters.yearFrom))
  }

  if (filters.yearTo !== MAX_YEAR) {
    searchParams.set('yearTo', String(filters.yearTo))
  }

  return searchParams
}

export function mapFiltersToMoviesQuery(filters: MoviesFilters): MoviesQueryParams {
  return {
    limit: MOVIES_FILTER_LIMIT,
    genres: filters.genres,
    ratingRange: {
      from: filters.ratingFrom,
      to: filters.ratingTo,
    },
    yearRange: {
      from: filters.yearFrom,
      to: filters.yearTo,
    },
  }
}
