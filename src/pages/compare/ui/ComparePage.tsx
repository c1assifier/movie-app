import { useEffect, useState } from 'react'
import { Button, Group, Spinner, Text } from '@vkontakte/vkui'
import { getMovieById } from '@/api/movies'
import { useCompare } from '@/app/providers/compare-context'
import { InfoCard } from '@/components/info-card/InfoCard'
import type { MovieDetails } from '@/types/movie'
import '@/pages/compare/ui/ComparePage.css'

type CompareMoviesState =
  | {
      status: 'idle' | 'loading'
      movies: MovieDetails[]
      error: null
    }
  | {
      status: 'success'
      movies: MovieDetails[]
      error: null
    }
  | {
      status: 'error'
      movies: MovieDetails[]
      error: string
    }

const initialState: CompareMoviesState = {
  status: 'idle',
  movies: [],
  error: null,
}

function formatRating(rating: number | null) {
  return rating ? rating.toFixed(1) : 'Нет рейтинга'
}

function formatYear(year: number | null) {
  return year ?? 'Не указан'
}

function formatGenres(genres: string[]) {
  return genres.length > 0 ? genres.join(', ') : 'Не указаны'
}

function formatDuration(duration: number | null) {
  return duration ? `${duration} мин` : 'Не указана'
}

type CompareFact = {
  label: string
  value: string | number
}

function buildMovieFacts(movie: MovieDetails): CompareFact[] {
  return [
    { label: 'Название', value: movie.title },
    { label: 'Год выпуска', value: formatYear(movie.year) },
    { label: 'Рейтинг', value: formatRating(movie.rating) },
    { label: 'Жанры', value: formatGenres(movie.genres) },
    { label: 'Длительность', value: formatDuration(movie.duration) },
  ]
}

export function ComparePage() {
  const { comparedMovies, clearComparedMovies } = useCompare()
  const [compareState, setCompareState] = useState<CompareMoviesState>(initialState)

  useEffect(() => {
    if (comparedMovies.length === 0) {
      return
    }

    let isMounted = true

    async function loadMovies() {
      setCompareState({
        status: 'loading',
        movies: [],
        error: null,
      })

      try {
        const movies = await Promise.all(comparedMovies.map((movie) => getMovieById(movie.id)))

        if (!isMounted) {
          return
        }

        setCompareState({
          status: 'success',
          movies,
          error: null,
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Не удалось загрузить фильмы для сравнения.'

        setCompareState({
          status: 'error',
          movies: [],
          error: message,
        })
      }
    }

    void loadMovies()

    return () => {
      isMounted = false
    }
  }, [comparedMovies])

  if (comparedMovies.length === 0) {
    return (
      <InfoCard
        title="Сравнение"
        description="Добавьте фильмы в сравнение из каталога или со страницы фильма."
      />
    )
  }

  if (compareState.status === 'idle' || compareState.status === 'loading') {
    return (
      <Group className="compare-page__state">
        <div className="compare-page__state-body">
          <Spinner size="xl" />
          <Text>Подготавливаем сравнение...</Text>
        </div>
      </Group>
    )
  }

  if (compareState.status === 'error') {
    return (
      <InfoCard
        title="Не удалось загрузить сравнение"
        description={compareState.error || 'Во время запроса к API произошла ошибка.'}
      />
    )
  }

  return (
    <section className="compare-page">
      <header className="compare-page__header">
        <div className="compare-page__title-block">
          <h1 className="compare-page__title">Сравнение</h1>
        </div>

        <Button mode="secondary" onClick={clearComparedMovies}>
          Очистить
        </Button>
      </header>

      <div className={compareState.movies.length === 1 ? 'compare-page__grid compare-page__grid--single' : 'compare-page__grid'}>
        {compareState.movies.map((movie) => (
          <article key={movie.id} className="compare-page__card">
            <div className="compare-page__facts">
              {buildMovieFacts(movie).map((fact) => (
                <div key={fact.label} className="compare-page__fact">
                  <span className="compare-page__fact-label">{fact.label}</span>
                  <span className="compare-page__fact-value">{fact.value}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
