import { useState } from 'react'
import { Brand } from './Brand'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import type { AuthMode } from './AuthModal'
import styles from './SiteHeader.module.scss'

type Page = 'home' | 'contact'
type Props = { page: Page; onNavigate: (page: Page) => void; onAuth: (mode: AuthMode) => void }

export function SiteHeader({ page, onNavigate, onAuth }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  function goToSection(id: string) {
    setMenuOpen(false)
    if (page !== 'home') {
      onNavigate('home')
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function goToContact() {
    setMenuOpen(false)
    onNavigate('contact')
  }

  return <header className={styles.header}>
    <div className={styles.inner}>
      <Brand onClick={(event) => { event?.preventDefault(); onNavigate('home'); setMenuOpen(false) }} />
      <button className={styles.menuToggle} type="button" aria-label={menuOpen ? 'Zavřít navigaci' : 'Otevřít navigaci'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`} aria-label="Hlavní navigace">
        <button type="button" className={styles.navLink} onClick={() => goToSection('flashcards')}>Kartičky</button>
        <button type="button" className={styles.navLink} onClick={() => goToSection('leaderboard')}>Leaderboard</button>
        <button type="button" className={`${styles.navLink} ${page === 'contact' ? styles.active : ''}`} onClick={goToContact}>Kontakty</button>
        <div className={styles.actions}>
          <Button variant="text" onClick={() => { onAuth('login'); setMenuOpen(false) }}>Přihlásit se</Button>
          <Button onClick={() => { onAuth('register'); setMenuOpen(false) }}>Vytvořit účet <Icon name="arrow" size={17} /></Button>
        </div>
      </nav>
    </div>
  </header>
}
