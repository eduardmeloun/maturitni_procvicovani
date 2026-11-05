import { useEffect, useRef, useState, type FormEvent } from 'react'
import { request } from '../../../lib/api'
import type { User } from '../../../lib/contracts'
import { Button, Icon, InputField } from '../../../shared/ui'
import type { AuthMode } from '../model/types'
import styles from './AuthModal.module.scss'

type Props = {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onClose: () => void
  onAuthenticated: (user: User) => void
}

export function AuthModal({ mode, onModeChange, onClose, onAuthenticated }: Props) {
  const dialog = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const isForgot = mode === 'forgot'
  const isReset = mode === 'reset'
  const isRegister = mode === 'register'

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const oldOverflow = document.body.style.overflow
    dialog.current?.querySelector<HTMLElement>('input, button')?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) onClose()
      if (event.key === 'Tab') {
        const elements = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href]') || [])
        const first = elements[0], last = elements[elements.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = oldOverflow
      previous?.focus()
    }
  }, [onClose, busy])


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const data = Object.fromEntries(new FormData(event.currentTarget))
    if ((isRegister || isReset) && data.password !== data.passwordConfirm) {
      setError('Zadaná hesla se neshodují.'); return
    }
    setBusy(true); setError('')
    try {
      const endpoint = isRegister ? 'register' : isForgot ? 'forgot-password' : isReset ? 'reset-password' : 'login'
      const token = new URLSearchParams(window.location.hash.slice(1)).get('token')
      const result = await request<User>(`/auth/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, token }),
      })
      if (isForgot || isReset) {
        setSubmitted(true)
        if (isReset) window.history.replaceState({}, '', '/login')
      } else { onAuthenticated(result); onClose() }
    } catch (error) { setError(error instanceof Error ? error.message : 'Požadavek selhal.') }
    finally { setBusy(false) }
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section ref={dialog} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className={styles.close} type="button" aria-label="Zavřít okno" onClick={onClose}>
          <Icon name="close" />
        </button>
        <span className={styles.icon}><Icon name="cap" size={25} /></span>
        <p className={styles.eyebrow}>Tak jdeme na to</p>
        <h2 id="auth-title">{isForgot || isReset ? 'Obnova hesla' : isRegister ? 'Vytvořit účet' : 'Vítej zpět!'}</h2>

        <div className={styles.tabs} role="tablist" aria-label="Přihlášení nebo registrace">
          <button role="tab" aria-selected={!isRegister} className={!isRegister ? styles.selected : ''} onClick={() => { onModeChange('login'); setSubmitted(false) }}>
            Přihlášení
          </button>
          <button role="tab" aria-selected={isRegister} className={isRegister ? styles.selected : ''} onClick={() => { onModeChange('register'); setSubmitted(false) }}>
            Registrace
          </button>
        </div>

        {submitted ? (
          <div className={styles.success} role="status">
            <span><Icon name="check" /></span>
            <strong>{isReset ? 'Heslo bylo změněno.' : 'Zkontroluj svou poštu.'}</strong>
            <p>{isReset ? 'Přihlas se novým heslem.' : 'Pokud účet existuje, obdržíš odkaz pro obnovu hesla.'}</p>
            <Button onClick={() => onModeChange('login')}>Zpět na přihlášení</Button>
          </div>
        ) : (
          <form key={mode} className={styles.form} onSubmit={handleSubmit}>
            {error && <p role="alert">{error}</p>}
            <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, display: "contents" }}>
            {isRegister && <InputField label="Uživatelské jméno" name="username" minLength={3} maxLength={32} pattern="[a-zA-Z0-9_.-]+" autoComplete="username" placeholder="Jak ti máme říkat?" required />}
            {!isReset && <InputField label={isRegister || isForgot ? 'E-mail' : 'E-mail nebo uživatelské jméno'} name={isRegister || isForgot ? 'email' : 'login'} type={isRegister || isForgot ? 'email' : 'text'} autoComplete={isForgot || isRegister ? 'email' : 'username'} required maxLength={254} />}
            {!isForgot && <InputField label="Heslo" name="password" type="password" autoComplete={isRegister || isReset ? 'new-password' : 'current-password'} placeholder="Alespoň 8 znaků" minLength={8} maxLength={128} required />}
            {(isRegister || isReset) && <InputField label="Heslo znovu" name="passwordConfirm" type="password" autoComplete="new-password" placeholder="Zopakuj své heslo" minLength={8} required onChange={(event) => event.currentTarget.setCustomValidity('')} />}
            {isRegister && <label className={styles.consent}><input type="checkbox" required /><span>Souhlasím s podmínkami používání.</span></label>}
            {!isRegister && !isForgot && !isReset && <button className={styles.forgot} type="button" onClick={() => onModeChange('forgot')}>Zapomněl/a jsi heslo?</button>}
            <Button type="submit" className={styles.submit}>
              {busy ? 'Odesílám…' : isForgot ? 'Poslat odkaz' : isReset ? 'Změnit heslo' : isRegister ? 'Vytvořit účet' : 'Přihlásit se'} <Icon name="arrow" size={18} />
            </Button>
            <p className={styles.disclaimer}><Icon name="shield" size={15} /> Tvoje údaje zůstávají v bezpečí.</p>
            </fieldset>
          </form>
        )}
      </section>
    </div>
  )
}