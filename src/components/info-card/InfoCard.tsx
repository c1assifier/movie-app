import type { ReactNode } from 'react'
import { Group, Header, Text } from '@vkontakte/vkui'
import '@/components/info-card/InfoCard.css'

type InfoCardProps = {
  title: string
  description: string
  footer?: ReactNode
}

export function InfoCard({ title, description, footer }: InfoCardProps) {
  return (
    <Group className="info-card">
      <div className="info-card__inner">
        <Header size="l">{title}</Header>
        <Text>{description}</Text>
        {footer ? <div className="info-card__footer">{footer}</div> : null}
      </div>
    </Group>
  )
}
