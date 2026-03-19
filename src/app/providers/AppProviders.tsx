import type { PropsWithChildren } from 'react'
import { AppRoot, ConfigProvider } from '@vkontakte/vkui'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider colorScheme="dark">
      <AppRoot>{children}</AppRoot>
    </ConfigProvider>
  )
}
