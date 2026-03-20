import type { PropsWithChildren } from 'react'
import { AppRoot, ConfigProvider } from '@vkontakte/vkui'
import { FavoritesProvider } from '@/app/providers/FavoritesProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider colorScheme="dark">
      <AppRoot>
        <FavoritesProvider>{children}</FavoritesProvider>
      </AppRoot>
    </ConfigProvider>
  )
}
