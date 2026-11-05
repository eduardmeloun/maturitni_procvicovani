import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
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
    } catch (error) { setError(error instanceof Error ? error.message : 'Uložení selhalo. Zopakuj pokus.') }
    finally { setBusy(false) }
  }
  return <section style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
    <h1>Procvičování kartiček</h1>
    {error && <p role="alert">{error}</p>}
    {loading && <p role="status">Načítám kartičky…</p>}
    <fieldset disabled={busy || !!pending}>
      <label>Předmět <select value={subject} onChange={e => change(e.target.value, '')}><option value="">Všechny</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      <label>Okruh <select value={topic} onChange={e => change(subject, e.target.value)}><option value="">Všechny</option>{topics.filter(t => !subject || t.subjectId === subject).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
      <label>Téma <select value={theme} onChange={e => { setTheme(e.target.value); setIndex(0); setFlipped(false); setAnswer('') }}><option value="">Všechna</option>{Array.from(new Set(cards.filter(c => (!topic || c.topicId === topic) && (!subject || topics.some(t => t.id === c.topicId && t.subjectId === subject))).map(c => c.theme))).map(t => <option key={t}>{t}</option>)}</select></label>
      <label>Stav <select value={filter} onChange={e => { setFilter(e.target.value); setIndex(0); setFlipped(false) }}><option value="">Všechny</option><option value="unseen">Nové</option><option value="known">Umím</option><option value="unknown">Neumím</option><option value="review">Zopakovat</option></select></label>
    </fieldset>
    {card ? <article><p>{index % visible.length + 1} / {visible.length} · {card.theme}</p><h2>{card.question}</h2>
      <label>Moje odpověď <textarea value={answer} onChange={e => setAnswer(e.target.value)} /></label>
      <button onClick={() => setFlipped(!flipped)}>{flipped ? 'Skrýt odpověď' : 'Otočit kartičku'}</button>
      {flipped && <p style={{ whiteSpace: 'pre-wrap' }}>{card.answer}</p>}
      {(['known','unknown','review'] as const).map((status, i) => <button disabled={busy || (!!pending && pending.status !== status)} key={status} onClick={() => save(status)}>{['Umím','Neumím','Zopakovat'][i]}</button>)}
      {pending && !busy && <p>Uložení se nepodařilo ověřit. Stejným tlačítkem pokus bezpečně zopakuješ.</p>}
    </article> : !loading && <p>Pro vybraný filtr nejsou žádné kartičky.</p>}
  </section>
}
