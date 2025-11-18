import {
  LogOut,
  Building2,
  Workflow,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  type LucideIcon
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

interface SubRoute {
  path: string
  label: string
}

interface Route {
  path?: string
  label: string
  icon: LucideIcon
  subRoutes?: SubRoute[]
}

const routes: Route[] = [
  {
    label: "Agentes.",
    icon: Workflow,
    subRoutes: [
      {
        path: "/",
        label: "Seletor de Datas."
      },
      {
        path: "/agent-pipeline",
        label: "Pipeline de Agentes."
      }
    ]
  },
  {
    label: "Perfis de Marca.",
    icon: Building2,
    subRoutes: [
      {
        path: "/brand-profiles",
        label: "Consultar."
      },
      {
        path: "/brand-profiles/create",
        label: "Criar."
      }
    ]
  }
]

interface AppSidebarProps {
  collapsed?: boolean
  onNavigate?: () => void
  onToggleCollapse?: () => void
}

export function AppSidebar({ collapsed = false, onNavigate, onToggleCollapse }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['Agentes.', 'Perfis de Marca.']))

  const handleNavigate = (path: string) => {
    navigate(path)
    onNavigate?.()
  }

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const isItemExpanded = (label: string) => expandedItems.has(label)

  const isSubRouteActive = (subRoutes?: SubRoute[]) => {
    if (!subRoutes) return false
    return subRoutes.some((subRoute) => location.pathname === subRoute.path)
  }

  useEffect(() => {
    routes.forEach((route) => {
      if (route.subRoutes) {
        const hasActiveSubRoute = route.subRoutes.some((subRoute) => location.pathname === subRoute.path)
        if (hasActiveSubRoute) {
          setExpandedItems((prev) => {
            if (!prev.has(route.label)) {
              return new Set([...prev, route.label])
            }
            return prev
          })
        }
      }
    })
  }, [location.pathname])

  const isCollapsed = collapsed

  return (
    <div
      className="flex flex-col h-full bg-card shadow-sm relative rounded-none lg:rounded-lg"
    >
      <div className={`${isCollapsed ? 'lg:p-2 p-6 pb-4' : 'p-6 pb-4'}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-center relative">
            {!isCollapsed && (
              <span className="text-lg text-foreground" style={{ fontFamily: 'var(--font-logo)' }}>copy.</span>
            )}
            {isCollapsed && (
              <span className="text-lg text-foreground lg:block hidden" style={{ fontFamily: 'var(--font-logo)' }}>c.</span>
            )}
          </div>
        </div>
        {!isCollapsed && <div className="mt-4 mx-4"></div>}
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className={`space-y-1 ${isCollapsed ? 'lg:px-2 px-4' : 'px-4'}`}>
          {routes.map((route) => {
            const IconComponent = route.icon
            const hasSubRoutes = route.subRoutes && route.subRoutes.length > 0
            const isExpanded = isItemExpanded(route.label)
            const isActive = route.path ? location.pathname === route.path : isSubRouteActive(route.subRoutes)
            
            if (hasSubRoutes) {
              return (
                <div 
                  key={route.label} 
                  className={`space-y-1 rounded-lg ${isActive ? 'bg-primary/10' : ''}`}
                >
                  <button
                    onClick={() => !isCollapsed && toggleExpand(route.label)}
                    className={`
                      flex items-center relative rounded-lg w-full
                      ${isCollapsed ? 'lg:justify-center lg:px-2 justify-start gap-3 px-3 py-3' : 'gap-3 px-3 py-3'}
                      ${isActive 
                        ? 'text-foreground' 
                        : 'text-foreground hover:bg-muted/50'
                      }
                    `}
                    title={isCollapsed ? route.label : undefined}
                  >
                    <IconComponent 
                      size={20} 
                      className={`flex-shrink-0 ${!isActive ? 'text-muted-foreground' : ''}`} 
                    />
                    {!isCollapsed && (
                      <>
                        <span className="text-sm overflow-hidden whitespace-nowrap flex-1 text-left">
                          {route.label}
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={16} className="flex-shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronDown size={16} className="flex-shrink-0 text-muted-foreground" />
                        )}
                      </>
                    )}
                    {isCollapsed && (
                      <span className="text-sm overflow-hidden whitespace-nowrap lg:hidden">
                        {route.label}
                      </span>
                    )}
                  </button>
                  {!isCollapsed && isExpanded && route.subRoutes && (
                    <div className="ml-8 space-y-1 pb-1">
                      {route.subRoutes.map((subRoute) => {
                        const isSubActive = location.pathname === subRoute.path
                        return (
                          <button
                            key={subRoute.path}
                            onClick={() => handleNavigate(subRoute.path)}
                            className={`
                              flex items-center w-full rounded-lg px-3 py-2 text-sm
                              ${isSubActive 
                                ? 'text-foreground font-medium' 
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                              }
                            `}
                          >
                            {subRoute.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <button
                key={route.path}
                onClick={() => route.path && handleNavigate(route.path)}
                className={`
                  flex items-center relative rounded-lg
                  ${isCollapsed ? 'lg:justify-center lg:px-2 justify-start gap-3 px-3 py-3' : 'gap-3 px-3 py-3'}
                  ${isActive 
                    ? 'w-full bg-primary/10 text-foreground' 
                    : 'w-full text-foreground hover:bg-muted/50 rounded-lg'
                  }
                `}
                title={isCollapsed ? route.label : undefined}
              >
                <IconComponent 
                  size={20} 
                  className={`flex-shrink-0 ${!isActive ? 'text-muted-foreground' : ''}`} 
                />
                {!isCollapsed && (
                  <span className="text-sm overflow-hidden whitespace-nowrap">
                    {route.label}
                  </span>
                )}
                {isCollapsed && (
                  <span className="text-sm overflow-hidden whitespace-nowrap lg:hidden">
                    {route.label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className={`space-y-1 ${isCollapsed ? 'lg:p-2 p-4' : 'p-4'}`}>
  {!isCollapsed && (
    <div className="px-3 py-2 mb-2">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <User size={18} className="text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <span className="text-sm text-foreground leading-tight">João Pedro</span>

          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary w-fit leading-tight">
            Admin
          </span>
        </div>
      </div>
    </div>
  )}

        {isCollapsed && (
          <div className="lg:px-2 lg:py-2 lg:mb-2 lg:flex lg:justify-center hidden">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-muted-foreground" />
            </div>
          </div>
        )}
        <button 
          className={`flex items-center w-full transition-colors text-foreground hover:bg-muted rounded-lg ${
            isCollapsed ? 'lg:justify-center lg:px-2 justify-start gap-3 px-3 py-2.5' : 'gap-3 px-3 py-2.5'
          }`}
          title={isCollapsed ? 'Configurações' : undefined}
        >
          <Settings size={20} className="flex-shrink-0 text-muted-foreground" />
          {!isCollapsed && (
            <span className="text-sm overflow-hidden whitespace-nowrap">
              Configurações
            </span>
          )}
          {isCollapsed && (
            <span className="text-sm overflow-hidden whitespace-nowrap lg:hidden">
              Configurações
            </span>
          )}
        </button>
        <button 
          className={`flex items-center w-full transition-colors text-destructive hover:bg-muted rounded-lg ${
            isCollapsed ? 'lg:justify-center lg:px-2 justify-start gap-3 px-3 py-2.5' : 'gap-3 px-3 py-2.5'
          }`}
          title={isCollapsed ? 'Sair' : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm overflow-hidden whitespace-nowrap">
              Sair
            </span>
          )}
          {isCollapsed && (
            <span className="text-sm overflow-hidden whitespace-nowrap lg:hidden">
              Sair
            </span>
          )}
        </button>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex items-center w-full transition-colors text-foreground hover:bg-muted rounded-lg mt-2 ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
            }`}
            title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight size={20} className="flex-shrink-0 text-muted-foreground" />
            ) : (
              <>
                <ChevronLeft size={20} className="flex-shrink-0 text-muted-foreground" />
                <span className="text-sm overflow-hidden whitespace-nowrap">
                  Colapsar
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}