import { Button, Icon } from '../../../shared/ui'
import styles from '../HomePage.module.scss'

export function CallToActionSection({ onStart }: { onStart: () => void }) {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaIcon}><Icon name="cap" size={27} /></div>
      <span className={styles.eyebrow}>Začni klidně hned</span>
      <h2>Maturita je velká věc.<br /><span>Příprava nemusí být.</span></h2>
      <p>Dej si první kartičku a uvidíš, že to půjde.</p>
      <Button onClick={onStart}>Jdu do toho <Icon name="arrow" size={18} /></Button>
      <span className={styles.ctaStar}>✦</span><span className={styles.ctaDot} />
    </section>
  )
}