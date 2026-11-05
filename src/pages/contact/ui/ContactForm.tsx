import { useState, type FormEvent } from 'react'
import { Button, Icon, InputField, TextareaField } from '../../../shared/ui'
import styles from '../ContactPage.module.scss'

export function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const name = String(data.get('name'))
    const senderEmail = String(data.get('email'))
    const message = String(data.get('message'))
    const subject = encodeURIComponent(`Zpráva z webu – ${name}`)
    const body = encodeURIComponent(`Od: ${name} (${senderEmail})\n\n${message}`)

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    setSent(true)
    form.reset()
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeading}>
        <span className={styles.formIcon}><Icon name="send" size={20} /></span>
        <div><h2>Napiš nám zprávu</h2><p>Chyba, nápad nebo jen ahoj? Sem s tím.</p></div>
      </div>
      {sent && (
        <div className={styles.notice} role="status">
          <Icon name="check" size={18} />
          <span>E-mailová aplikace by se měla otevřít s připravenou zprávou. Pokud ne, napiš nám přímo na <a href={`mailto:${email}`}>{email}</a>.</span>
          <button type="button" aria-label="Zavřít oznámení" onClick={() => setSent(false)}><Icon name="close" size={16} /></button>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputField label="Jméno" type="text" name="name" placeholder="Jak ti říkáme?" autoComplete="name" required />
        <InputField label="E-mail" type="email" name="email" placeholder="ty@skola.cz" autoComplete="email" required />
        <TextareaField label="Zpráva" name="message" placeholder="Napiš nám, co máš na srdci…" rows={5} minLength={10} required />
        <div className={styles.formBottom}>
          <span><Icon name="shield" size={16} /> E-mail použijeme jen pro odpověď.</span>
          <Button type="submit">Odeslat zprávu <Icon name="arrow" size={17} /></Button>
        </div>
      </form>
    </div>
  )
}