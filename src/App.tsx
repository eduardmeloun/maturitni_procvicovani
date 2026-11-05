import { useEffect, useState } from 'react'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { AuthModal, type AuthMode } from './components/layout/AuthModal'
import { ContactPage } from './features/contact/ContactPage'
import { HomePage } from './features/home/HomePage'
import styles from './App.module.scss'

type Page = 'home' | 'contact'

function pageFromPath(path: string): Page {
  return path.replace(/\/$/, '').endsWith('/kontakty') ? 'contact' : 'home'
}

export default function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname))
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)

  useEffect(() => {
    const handlePopState = () => setPage(pageFromPath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextPage: Page) {
    const path = nextPage === 'contact' ? '/kontakty' : '/'
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.app}>
      <SiteHeader page={page} onNavigate={navigate} onAuth={setAuthMode} />
      <main id="main-content">
        {page === 'home' ? (
          <HomePage onAuth={setAuthMode} />
        ) : (
          <ContactPage />
        )}
      </main>
      <SiteFooter onNavigate={navigate} />
      {authMode && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} />}
    </div>
  )
}
