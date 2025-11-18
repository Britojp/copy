import {
  LogOut,
  Building2,
  Workflow,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  type LucideIcon
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

interface Route {
  path: string
  label: string
  icon: LucideIcon
}

const routes: Route[] = [
  {
    path: "/",
    label: "Pipeline de Agentes.",
    icon: Workflow
  },
  {
    path: "/brand-profiles",
    label: "Perfis de Marca.",
    icon: Building2
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

  const handleNavigate = (path: string) => {
    navigate(path)
    onNavigate?.()
  }

  return (
    <div
      className="flex flex-col h-full bg-card rounded-lg shadow-sm relative"
    >
      <div className={`${collapsed ? 'p-2' : 'p-6 pb-4'}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-center relative">
            {!collapsed && (
              <span className="text-lg text-foreground" style={{ fontFamily: 'var(--font-logo)' }}>copy.</span>
            )}
            {collapsed && (
              <span className="text-lg text-foreground" style={{ fontFamily: 'var(--font-logo)' }}>c.</span>
            )}
          </div>
        </div>
        {!collapsed && <div className="mt-4 mx-4"></div>}
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className={`space-y-1 ${collapsed ? 'px-2' : 'px-4'}`}>
          {routes.map((route) => {
            const IconComponent = route.icon
            const isActive = location.pathname === route.path
            return (
              <button
                key={route.path}
                onClick={() => handleNavigate(route.path)}
                className={`
                  flex items-center relative rounded-lg
                  ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-3'}
                  ${isActive 
                    ? 'w-full' 
                    : 'w-full text-foreground hover:bg-muted/50 rounded-lg'
                  }
                `}
                title={collapsed ? route.label : undefined}
              >
                <IconComponent 
                  size={20} 
                  className={`flex-shrink-0 ${!isActive ? 'text-muted-foreground' : ''}`} 
                />
                {!collapsed && (
                  <span className="text-sm overflow-hidden whitespace-nowrap">
                    {route.label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className={`space-y-1 ${collapsed ? 'p-2' : 'p-4'}`}>
  {!collapsed && (
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

        {collapsed && (
          <div className="px-2 py-2 mb-2 flex justify-center">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-muted-foreground" />
            </div>
          </div>
        )}
        <button 
          className={`flex items-center w-full transition-colors text-foreground hover:bg-muted rounded-lg ${
            collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
          }`}
          title={collapsed ? 'Configurações' : undefined}
        >
          <Settings size={20} className="flex-shrink-0 text-muted-foreground" />
          {!collapsed && (
            <span className="text-sm overflow-hidden whitespace-nowrap">
              Configurações
            </span>
          )}
        </button>
        <button 
          className={`flex items-center w-full transition-colors text-destructive hover:bg-muted rounded-lg ${
            collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
          }`}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm overflow-hidden whitespace-nowrap">
              Sair
            </span>
          )}
        </button>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex items-center w-full transition-colors text-foreground hover:bg-muted rounded-lg mt-2 ${
              collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
            }`}
            title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? (
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