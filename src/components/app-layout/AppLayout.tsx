import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu'
import {
  Group,
  IconButton,
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <SplitLayout>
      <Panel className="app-layout-panel">
        <PanelHeader>
          <PanelHeaderContent>VK Movie App</PanelHeaderContent>
        </PanelHeader>

        <div
          className={
            isSidebarCollapsed ? 'app-layout app-layout--collapsed' : 'app-layout'
          }
        >
          <aside className="app-layout__sidebar">
            <div className="app-layout__sidebar-inner">
              <div className="app-layout__sidebar-top">
                <IconButton
                  className="app-layout__toggle"
                  label={isSidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
                  onClick={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
                >
                  {isSidebarCollapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
                </IconButton>
              </div>

              <Group className="app-layout__nav-group">
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
                          <span className="app-layout__link-label">{item.label}</span>
                        </SimpleCell>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </Group>
            </div>
          </aside>

          <Separator className="app-layout__separator" />

          <main className="app-layout__content">
            <div className="app-layout__content-inner">
              <div className="app-layout__content-top">
                <IconButton
                  className="app-layout__toggle app-layout__content-toggle"
                  label={isSidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
                  onClick={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
                >
                  {isSidebarCollapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
                </IconButton>
              </div>

              <Outlet />
            </div>
          </main>
        </div>
      </Panel>
    </SplitLayout>
  )
}
