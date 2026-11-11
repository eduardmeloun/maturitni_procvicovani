import { useEffect, useState } from 'react'
import { Button, Icon } from '../../shared/ui'
import styles from './StudyPage.module.scss'
import { api, ApiError } from '../../lib/api'
import type { Card, Subject, Topic, StudyStatus, SaveProgressInput } from '../../lib/contracts'
export function StudyPage() {
  const query = new URLSearchParams(window.location.search)
  const [subject, setSubject] = useState(query.get('predmet') || '')
  const [topic, setTopic] = useState(query.get('okruh') || '')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [theme, setTheme] = useState('')
  const [answer, setAnswer] = useState('')
  const [filter, setFilter] = useState('')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState<SaveProgressInput | null>(null)
  useEffect(() => {
    let active = true
    Promise.all([api.subjects(), api.topics(), api.cards()]).then(([s,t,c]) => {
      if (active) { setSubjects(s); setTopics(t); setCards(c) }
    }).catch(error => { if (active) setError(error.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const visible = cards.filter(card => (!subject || topics.some(t => t.id === card.topicId && t.subjectId === subject)) && (!topic || card.topicId === topic) && (!theme || card.theme === theme) && (!filter || card.status === filter))
  const card = visible[index % (visible.length || 1)]
  function change(nextSubject: string, nextTopic: string) {
    setSubject(nextSubject); setTopic(nextTopic); setTheme(''); setAnswer(''); setIndex(0); setFlipped(false)
    const params = new URLSearchParams()
    if (nextSubject) params.set('predmet', nextSubject)
    if (nextTopic) params.set('okruh', nextTopic)
    window.history.replaceState({}, '', '/flashcards?' + params)
  }
  async function save(status: StudyStatus) {
    if (!card || busy) return
    const input = pending || { attemptId: crypto.randomUUID(), cardId: card.id, status }
    setBusy(true); setError(''); setPending(input)
    try {
      await api.saveProgress(input)
      const refreshed = await api.cards()
      setCards(refreshed); setPending(null); setFlipped(false); setAnswer('')
      setIndex(i => filter ? 0 : i + 1)
    } catch (error) {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) setPending(null)
      setError(error instanceof Error ? error.message : 'Uložení selhalo. Zopakuj pokus.')
    }
    finally { setBusy(false) }
  }
  const scopedCards = cards.filter(c => (!subject || topics.some(t => t.id === c.topicId && t.subjectId === subject)) && (!topic || c.topicId === topic) && (!theme || c.theme === theme))
  const knownCount = scopedCards.filter(c => c.status === 'known').length
  const progress = scopedCards.length ? Math.round(knownCount / scopedCards.length * 100) : 0
  const currentTopic = topics.find(t => t.id === card?.topicId)
  const currentSubject = subjects.find(s => s.id === currentTopic?.subjectId)
  return <section className={styles.page}>
    <div className={styles.container}>
      <div className={styles.heading}>
        <div><span className={styles.eyebrow}><Icon name="book" size={16} /> TVŮJ STUDIJNÍ PROSTOR</span>
          <h1>O kartičku blíž <span>k maturitě.</span></h1>
          <p>Vyber si okruh, zkus odpovědět a posuň se zase o kousek dál.</p>
        </div>
        <div className={styles.total}><span className={styles.totalIcon}><Icon name="check" size={22} /></span><div><strong>{knownCount} <small>/ {scopedCards.length}</small></strong><span>kartiček už umíš</span></div></div>
      </div>
      {error && <div className={styles.error} role="alert">{error}{!cards.length && <Button variant="text" onClick={() => window.location.reload()}>Zkusit znovu</Button>}</div>}
      <fieldset className={styles.filters} disabled={loading || busy || !!pending}>
        <legend className={styles.srOnly}>Výběr kartiček</legend>
        <label>Předmět <div className={styles.select}><select value={subject} onChange={e => change(e.target.value, '')}><option value="">Všechny předměty</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><Icon name="chevron" size={16} /></div></label>
        <label>Maturitní okruh <div className={styles.select}><select value={topic} onChange={e => change(subject, e.target.value)}><option value="">Všechny okruhy</option>{topics.filter(t => !subject || t.subjectId === subject).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select><Icon name="chevron" size={16} /></div></label>
        <label>Téma <div className={styles.select}><select value={theme} onChange={e => { setTheme(e.target.value); setIndex(0); setFlipped(false); setAnswer('') }}><option value="">Všechna témata</option>{Array.from(new Set(cards.filter(c => (!topic || c.topicId === topic) && (!subject || topics.some(t => t.id === c.topicId && t.subjectId === subject))).map(c => c.theme))).map(t => <option key={t}>{t}</option>)}</select><Icon name="chevron" size={16} /></div></label>
        <label>Zobrazit <div className={styles.select}><select value={filter} onChange={e => { setFilter(e.target.value); setIndex(0); setFlipped(false); setAnswer('') }}><option value="">Všechny kartičky</option><option value="unseen">Nové</option><option value="known">Umím</option><option value="unknown">Neumím</option><option value="review">Zopakovat</option></select><Icon name="chevron" size={16} /></div></label>
      </fieldset>
      <div className={styles.workspace}>
        <div className={styles.study}>
          <div className={styles.studyHeading}><span><Icon name="book" size={17} /> Procvičování</span><span>{loading ? 'Načítání…' : `${visible.length} kartiček ve výběru`}</span></div>
          {loading ? <div className={styles.empty} role="status"><Icon name="clock" size={32} /><h2>Připravujeme kartičky…</h2><p>Za chvilku můžeš začít.</p></div> : card ? <>
            <article className={styles.card}>
              <div className={styles.cardTop}><span className={styles.subject}>{currentSubject?.name || 'Procvičování'}</span><span className={styles.counter}><strong>{String(index % visible.length + 1).padStart(2, '0')}</strong> / {String(visible.length).padStart(2, '0')}</span></div>
              <div className={styles.cardBody}><span className={styles.questionLabel}>OTÁZKA</span><h2>{card.question}</h2><p className={styles.topic}>{currentTopic?.name} · {card.theme}</p></div>
              <div className={styles.answerInput}><label htmlFor="study-answer">Zkus to vlastními slovy <span>nepovinné</span></label><textarea id="study-answer" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Co si vybavuješ? Napiš si sem svou odpověď…" rows={3} /></div>
              <div className={styles.reveal}><span><Icon name="target" size={17} /> Nejdřív se zkus zamyslet.</span><Button variant={flipped ? 'secondary' : 'primary'} aria-expanded={flipped} aria-controls="study-solution" onClick={() => setFlipped(!flipped)}><Icon name="book" size={17} />{flipped ? 'Skrýt odpověď' : 'Ukázat odpověď'}</Button></div>
              {flipped && <div id="study-solution" className={styles.solution}><span className={styles.questionLabel}>ODPOVĚĎ</span><p>{card.answer}</p></div>}
            </article>
            <div className={styles.rating}><div className={styles.ratingHeading}><strong>Jak ti to šlo?</strong><span>Ohodnoť se a pokračuj další kartičkou.</span></div><div className={styles.ratingButtons}>
              {(['unknown','review','known'] as const).map((status, i) => <button className={styles[status]} disabled={busy || (!!pending && pending.status !== status)} key={status} onClick={() => save(status)}><Icon name={(['close','clock','check'] as const)[i]} size={20} /><span>{['Ještě neumím','Zopakovat','Tohle umím'][i]}</span><Icon name="arrow" size={16} /></button>)}
            </div>{busy && <p className={styles.saveStatus} role="status">Ukládám tvůj výsledek…</p>}{pending && !busy && <p className={styles.error}>Uložení se nepodařilo ověřit. Stejným tlačítkem pokus bezpečně zopakuješ.</p>}</div>
          </> : <div className={styles.empty}><Icon name="book" size={36} /><h2>Tady je zatím prázdno.</h2><p>Zkus vybrat jiný okruh nebo změnit filtr kartiček.</p></div>}
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.progressCard}><span className={styles.sideIcon}><Icon name="chart" size={22} /></span><h2>Každý krok se počítá.</h2><p>Tvůj pokrok ve vybraných tématech.</p><div className={styles.progressNumbers}><strong>{progress}<small> %</small></strong><span>zvládnuto</span></div><div className={styles.progressBar} role="progressbar" aria-label="Zvládnuté kartičky" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div><div className={styles.progressLegend}><span><i />Umím</span><strong>{knownCount} z {scopedCards.length}</strong></div></div>
          <div className={styles.tip}><span className={styles.tipIcon}><Icon name="book" size={20} /></span><h3>Malý tip, velký rozdíl</h3><p>Zkus si odpověď říct nahlas ještě před otočením kartičky. Lépe si ji zapamatuješ.</p></div>
          <p className={styles.saved}><Icon name="shield" size={16} /> Tvůj pokrok se ukládá do účtu.</p>
        </aside>
      </div>
    </div>
  </section>
}
