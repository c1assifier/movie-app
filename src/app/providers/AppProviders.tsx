import type { PropsWithChildren } from 'react'
import { CompareProvider } from '@/app/providers/CompareProvider'
import { AppRoot, ConfigProvider } from '@vkontakte/vkui'
import { FavoritesProvider } from '@/app/providers/FavoritesProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider colorScheme="dark">
      <AppRoot>
        <FavoritesProvider>
          <CompareProvider>{children}</CompareProvider>
        </FavoritesProvider>
      </AppRoot>
    </ConfigProvider>
  )
}
