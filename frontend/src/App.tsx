import { useState, useEffect } from 'react'
import './App.css'
import AgentPipelinePage from './pages/AgentPipeline'
import BrandProfilesPage from './pages/BrandProfiles/BrandProfiles'
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
        className="fixed left-4 top-4 z-[60] lg:hidden h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-sm"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
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
          <Route path="/brand-profiles" element={<BrandProfilesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
