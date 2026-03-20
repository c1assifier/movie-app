import type { MoviesQueryParams } from '@/api/movies/movies.types'
import type { MovieDetails, PaginatedMovies } from '@/types/movie'

type MockMovieSeed = {
  title: string
  year: number
  rating: number
  genres: string[]
  duration: number
  description: string
}

const mockMovieSeeds: MockMovieSeed[] = [
  {
    title: 'Полуночный маршрут',
    year: 2004,
    rating: 8.5,
    genres: ['драма', 'триллер'],
    duration: 118,
    description: 'Ночной диспетчер оказывается втянут в цепочку событий, которая меняет его жизнь.',
  },
  {
    title: 'Северный ветер',
    year: 2010,
    rating: 8.2,
    genres: ['драма', 'приключения'],
    duration: 124,
    description: 'История экспедиции, в которой каждый участник скрывает свою настоящую цель.',
  },
  {
    title: 'Город теней',
    year: 2016,
    rating: 8.7,
    genres: ['детектив', 'триллер'],
    duration: 111,
    description: 'Молодой следователь пытается раскрыть дело, которое давно списали в архив.',
  },
  {
    title: 'Последний сеанс',
    year: 2001,
    rating: 7.9,
    genres: ['ужасы', 'триллер'],
    duration: 103,
    description: 'Старый кинотеатр закрывают, но его последний показ оборачивается кошмаром.',
  },
  {
    title: 'Линия прибоя',
    year: 2014,
    rating: 7.8,
    genres: ['мелодрама', 'драма'],
    duration: 109,
    description: 'Двое случайных знакомых пытаются начать новую жизнь в приморском городе.',
  },
  {
    title: 'Орбита',
    year: 2019,
    rating: 8.9,
    genres: ['фантастика', 'приключения'],
    duration: 132,
    description: 'Команда орбитальной станции сталкивается с сигналом неизвестного происхождения.',
  },
  {
    title: 'Смех без правил',
    year: 2008,
    rating: 7.4,
    genres: ['комедия'],
    duration: 98,
    description: 'Неудачливый актер внезапно получает шанс сыграть главную роль в большом шоу.',
  },
  {
    title: 'Стальная тропа',
    year: 2012,
    rating: 8.1,
    genres: ['боевик', 'приключения'],
    duration: 126,
    description: 'Бывший военный вынужден снова выйти на опасную миссию ради семьи.',
  },
  {
    title: 'Теплый снег',
    year: 2020,
    rating: 7.6,
    genres: ['драма', 'мелодрама'],
    duration: 115,
    description: 'Под Новый год судьба сводит вместе людей, которые давно перестали верить в чудо.',
  },
  {
    title: 'Механика памяти',
    year: 2018,
    rating: 8.4,
    genres: ['фантастика', 'детектив'],
    duration: 121,
    description: 'Ученый создает технологию восстановления воспоминаний и теряет контроль над экспериментом.',
  },
  {
    title: 'Хвост кометы',
    year: 2006,
    rating: 7.7,
    genres: ['мультфильм', 'приключения'],
    duration: 92,
    description: 'Компания подростков отправляется в невероятное путешествие вслед за редкой кометой.',
  },
  {
    title: 'Точка возврата',
    year: 2021,
    rating: 8.3,
    genres: ['боевик', 'триллер'],
    duration: 117,
    description: 'Переговорщик должен остановить катастрофу, пока часы отсчитывают последние минуты.',
  },
]

const mockMovies: MovieDetails[] = Array.from({ length: 72 }, (_, index) => {
  const seed = mockMovieSeeds[index % mockMovieSeeds.length]
  const cycle = Math.floor(index / mockMovieSeeds.length)
  const year = seed.year + cycle
  const rating = Math.min(Number((seed.rating + cycle * 0.1).toFixed(1)), 9.9)
  const duration = seed.duration + cycle * 2

  return {
    id: 1001 + index,
    title: cycle === 0 ? seed.title : `${seed.title} ${cycle + 1}`,
    description: seed.description,
    year,
    rating,
    posterUrl: null,
    releaseDate: `${year}-09-01`,
    genres: seed.genres,
    duration,
  }
}).sort((leftMovie, rightMovie) => (rightMovie.rating ?? 0) - (leftMovie.rating ?? 0))

function matchesGenres(movie: MovieDetails, genres: string[]) {
  if (genres.length === 0) {
    return true
  }

  return genres.some((genre) => movie.genres.includes(genre))
}

function matchesRating(movie: MovieDetails, ratingRange?: MoviesQueryParams['ratingRange']) {
  if (!ratingRange || movie.rating === null) {
    return true
  }

  return movie.rating >= ratingRange.from && movie.rating <= ratingRange.to
}

function matchesYear(movie: MovieDetails, yearRange?: MoviesQueryParams['yearRange']) {
  if (!yearRange || movie.year === null) {
    return true
  }

  return movie.year >= yearRange.from && movie.year <= yearRange.to
}

export function getMockMovies(params: MoviesQueryParams = {}): PaginatedMovies {
  const { page = 1, limit = 50, genres = [], ratingRange, yearRange } = params

  const filteredMovies = mockMovies.filter(
    (movie) =>
      matchesGenres(movie, genres) &&
      matchesRating(movie, ratingRange) &&
      matchesYear(movie, yearRange),
  )

  const startIndex = (page - 1) * limit
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + limit)

  return {
    items: paginatedMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      posterUrl: movie.posterUrl,
    })),
    page,
    pages: Math.max(1, Math.ceil(filteredMovies.length / limit)),
    total: filteredMovies.length,
  }
}

export function getMockMovieById(movieId: string | number): MovieDetails {
  const movie = mockMovies.find((currentMovie) => currentMovie.id === Number(movieId))

  if (!movie) {
    throw new Error('Movie not found in mock data')
  }

  return movie
}
