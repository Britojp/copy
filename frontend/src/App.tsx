import { useState, useEffect } from 'react'
import './App.css'
import AgentPipelinePage from './pages/AgentPipeline'
import BrandProfilesPage from './pages/BrandProfiles/BrandProfiles'
import CreateBrandProfilePage from './pages/BrandProfiles/CreateBrandProfile'
import { Route, Routes } from 'react-router-dom'
import { AppSidebar } from './components/common/blocks/app-sidebar'
import { Menu, X } from 'lucide-react'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  return (
    <div className="min-h-screen bg-background">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-[60] lg:hidden h-11 w-11 rounded-lg bg-card border border-border flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
        aria-label="Toggle menu"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <Menu 
            size={22} 
            className={`absolute transition-all duration-300 ${sidebarOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'} group-hover:text-primary`}
          />
          <X 
            size={22} 
            className={`absolute transition-all duration-300 ${sidebarOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'} group-hover:text-primary`}
          />
        </div>
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[50] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-[55]
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:w-16 w-64' : 'w-64'}
          lg:left-4 lg:top-4 lg:bottom-4
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <AppSidebar 
          collapsed={sidebarCollapsed}
          onNavigate={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      <main className={`min-h-screen bg-background transition-all duration-300 ${
        sidebarCollapsed 
          ? 'lg:ml-[calc(4rem+1rem)] lg:pt-4' 
          : 'lg:ml-[calc(16rem+1rem)] lg:pt-4'
      }`}>
        <Routes>
          <Route path="/" element={<AgentPipelinePage />} />
          <Route path="/agent-pipeline" element={<AgentPipelinePage />} />
          <Route path="/brand-profiles" element={<BrandProfilesPage />} />
          <Route path="/brand-profiles/create" element={<CreateBrandProfilePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
