import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// App-wide user state: my list, favorites, watch progress, history, profile,
// kids mode and toasts. Persisted to localStorage so it survives reloads.
// This is the seam where a real auth/session backend would plug in later.
// ---------------------------------------------------------------------------

const AppContext = createContext(null)

const KEY = 'mega-streaming:v1'

const DEFAULT_PROFILE = {
  name: 'Convidado',
  email: 'convidado@megastreaming.tv',
  initials: 'CV',
  plan: 'Premium',
}

const DEFAULT_STATE = {
  myList: [],
  favorites: [],
  progress: {}, // id -> { percent, position, duration, updatedAt, episode }
  history: [], // ids, most recent first
  profile: DEFAULT_PROFILE,
  profiles: [DEFAULT_PROFILE, { name: 'Infantil', initials: 'IN', kid: true }],
  activeProfile: 0,
  kidsMode: false,
  parentalPin: '1234',
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(load)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable — state stays in memory */
    }
  }, [state])

  const notify = useCallback((message, tone = 'default') => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const toggleList = useCallback((id, title) => {
    setState((s) => {
      const has = s.myList.includes(id)
      notify(has ? `Removido da Minha Lista${title ? `: ${title}` : ''}` : `Adicionado à Minha Lista${title ? `: ${title}` : ''}`)
      return { ...s, myList: has ? s.myList.filter((x) => x !== id) : [id, ...s.myList] }
    })
  }, [notify])

  const toggleFavorite = useCallback((id, title) => {
    setState((s) => {
      const has = s.favorites.includes(id)
      notify(has ? `Removido dos Favoritos${title ? `: ${title}` : ''}` : `Adicionado aos Favoritos${title ? `: ${title}` : ''}`, 'heart')
      return { ...s, favorites: has ? s.favorites.filter((x) => x !== id) : [id, ...s.favorites] }
    })
  }, [notify])

  const saveProgress = useCallback((id, data) => {
    setState((s) => ({
      ...s,
      progress: { ...s.progress, [id]: { ...data, updatedAt: Date.now() } },
      history: [id, ...s.history.filter((x) => x !== id)].slice(0, 40),
    }))
  }, [])

  const clearHistory = useCallback(() => {
    setState((s) => ({ ...s, history: [], progress: {} }))
    notify('Histórico limpo')
  }, [notify])

  const setKidsMode = useCallback((on) => {
    setState((s) => ({ ...s, kidsMode: on }))
  }, [])

  const setActiveProfile = useCallback((index) => {
    setState((s) => ({ ...s, activeProfile: index }))
  }, [])

  const updateProfile = useCallback((patch) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }))
  }, [])

  const value = useMemo(() => ({
    ...state,
    toasts,
    notify,
    toggleList,
    toggleFavorite,
    saveProgress,
    clearHistory,
    setKidsMode,
    setActiveProfile,
    updateProfile,
    isInList: (id) => state.myList.includes(id),
    isFavorite: (id) => state.favorites.includes(id),
    progressOf: (id) => state.progress[id] || null,
  }), [state, toasts, notify, toggleList, toggleFavorite, saveProgress, clearHistory, setKidsMode, setActiveProfile, updateProfile])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
