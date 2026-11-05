import { useEffect, useState, type FormEvent } from 'react'
import { Button, Icon, InputField } from '../../../shared/ui'
import type { AuthMode } from '../model/types'
import styles from './AuthModal.module.scss'

type Props = {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onClose: () => void
}

export function AuthModal({ mode, onModeChange, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const isRegister = mode === 'register'

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (isRegister && formData.get('password') !== formData.get('passwordConfirm')) {
      const confirmation = event.currentTarget.elements.namedItem('passwordConfirm')
      if (confirmation instanceof HTMLInputElement) {
        confirmation.setCustomValidity('Zadaná hesla se neshodují.')
        confirmation.reportValidity()
      }
      return
    }

    setSubmitted(true)
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className={styles.close} type="button" aria-label="Zavřít okno" onClick={onClose}>
          <Icon name="close" />
        </button>
        <span className={styles.icon}><Icon name="cap" size={25} /></span>
        <p className={styles.eyebrow}>Tak jdeme na to</p>
        <h2 id="auth-title">{isRegister ? 'Tvůj maturitní parťák čeká.' : 'Vítej zpět!'}</h2>
        <p className={styles.subtitle}>
          {isRegister ? 'Vytvoř si účet a začni se připravovat.' : 'Přihlas se a pokračuj přesně tam, kde jsi skončil.'}
        </p>

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
            <strong>Formulář je vyzkoušený.</strong>
            <p>Ukázkový formulář zatím není napojený na uživatelské účty.</p>
            <Button onClick={onClose}>Rozumím</Button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {isRegister && <InputField label="Uživatelské jméno" name="username" autoComplete="username" placeholder="Jak ti máme říkat?" required />}
            <InputField label="E-mail" name="email" type="email" autoComplete="email" placeholder="ty@skola.cz" required />
            <InputField label="Heslo" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="Alespoň 8 znaků" minLength={8} required />
            {isRegister && <InputField label="Heslo znovu" name="passwordConfirm" type="password" autoComplete="new-password" placeholder="Zopakuj své heslo" minLength={8} required onChange={(event) => event.currentTarget.setCustomValidity('')} />}
            {isRegister && <label className={styles.consent}><input type="checkbox" required /><span>Souhlasím s podmínkami používání.</span></label>}
            {!isRegister && <button className={styles.forgot} type="button" onClick={() => window.alert('Obnova hesla bude dostupná po napojení účtů.')}>Zapomněl/a jsi heslo?</button>}
            <Button type="submit" className={styles.submit}>
              {isRegister ? 'Vytvořit účet' : 'Přihlásit se'} <Icon name="arrow" size={18} />
            </Button>
            <p className={styles.disclaimer}><Icon name="shield" size={15} /> Tvoje údaje zůstávají v bezpečí.</p>
          </form>
        )}
      </section>
    </div>
  )
}