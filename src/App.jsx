import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import TopNav from './components/layout/TopNav.jsx'
import SideRail from './components/layout/SideRail.jsx'
import Toasts from './components/Toasts.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import TitleDetail from './pages/TitleDetail.jsx'
import Watch from './pages/Watch.jsx'
import Live from './pages/Live.jsx'
import LiveChannel from './pages/LiveChannel.jsx'
import Search from './pages/Search.jsx'
import MyList from './pages/MyList.jsx'
import Plans from './pages/Plans.jsx'
import Kids from './pages/Kids.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import Placeholder from './pages/Placeholder.jsx'

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-full flex-col bg-ink-950">
        <TopNav />
        <div className="flex flex-1">
          <SideRail />
          <main className="min-w-0 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/filmes" element={<Browse kind="filmes" />} />
              <Route path="/series" element={<Browse kind="series" />} />
              <Route path="/documentarios" element={<Browse kind="documentarios" />} />
              <Route path="/shows" element={<Browse kind="shows" />} />
              <Route path="/musica" element={<Browse kind="musica" />} />
              <Route path="/gospel" element={<Browse kind="gospel" />} />
              <Route path="/noticias" element={<Browse kind="noticias" />} />
              <Route path="/esportes" element={<Browse kind="esportes" />} />
              <Route path="/catalogo/:rowId" element={<Browse />} />

              <Route path="/infantil" element={<Kids />} />

              <Route path="/ao-vivo" element={<Live />} />
              <Route path="/canais" element={<Live />} />
              <Route path="/ao-vivo/:id" element={<LiveChannel />} />

              <Route path="/titulo/:id" element={<TitleDetail />} />
              <Route path="/assistir/:id" element={<Watch />} />

              <Route path="/busca" element={<Search />} />
              <Route path="/minha-lista" element={<MyList />} />
              <Route path="/favoritos" element={<MyList initialTab="favorites" />} />

              <Route path="/planos" element={<Plans />} />
              <Route path="/perfil" element={<Profile />} />

              <Route path="/admin" element={<Admin />} />

              <Route path="*" element={<Placeholder />} />
            </Routes>
          </main>
        </div>
        <Toasts />
      </div>
    </AppProvider>
  )
}
