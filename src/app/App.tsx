import { useCallback, useEffect, useState } from 'react'
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
import { Button, Icon } from '../shared/ui'
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
    setError('')
    window.history.pushState({}, '', paths[next]); setPage(next); setAuthMode(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function openAuth(mode: AuthMode) {
    window.history.pushState({}, '', mode === 'forgot' ? '/login' : mode === 'reset' ? '/reset-password' + window.location.hash : '/' + mode)
    setAuthMode(mode)
  }
  const closeAuth = useCallback(() => {
    setAuthMode(null); window.history.replaceState({}, '', paths[page] + (page === 'flashcards' ? window.location.search : ''))
  }, [page])
  async function logout() {
    try { await request('/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); setUser(null); navigate('home') }
    catch (error) { setError(error instanceof Error ? error.message : 'Odhlášení selhalo.') }
  }
  const protectedPage = page === 'profile' || page === 'flashcards' || page === 'leaderboard'
  return <div className={styles.app}>
    <SiteHeader page={page} onNavigate={navigate} onAuth={openAuth} authenticated={!!user} onLogout={logout} />
    <main id="main-content">
      {error && <p role="alert">{error}</p>}
      {loading ? <p role="status">Načítám účet…</p> : protectedPage && !user ? <section className={styles.authGate} aria-labelledby="auth-gate-title">
        <div className={styles.authPanel}>
          <div className={styles.authCopy}>
            <span className={styles.eyebrow}><Icon name="book" size={16} /> TVŮJ STUDIJNÍ PROSTOR</span>
            <h1 id="auth-gate-title">{page === 'flashcards' ? <>O kartičku blíž <span>k maturitě.</span></> : page === 'leaderboard' ? <>Každý bod tě posune <span>v žebříčku.</span></> : <>Tvůj pokrok <span>na jednom místě.</span></>}</h1>
            <p className={styles.authDescription}>Přihlas se a {page === 'flashcards' ? 'pusť se do procvičování. Vyber si maturitní okruh a uč se vlastním tempem.' : page === 'leaderboard' ? 'podívej se na žebříček studentů a zjisti, jak si vedeš.' : 'podívej se, co už umíš a na čem ještě zapracovat.'}</p>
            <ul className={styles.authBenefits}>
              <li><span><Icon name="book" size={18} /></span>Kartičky přehledně podle předmětů a okruhů</li>
              <li><span><Icon name="chart" size={18} /></span>Uložený pokrok po každém procvičování</li>
              <li><span><Icon name="target" size={18} /></span>Opakování toho, co ti ještě nejde</li>
            </ul>
            <div className={styles.authActions}>
              <Button onClick={() => openAuth('login')}>Přihlásit se <Icon name="arrow" size={18} /></Button>
              <Button variant="secondary" onClick={() => openAuth('register')}>Vytvořit účet</Button>
            </div>
            <p className={styles.authNote}><Icon name="shield" size={15} /> Tvůj pokrok zůstane uložený ve tvém účtu.</p>
          </div>
          <div className={styles.authPreview} aria-hidden="true">
            <span className={styles.previewLabel}><Icon name="target" size={16} /> MALÉ KROKY. VELKÝ POKROK.</span>
            <div className={styles.previewStack}>
              <div className={styles.previewCard}>
                <div className={styles.previewTop}><span>ČESKÝ JAZYK</span><span>01 / 12</span></div>
                <span className={styles.questionLabel}>OTÁZKA</span>
                <h2>Co je charakteristické pro romantismus?</h2>
                <p>Literatura · Literární směry</p>
                <div className={styles.previewAnswer}><Icon name="book" size={17} /> Každá odpověď tě posune dál.</div>
              </div>
            </div>
            <div className={styles.previewProgress}><span><Icon name="check" size={18} /></span><div><strong>Dnes o kousek dál.</strong><p>Jedna kartička za druhou.</p></div></div>
          </div>
        </div>
      </section> :
        page === 'home' ? <HomePage authenticated={!!user} onStart={() => user ? navigate('flashcards') : openAuth('register')} /> : page === 'contact' ? <ContactPage /> : page === 'flashcards' ? <StudyPage /> : <StatsPage key={page + (user?.id || "guest")} page={page} user={user} />}
    </main>
    <SiteFooter onNavigate={navigate} />
    {authMode && <AuthModal key={authMode} mode={authMode} onModeChange={openAuth} onClose={closeAuth} onAuthenticated={value => { setUser(value); setError('') }} />}
  </div>
}
