import { Icon } from '../../shared/ui'
import { ContactForm } from './ui/ContactForm'
import { ContactInfo } from './ui/ContactInfo'
import styles from './ContactPage.module.scss'

const contactEmail = 'maturytaformalyta@spsemb.cz'

export function ContactPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Jsme na příjmu</span>
          <h1>Ozvi se nám.<br /><span>Fakt rádi.</span></h1>
          <p>Máš nápad, našel/našla jsi chybu nebo ti chybí nějaké téma? Napiš nám — pomůžeš tím celé studijní partě.</p>
          <div className={styles.breadcrumb}><span>Domů</span><Icon name="chevron" size={14} /><strong>Kontakty</strong></div>
          <span className={styles.heroSpark}>✳</span>
        </div>
      </section>
      <section className={styles.content}>
        <ContactInfo email={contactEmail} />
        <ContactForm email={contactEmail} />
      </section>
      <section className={styles.bottomNote}>
        <Icon name="sparkle" size={18} />
        <p><strong>Každý nápad nás posouvá dál.</strong> Díky, že pomáháš dělat přípravu na maturitu o něco lepší.</p>
      </section>
    </div>
  )
}