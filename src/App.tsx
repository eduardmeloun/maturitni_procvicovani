import { useEffect, useState } from 'react'
import { api } from './lib/api'
import type { Subject } from './lib/contracts'
import { ProfileView } from './features/stats/ProfileView'
import { LeaderboardView } from './features/stats/LeaderboardView'
import './App.css'

const sections = [
  ['/', 'Přehled'],
  ['/karticky', 'Kartičky'],
  ['/profil', 'Profil'],
  ['/zebricek', 'Žebříček'],
  ['/kontakty', 'Kontakty'],
  ['/ucet', 'Přihlášení'],
]

const modules: Record<string, string> = {
  '/karticky': 'Výběr okruhu a procvičování: api.cards() a api.saveProgress().',
  '/kontakty': 'Prostor pro kontaktní údaje a formulář. Odesílání doplní autor veřejných stránek.',
  '/ucet': 'Prostor pro přihlášení, registraci a obnovu hesla. Tabulky uživatelů a relací jsou připravené.',
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [status, setStatus] = useState('Ověřuji spojení…')
  const [error, setError] = useState('')

  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([api.health(), api.subjects()])
      .then(([, items]) => {
        if (active) {
          setSubjects(items)
          setStatus('Server i databáze jsou připojené')
        }
      })
      .catch((error: Error) => {
        if (active) {
          setError(error.message)
          setStatus('Spojení se nezdařilo')
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <header>
        <a className="brand" href="/">
          Maturyta <span>Formalyta</span>
        </a>
        <nav aria-label="Hlavní navigace">
          {sections.map(([href, label]) => (
            <a
              key={href}
              href={href}
              aria-current={path === href ? 'page' : undefined}
              onClick={(event) => {
                if (
                  event.button !== 0 ||
                  event.ctrlKey ||
                  event.metaKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return
                event.preventDefault()
                window.history.pushState({}, '', href)
                setPath(href)
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        {path === '/' && (
          <>
            <p className="eyebrow">ZÁKLAD APLIKACE · TÝMOVÝ VÝVOJ</p>
            <h1>Společný základ pro přípravu k maturitě.</h1>
            <p className="intro">
              Předměty, učební kartičky a uložený pokrok na jednom místě. Vývojová kostra pro propojení týmových částí.
            </p>
            <section className="connection" aria-live="polite">
              <strong>{status}</strong>
              {error && <p role="alert">{error} Spusť obě části pomocí npm run dev.</p>}
            </section>
            <section aria-labelledby="subjects">
              <h2 id="subjects">Maturitní předměty</h2>
              <div className="grid">
                {subjects.map((subject) => (
                  <article className="panel" key={subject.id}>
                    <p className="eyebrow">IT · MATURITA</p>
                    <h3>{subject.name}</h3>
                    <p>Připraveno pro připojení okruhů a kartiček.</p>
                  </article>
                ))}
              </div>
              {!error && subjects.length === 0 && (
                <p>Pro ukázkový obsah spusť npm run db:seed a obnov stránku.</p>
              )}
            </section>
          </>
        )}

        {path === '/profil' && <ProfileView />}

        {path === '/zebricek' && <LeaderboardView />}

        {path !== '/' && path !== '/profil' && path !== '/zebricek' && (
          <>
            <p className="eyebrow">ZÁKLAD APLIKACE · TÝMOVÝ VÝVOJ</p>
            <h1>{sections.find(([href]) => href === path)?.[1] || 'Stránka nenalezena'}</h1>
            <section className="panel">
              <p>{modules[path] || 'Vrať se na přehled pomocí navigace.'}</p>
            </section>
          </>
        )}
      </main>

      <footer>Maturyta Formalyta · SPŠ Mladá Boleslav · Týmový projekt</footer>
    </>
  )
}