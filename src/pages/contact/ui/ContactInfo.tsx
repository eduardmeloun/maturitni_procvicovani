import { Icon } from '../../../shared/ui'
import styles from '../ContactPage.module.scss'

export function ContactInfo({ email }: { email: string }) {
  return (
    <div className={styles.infoColumn}>
      <span className={styles.eyebrow}>Spojme se</span>
      <h2>Jsme jen zprávu<br />daleko.</h2>
      <p className={styles.intro}>Za aplikací stojí studenti, takže dobře víme, jaké to je ladit přípravu na maturitu. Každý tip si přečteme.</p>
      <a className={styles.contactCard} href={`mailto:${email}`}>
        <span className={`${styles.contactIcon} ${styles.blue}`}><Icon name="mail" size={21} /></span>
        <span><small>Napiš nám e-mail</small><strong>{email}</strong></span>
        <Icon name="arrow" size={17} />
      </a>
      <div className={styles.contactCard}>
        <span className={`${styles.contactIcon} ${styles.green}`}><Icon name="pin" size={21} /></span>
        <span><small>Kde nás najdeš</small><strong>SPŠ Mladá Boleslav</strong></span>
        <span className={styles.cardHint}>Studenti jako ty</span>
      </div>
      <div className={styles.response}>
        <span><Icon name="clock" size={19} /></span>
        <p><strong>Odpovíme, jakmile to půjde.</strong><small>Obvykle během pár školních dnů.</small></p>
      </div>
    </div>
  )
}