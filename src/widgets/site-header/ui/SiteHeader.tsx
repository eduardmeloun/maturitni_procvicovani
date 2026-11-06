import { useState } from 'react'
import type { AuthMode } from '../../../features/auth'
import { Brand, Button, Icon } from '../../../shared/ui'
import type { Page } from '../../../shared/config/navigation'
import styles from './SiteHeader.module.scss'

type Props = {
  authenticated: boolean
  onLogout: () => void
  page: Page
  onNavigate: (page: Page) => void
  onAuth: (mode: AuthMode) => void
}

export function SiteHeader({ page, onNavigate, onAuth, authenticated, onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  function goToContact() {
    setMenuOpen(false)
    onNavigate('contact')
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Brand onClick={(event) => { event.preventDefault(); onNavigate('home'); setMenuOpen(false) }} />
        <button className={styles.menuToggle} type="button" aria-label={menuOpen ? 'Zavřít navigaci' : 'Otevřít navigaci'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>
        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`} aria-label="Hlavní navigace">
          <button type="button" className={styles.navLink} onClick={() => { onNavigate('flashcards'); setMenuOpen(false) }}>Kartičky</button>
          <button type="button" className={styles.navLink} onClick={() => { onNavigate('leaderboard'); setMenuOpen(false) }}>Leaderboard</button>
          <button type="button" className={`${styles.navLink} ${page === 'contact' ? styles.active : ''}`} onClick={goToContact}>Kontakty</button>
          {authenticated && <button type="button" className={styles.navLink} onClick={() => { onNavigate('profile'); setMenuOpen(false) }}>Profil</button>}
          <div className={styles.actions}>
            {authenticated ? <Button variant="text" onClick={onLogout}>Odhlásit se</Button> : <>
            <Button variant="text" onClick={() => { onAuth('login'); setMenuOpen(false) }}>Přihlásit se</Button>
            <Button onClick={() => { onAuth('register'); setMenuOpen(false) }}>Vytvořit účet <Icon name="arrow" size={17} /></Button>
            </>}
          </div>
        </nav>
      </div>
    </header>
  )
}
