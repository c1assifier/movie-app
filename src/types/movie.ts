export type MovieListItem = {
  id: number
  title: string
  year: number | null
  rating: number | null
  posterUrl: string | null
}

export type MovieDetails = {
  id: number
  title: string
  description: string | null
  year: number | null
  rating: number | null
  posterUrl: string | null
  releaseDate: string | null
  genres: string[]
  duration: number | null
}

export type PaginatedMovies = {
  items: MovieListItem[]
  page: number
  pages: number
  total: number
}
