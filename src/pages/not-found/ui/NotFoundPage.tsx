import { Link } from 'react-router-dom'
import { Button } from '@vkontakte/vkui'
import { ROUTES } from '@/app/router/routes'
import { InfoCard } from '@/components/info-card/InfoCard'

export function NotFoundPage() {
  return (
    <InfoCard
      title="Страница не найдена"
      description="Такого маршрута сейчас нет. Можно вернуться в каталог и продолжить работу оттуда."
      footer={
        <Link to={ROUTES.movies}>
          <Button mode="secondary">Перейти в каталог</Button>
        </Link>
      }
    />
  )
}
