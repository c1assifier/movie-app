import { NavLink, Outlet } from 'react-router-dom'
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  Separator,
  SimpleCell,
  SplitLayout,
} from '@vkontakte/vkui'
import { ROUTES } from '@/app/router/routes'
import '@/components/app-layout/AppLayout.css'

const navItems = [
  { to: ROUTES.movies, label: 'Каталог' },
  { to: ROUTES.favorites, label: 'Избранное' },
  { to: ROUTES.compare, label: 'Сравнение' },
]

export function AppLayout() {
  return (
    <SplitLayout>
      <Panel className="app-layout-panel">
        <PanelHeader>
          <PanelHeaderContent>VK Movie App</PanelHeaderContent>
        </PanelHeader>
        <div className="app-layout">
          <aside className="app-layout__sidebar">
            <Group>
              <nav className="app-layout__nav" aria-label="Основная навигация">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to}>
                    {({ isActive }) => (
                      <SimpleCell
                        className={
                          isActive
                            ? 'app-layout__link app-layout__link--active'
                            : 'app-layout__link'
                        }
                      >
                        {item.label}
                      </SimpleCell>
                    )}
                  </NavLink>
                ))}
              </nav>
            </Group>
          </aside>
          <Separator className="app-layout__separator" />
          <main className="app-layout__content">
            <Outlet />
          </main>
        </div>
      </Panel>
    </SplitLayout>
  )
}
