import { useEffect, useState } from 'react'
import { AuthModal, type AuthMode } from '../features/auth'
import { ContactPage } from '../pages/contact'
import { HomePage } from '../pages/home'
import { SiteFooter } from '../widgets/site-footer'
import { SiteHeader } from '../widgets/site-header'
import type { Page } from '../shared/config/navigation'
import { api, ApiError, request } from '../lib/api'
import type { User } from '../lib/contracts'
import { StudyPage } from '../features/study/StudyPage'
import { StatsPage } from '../features/stats/StatsPage'
import styles from './App.module.scss'
const paths: Record<Page, string> = { home: '/', contact: '/kontakty', profile: '/profile', leaderboard: '/leaderboard', flashcards: '/flashcards' }
const currentPage = (): Page => (Object.keys(paths) as Page[]).find(key => paths[key] === window.location.pathname) || 'home'
const currentAuth = (): AuthMode | null => ({ '/login': 'login', '/register': 'register', '/reset-password': 'reset' } as Record<string, AuthMode>)[window.location.pathname] || null
export default function App() {
  const [page, setPage] = useState<Page>(currentPage)
  const [authMode, setAuthMode] = useState<AuthMode | null>(currentAuth)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    api.me().then(value => { if (active) setUser(value) }).catch(error => {
      if (active && !(error instanceof ApiError && error.status === 401)) setError(error.message)
    }).finally(() => { if (active) setLoading(false) })
    const pop = () => { setPage(currentPage()); setAuthMode(currentAuth()) }
    const expired = () => { setUser(null); setAuthMode('login') }
    window.addEventListener('popstate', pop)
    window.addEventListener('session-expired', expired)
    return () => { active = false; window.removeEventListener('popstate', pop); window.removeEventListener('session-expired', expired) }
  }, [])
  function navigate(next: Page) {
    window.history.pushState({}, '', paths[next]); setPage(next); setAuthMode(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function openAuth(mode: AuthMode) {
    window.history.pushState({}, '', mode === 'forgot' ? '/login' : mode === 'reset' ? '/reset-password' + window.location.hash : '/' + mode)
    setAuthMode(mode)
  }
  function closeAuth() {
    setAuthMode(null); window.history.replaceState({}, '', paths[page])
  }
  async function logout() {
    try { await request('/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); setUser(null); navigate('home') }
    catch (error) { setError(error instanceof Error ? error.message : 'Odhlášení selhalo.') }
  }
  const protectedPage = page === 'profile' || page === 'flashcards'
  return <div className={styles.app}>
    <SiteHeader page={page} onNavigate={navigate} onAuth={openAuth} authenticated={!!user} onLogout={logout} />
    <main id="main-content">
      {error && <p role="alert">{error}</p>}
      {loading ? <p role="status">Načítám účet…</p> : protectedPage && !user ? <section><h1>Přihlášení je potřeba</h1><button onClick={() => openAuth('login')}>Přihlásit se</button></section> :
        page === 'home' ? <HomePage onAuth={openAuth} /> : page === 'contact' ? <ContactPage /> : page === 'flashcards' ? <StudyPage /> : <StatsPage key={page + (user?.id || "guest")} page={page} user={user} />}
    </main>
    <SiteFooter onNavigate={navigate} />
    {authMode && <AuthModal key={authMode} mode={authMode} onModeChange={openAuth} onClose={closeAuth} onAuthenticated={setUser} />}
  </div>
}
