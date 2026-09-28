import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Watch from './pages/Watch.jsx'
import Placeholder from './pages/Placeholder.jsx'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-full flex-col">
      <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
      <div className="flex min-h-0 flex-1">
        <Sidebar open={sidebarOpen} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/em-alta" element={<Home onlyTrending />} />
            <Route path="/inscricoes" element={<Placeholder title="Inscrições" />} />
            <Route path="/biblioteca" element={<Placeholder title="Biblioteca" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
