import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Text } from '@vkontakte/vkui'
import { buildMovieDetailsRoute } from '@/app/router/routes'
import type { MovieListItem } from '@/types/movie'
import '@/components/movie-card/MovieCard.css'

type MovieCardProps = {
  movie: MovieListItem
}

function formatMovieMeta(year: number | null, rating: number | null) {
  return {
    year: year ?? 'Год не указан',
    rating: rating ? rating.toFixed(1) : 'Нет рейтинга',
  }
}

export function MovieCard({ movie }: MovieCardProps) {
  const meta = formatMovieMeta(movie.year, movie.rating)
  const [imageFailed, setImageFailed] = useState(false)
  const posterUrl = imageFailed ? null : movie.posterUrl

  return (
    <article className="movie-card">
      <Link to={buildMovieDetailsRoute(movie.id)} className="movie-card__poster-link">
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

      <div className="movie-card__body">
        <Link to={buildMovieDetailsRoute(movie.id)} className="movie-card__title-link">
          <h3 className="movie-card__title">{movie.title}</h3>
        </Link>

        <div className="movie-card__meta">
          <Text className="movie-card__year">{meta.year}</Text>
          <span className="movie-card__rating">{meta.rating}</span>
        </div>

        <Link to={buildMovieDetailsRoute(movie.id)}>
          <Button mode="secondary" stretched size="m">
            Открыть
          </Button>
        </Link>
      </div>
    </article>
  )
}
