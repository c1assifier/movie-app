import { useParams } from 'react-router-dom'
import { InfoCard } from '@/components/info-card/InfoCard'

export function MovieDetailsPage() {
  const { movieId } = useParams()

  return (
    <InfoCard
      title="Фильм"
      description="Здесь будет страница фильма."
      footer={movieId ? `ID фильма: ${movieId}` : undefined}
    />
  )
}
