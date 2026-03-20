export type MoviesQueryParams = {
  page?: number
  limit?: number
  genres?: string[]
  ratingRange?: {
    from: number
    to: number
  }
  yearRange?: {
    from: number
    to: number
  }
}

export type MovieGenreResponse = {
  name?: string | null
}

export type MoviePosterResponse = {
  url?: string | null
  previewUrl?: string | null
}

export type MovieRatingResponse = {
  kp?: number | null
  imdb?: number | null
}

export type MovieApiResponse = {
  id: number
  name?: string | null
  alternativeName?: string | null
  description?: string | null
  shortDescription?: string | null
  year?: number | null
  movieLength?: number | null
  poster?: MoviePosterResponse | null
  rating?: MovieRatingResponse | null
  genres?: MovieGenreResponse[] | null
  premiere?: {
    world?: string | null
    russia?: string | null
    digital?: string | null
  } | null
}

export type MoviesListResponse = {
  docs: MovieApiResponse[]
  total: number
  limit: number
  page: number
  pages: number
}
