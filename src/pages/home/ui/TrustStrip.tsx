import { Icon } from '../../../shared/ui'
import styles from '../HomePage.module.scss'

const benefits = ['Obsah pro maturitní okruhy', 'Pokrok přehledně na jednom místě', 'Krátké učení, velký rozdíl']

export function TrustStrip() {
  return (
    <section className={styles.trustStrip} aria-label="Výhody aplikace">
      {benefits.map((benefit) => <div key={benefit}><Icon name="check" size={17} /> {benefit}</div>)}
    </section>
  )
}