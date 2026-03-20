import { useState } from 'react'
import { Link, type To } from 'react-router-dom'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { LuScale } from 'react-icons/lu'
import { Button, Text } from '@vkontakte/vkui'
import { buildMovieDetailsRoute } from '@/app/router/routes'
import type { MovieListItem } from '@/types/movie'
import '@/components/movie-card/MovieCard.css'

type MovieCardProps = {
  movie: MovieListItem
  detailsState?: unknown
  openButtonLabel?: string
  openButtonTo?: To
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  isCompared?: boolean
  onCompareToggle?: () => void
}

function formatMovieMeta(year: number | null, rating: number | null) {
  return {
    year: year ?? 'Год не указан',
    rating: rating ? rating.toFixed(1) : 'Нет рейтинга',
  }
}

export function MovieCard({
  movie,
  detailsState,
  openButtonLabel = 'Открыть',
  openButtonTo,
  isFavorite = false,
  onFavoriteToggle,
  isCompared = false,
  onCompareToggle,
}: MovieCardProps) {
  const meta = formatMovieMeta(movie.year, movie.rating)
  const [imageFailed, setImageFailed] = useState(false)
  const posterUrl = imageFailed ? null : movie.posterUrl
  const detailsRoute = openButtonTo || buildMovieDetailsRoute(movie.id)

  return (
    <article className="movie-card">
      <Link to={detailsRoute} state={detailsState} className="movie-card__poster-link">
        {posterUrl ? (
          <img
            className="movie-card__poster"
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="movie-card__poster-placeholder">
            <span>Нет постера</span>
          </div>
        )}
      </Link>

      {onFavoriteToggle ? (
        <button
          type="button"
          className={isFavorite ? 'movie-card__favorite movie-card__favorite--active' : 'movie-card__favorite'}
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          onClick={onFavoriteToggle}
        >
          {isFavorite ? <FaStar /> : <FaRegStar />}
        </button>
      ) : null}

      {onCompareToggle ? (
        <button
          type="button"
          className={isCompared ? 'movie-card__compare movie-card__compare--active' : 'movie-card__compare'}
          aria-label={isCompared ? 'Убрать из сравнения' : 'Добавить в сравнение'}
          onClick={onCompareToggle}
        >
          <LuScale />
        </button>
      ) : null}

      <div className="movie-card__body">
        <Link to={detailsRoute} state={detailsState} className="movie-card__title-link">
          <h3 className="movie-card__title">{movie.title}</h3>
        </Link>

        <div className="movie-card__meta">
          <Text className="movie-card__year">{meta.year}</Text>
          <span className="movie-card__rating">{meta.rating}</span>
        </div>

        <Link to={detailsRoute} state={detailsState}>
          <Button mode="secondary" stretched size="m">
            {openButtonLabel}
          </Button>
        </Link>
      </div>
    </article>
  )
}
