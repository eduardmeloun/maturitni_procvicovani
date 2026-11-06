
import { useState } from 'react';
import type { FormEvent } from 'react';

import './App.css';

type Mode = 'login' | 'register' | 'forgot';

function App() {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isLogin = mode === 'login';

  function changeMode(newMode: Mode) {
    setMode(newMode);
    setShowPassword(false);
    setPassword('');
    setConfirmPassword('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === 'register') {
      if (password !== confirmPassword) {
        alert('Hesla se neshodují.');
        return;
      }

      alert('Registrace zatím čeká na propojení s backendem.');
      return;
    }

    if (mode === 'forgot') {
      alert('Obnova hesla zatím čeká na propojení s backendem.');
      return;
    }

    alert('Přihlášení zatím čeká na propojení s backendem.');
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        <a className="brand" href="#">
          <span className="brand-icon">🎓</span>
          <span>
            Maturyta <strong>Formalyta</strong>
          </span>
        </a>

        <div className="auth-heading">
          <h1>
            {mode === 'login' && 'Vítej zpět!'}
            {mode === 'register' && 'Vytvoř si účet'}
            {mode === 'forgot' && 'Obnova hesla'}
          </h1>

          <p>
            {mode === 'login' && 'Přihlas se a pokračuj ve svém studiu.'}
            {mode === 'register' && 'Začni svou přípravu na maturitu.'}
            {mode === 'forgot' && 'Zadej e-mail pro obnovení hesla.'}
          </p>
        </div>

        {mode !== 'forgot' && (
          <div className="auth-tabs">
            <button
              type="button"
              className={isLogin ? 'active' : ''}
              onClick={() => changeMode('login')}
            >
              Přihlášení
            </button>

            <button
              type="button"
              className={!isLogin ? 'active' : ''}
              onClick={() => changeMode('register')}
            >
              Registrace
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          {mode === 'register' && (
            <label>
              Uživatelské jméno

              <input
                type="text"
                placeholder="Jak ti máme říkat?"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                minLength={3}
                maxLength={30}
                autoComplete="username"
                required
              />
            </label>
          )}

          <label>
            E-mailová adresa

            <input
              type="email"
              placeholder="například@email.cz"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          {mode !== 'forgot' && (
            <label>
              Heslo

              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Zadej své heslo"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  autoComplete={
                    isLogin ? 'current-password' : 'new-password'
                  }
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'
                  }
                >
                  {showPassword ? 'Skrýt' : 'Ukázat'}
                </button>
              </div>

              {mode === 'register' && (
                <span className="field-hint">
                  Minimálně 8 znaků.
                </span>
              )}
            </label>
          )}

          {mode === 'register' && (
            <label>
              Potvrzení hesla

              <input
                type="password"
                placeholder="Zopakuj heslo"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
          )}

          {mode === 'login' && (
            <button
              type="button"
              className="forgot-link"
              onClick={() => changeMode('forgot')}
            >
              Zapomněl/a jsi heslo?
            </button>
          )}

          <button type="submit" className="submit-btn">
            {mode === 'login' && 'Přihlásit se'}
            {mode === 'register' && 'Vytvořit účet'}
            {mode === 'forgot' && 'Odeslat odkaz pro obnovu'}
          </button>

        </form>

        <div className="auth-bottom">
          {mode === 'login' && (
            <>
              Nemáš ještě účet?
              <button
                type="button"
                onClick={() => changeMode('register')}
              >
                Zaregistruj se
              </button>
            </>
          )}

          {mode === 'register' && (
            <>
              Už máš účet?
              <button
                type="button"
                onClick={() => changeMode('login')}
              >
                Přihlas se
              </button>
            </>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => changeMode('login')}
            >
              Zpět na přihlášení
            </button>
          )}
        </div>

        <p className="security-note">
          🎓 Tvoje cesta k maturitě začíná právě tady.
        </p>

      </div>
    </main>
  );
}

export default App;
