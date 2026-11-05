import { useEffect, useState } from 'react'
import { AuthModal, type AuthMode } from '../features/auth'
import { ContactPage } from '../pages/contact'
import { HomePage } from '../pages/home'
import { SiteFooter } from '../widgets/site-footer'
import { SiteHeader } from '../widgets/site-header'
import type { Page } from '../shared/config/navigation'
import styles from './App.module.scss'

function pageFromPath(path: string): Page {
  return path.replace(/\/$/, '').endsWith('/kontakty') ? 'contact' : 'home'
}

export default function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname))
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)

  useEffect(() => {
    function handlePopState() {
      setPage(pageFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextPage: Page) {
    const path = nextPage === 'contact' ? '/kontakty' : '/'
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }

    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.app}>
      <SiteHeader page={page} onNavigate={navigate} onAuth={setAuthMode} />
      <main id="main-content">
        {page === 'home' ? <HomePage onAuth={setAuthMode} /> : <ContactPage />}
      </main>
      <SiteFooter onNavigate={navigate} />
      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
        />
      )}
    </div>
  )
}