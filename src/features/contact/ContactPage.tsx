import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { InputField, TextareaField } from '../../components/ui/FormField'
import { Icon } from '../../components/ui/Icon'
import styles from './ContactPage.module.scss'

const contactEmail = 'maturytaformalyta@spsemb.cz'

export function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const data = new FormData(form)
    const subject = encodeURIComponent(`Zpráva z webu – ${String(data.get('name'))}`)
    const body = encodeURIComponent(`Od: ${String(data.get('name'))} (${String(data.get('email'))})\n\n${String(data.get('message'))}`)
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
    setSent(true)
    form.reset()
  }

  return <div className={styles.page}>
    <section className={styles.hero}><div className={styles.heroInner}><span className={styles.eyebrow}>Jsme na příjmu</span><h1>Ozvi se nám.<br /><span>Fakt rádi.</span></h1><p>Máš nápad, našel/našla jsi chybu nebo ti chybí nějaké téma? Napiš nám — pomůžeš tím celé studijní partě.</p><div className={styles.breadcrumb}><span>Domů</span><Icon name="chevron" size={14} /><strong>Kontakty</strong></div><span className={styles.heroSpark}>✳</span></div></section>
    <section className={styles.content}>
      <div className={styles.infoColumn}><span className={styles.eyebrow}>Spojme se</span><h2>Jsme jen zprávu<br />daleko.</h2><p className={styles.intro}>Za aplikací stojí studenti, takže dobře víme, jaké to je ladit přípravu na maturitu. Každý tip si přečteme.</p>
        <a className={styles.contactCard} href={`mailto:${contactEmail}`}><span className={`${styles.contactIcon} ${styles.blue}`}><Icon name="mail" size={21} /></span><span><small>Napiš nám e-mail</small><strong>{contactEmail}</strong></span><Icon name="arrow" size={17} /></a>
        <div className={styles.contactCard}><span className={`${styles.contactIcon} ${styles.green}`}><Icon name="pin" size={21} /></span><span><small>Kde nás najdeš</small><strong>SPŠ Mladá Boleslav</strong></span><span className={styles.cardHint}>Studenti jako ty</span></div>
        <div className={styles.response}><span><Icon name="clock" size={19} /></span><p><strong>Odpovíme, jakmile to půjde.</strong><small>Obvykle během pár školních dnů.</small></p></div>
      </div>
      <div className={styles.formCard}><div className={styles.formHeading}><span className={styles.formIcon}><Icon name="send" size={20} /></span><div><h2>Napiš nám zprávu</h2><p>Chyba, nápad nebo jen ahoj? Sem s tím.</p></div></div>
        {sent && <div className={styles.notice} role="status"><Icon name="check" size={18} /><span>E-mailová aplikace by se měla otevřít s připravenou zprávou. Pokud ne, napiš nám přímo na <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</span><button type="button" aria-label="Zavřít oznámení" onClick={() => setSent(false)}><Icon name="close" size={16} /></button></div>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputField label="Jméno" type="text" name="name" placeholder="Jak ti říkáme?" autoComplete="name" required />
          <InputField label="E-mail" type="email" name="email" placeholder="ty@skola.cz" autoComplete="email" required />
          <TextareaField label="Zpráva" name="message" placeholder="Napiš nám, co máš na srdci…" rows={5} minLength={10} required />
          <div className={styles.formBottom}><span><Icon name="shield" size={16} /> E-mail použijeme jen pro odpověď.</span><Button type="submit">Odeslat zprávu <Icon name="arrow" size={17} /></Button></div>
        </form>
      </div>
    </section>
    <section className={styles.bottomNote}><Icon name="sparkle" size={18} /><p><strong>Každý nápad nás posouvá dál.</strong> Díky, že pomáháš dělat přípravu na maturitu o něco lepší.</p></section>
  </div>
}
