import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Group, Spinner, Text } from '@vkontakte/vkui'
import { getMovieById } from '@/api/movies'
import { ROUTES } from '@/app/router/routes'
import { InfoCard } from '@/components/info-card/InfoCard'
import type { MovieDetails } from '@/types/movie'
import '@/pages/movie-details/ui/MovieDetailsPage.css'

type MovieDetailsState =
  | {
      status: 'idle' | 'loading'
      movie: null
      error: null
    }
  | {
      status: 'success'
      movie: MovieDetails
      error: null
    }
  | {
      status: 'error'
      movie: null
      error: string
    }

const initialState: MovieDetailsState = {
  status: 'idle',
  movie: null,
  error: null,
}

function formatRating(rating: number | null) {
  return rating ? rating.toFixed(1) : 'Нет рейтинга'
}

function formatReleaseDate(releaseDate: string | null) {
  if (!releaseDate) {
    return 'Дата не указана'
  }

  return new Date(releaseDate).toLocaleDateString('ru-RU')
}

export function MovieDetailsPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [movieState, setMovieState] = useState<MovieDetailsState>(initialState)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    if (!movieId) {
      return
    }

    const currentMovieId = movieId
    let isMounted = true

    async function loadMovie() {
      setMovieState({
        status: 'loading',
        movie: null,
        error: null,
      })

      try {
        const movie = await getMovieById(currentMovieId)

        if (!isMounted) {
          return
        }

        setImageFailed(false)

        setMovieState({
          status: 'success',
          movie,
          error: null,
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Не удалось загрузить страницу фильма.'

        setMovieState({
          status: 'error',
          movie: null,
          error: message,
        })
      }
    }

    void loadMovie()

    return () => {
      isMounted = false
    }
  }, [movieId])

  if (movieState.status === 'idle' || movieState.status === 'loading') {
    return (
      <Group className="movie-details-page__state">
        <div className="movie-details-page__state-body">
          <Spinner size="xl" />
          <Text>Загружаем страницу фильма...</Text>
        </div>
      </Group>
    )
  }

  if (!movieId) {
    return (
      <InfoCard
        title="Не удалось загрузить фильм"
        description="Не удалось определить фильм по адресу страницы."
        footer={
          <Button mode="secondary" onClick={() => navigate(ROUTES.movies)}>
            Вернуться в каталог
          </Button>
        }
      />
    )
  }

  if (movieState.status === 'error') {
    return (
      <InfoCard
        title="Не удалось загрузить фильм"
        description={movieState.error || 'Во время запроса к API произошла ошибка.'}
        footer={
          <Button mode="secondary" onClick={() => navigate(ROUTES.movies)}>
            Вернуться в каталог
          </Button>
        }
      />
    )
  }

  if (movieState.status !== 'success') {
    return null
  }

  const { movie } = movieState
  const posterUrl = imageFailed ? null : movie.posterUrl
  const rating = formatRating(movie.rating)
  const releaseDate = formatReleaseDate(movie.releaseDate)
  const duration = movie.duration ? `${movie.duration} мин` : 'Не указана'
  const description = movie.description || 'Описание для этого фильма пока отсутствует.'

  return (
    <section className="movie-details-page">
      <div className="movie-details-page__topbar">
        <Button mode="tertiary" size="m" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>

      <div className="movie-details-page__layout">
        <aside className="movie-details-page__poster-card">
          <div className="movie-details-page__poster-wrap">
            {posterUrl ? (
              <img
                className="movie-details-page__poster"
                src={posterUrl}
                alt={movie.title}
                loading="eager"
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="movie-details-page__poster-placeholder">
                <span>Нет постера</span>
              </div>
            )}
          </div>
        </aside>

        <article className="movie-details-page__content-card">
          <div className="movie-details-page__content">
            <header className="movie-details-page__header">
              <h1 className="movie-details-page__title">{movie.title}</h1>

              <div className="movie-details-page__badges">
                <span className="movie-details-page__badge movie-details-page__badge--rating">
                  Рейтинг: {rating}
                </span>
                <span className="movie-details-page__badge">{movie.year ?? 'Год не указан'}</span>
              </div>
            </header>

            <p className="movie-details-page__description">{description}</p>

            <div className="movie-details-page__facts">
              <div className="movie-details-page__fact">
                <span className="movie-details-page__fact-label">Дата выхода</span>
                <span className="movie-details-page__fact-value">{releaseDate}</span>
              </div>

              <div className="movie-details-page__fact">
                <span className="movie-details-page__fact-label">Длительность</span>
                <span className="movie-details-page__fact-value">{duration}</span>
              </div>
            </div>

            <div className="movie-details-page__genres">
              {movie.genres.length > 0 ? (
                movie.genres.map((genre) => (
                  <span key={genre} className="movie-details-page__genre">
                    {genre}
                  </span>
                ))
              ) : (
                <span className="movie-details-page__genre">Жанры не указаны</span>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
