import { Brand, Icon } from '../../../shared/ui'
import type { Page } from '../../../shared/config/navigation'
import styles from './SiteFooter.module.scss'

const currentYear = new Date().getFullYear()

type Props = { onNavigate: (page: Page) => void }

export function SiteFooter({ onNavigate }: Props) {
  function goToFlashcards() {
    onNavigate('home')
    window.setTimeout(() => document.getElementById('flashcards')?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.identity}>
          <Brand onClick={(event) => { event.preventDefault(); onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
          <p>Malé kroky každý den. Velký klid u maturity.</p>
        </div>
        <div className={styles.links}>
          <span className={styles.label}>Rychlé odkazy</span>
          <button type="button" onClick={goToFlashcards}>Jak to funguje</button>
          <button type="button" onClick={() => onNavigate('contact')}>Kontakty</button>
        </div>
        <div className={styles.note}>
          <span className={styles.noteIcon}><Icon name="sparkle" size={18} /></span>
          <span>Vytvořeno studenty,<br />pro studenty.</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {currentYear} Maturyta Formalyta</span>
        <span>Držíme palce u maturity <span aria-label="srdce" className={styles.heart}>♥</span></span>
      </div>
    </footer>
  )
}