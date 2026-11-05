
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'
import networkQuestions from '../../../server/seeds/study-questions.json'
import type { Card, Subject, Topic, StudyStatus } from '../../lib/contracts'

type FilterStatus = Card['status'] | 'all'

const statusLabels: Record<Card['status'], string> = {
  unseen: 'Neprobrané',
  known: 'Umím',
  unknown: 'Neumím',
  review: 'Zopakovat',
}

export default function Study() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [cards, setCards] = useState<Card[]>([])
  // Pouze vývojový náhled: /karticky?preview=1
  const preview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === '1'

  const [subjectId, setSubjectId] = useState('')
  const [topicId, setTopicId] = useState('')
  const [theme, setTheme] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('all')

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Načtení předmětů
  useEffect(() => {
    let active = true

    api.subjects()
      .then(data => {
        if (active) setSubjects(data)
      })
      .catch((err: Error) => {
        if (active) setError(err.message)
      })

    return () => { active = false }
  }, [])

  // Načtení okruhů podle předmětu
  useEffect(() => {
    if (!subjectId) {
      setTopics([])
      return
    }

    let active = true

    api.topics(subjectId)
      .then(data => {
        if (active) setTopics(data)
      })
      .catch((err: Error) => {
        if (active) setError(err.message)
      })

    return () => { active = false }
  }, [subjectId])

  // Načtení kartiček z API
  useEffect(() => {
    if (!topicId) {
      setCards([])
      return
    }

    let active = true

    if (preview && subjectId === 'site') {
      const local = networkQuestions
        .filter(card => card.topicId === topicId)
        .map(card => ({ ...card, status: 'unseen' as const, type: 'basic' }))
      setCards(local as Card[])
      setLoading(false)
      setError('')
      return
    }

    api.cards({ topicId })
      .then(data => {
        if (active) {
          setCards(data)
          setError('')
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (active) {
          setCards([])
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { active = false }
  }, [topicId, subjectId, preview])

  // Dostupná témata uvnitř okruhu
  const themes = useMemo(() => {
    return [...new Set(cards.map(card => card.theme))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'cs'))
  }, [cards])

  // Filtrování podle tématu a znalosti
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesTheme = !theme || card.theme === theme
      const matchesStatus =
        filter === 'all' || card.status === filter

      return matchesTheme && matchesStatus
    })
  }, [cards, theme, filter])

  const currentCard = filteredCards[index]

  // Výběr předmětu
  function changeSubject(value: string) {
    setSubjectId(value)
    setTopicId('')
    setTheme('')
    setFilter('all')
    setCards([])
    setTopics([])
    setIndex(0)
    setFlipped(false)
    setError('')
    setNotice('')
  }

  // Výběr okruhu
  function changeTopic(value: string) {
    setTopicId(value)
    setTheme('')
    setFilter('all')
    setCards([])
    setIndex(0)
    setFlipped(false)
    setLoading(Boolean(value))
    setError('')
    setNotice('')
  }

  // Změna tématu
  function changeTheme(value: string) {
    setTheme(value)
    setIndex(0)
    setFlipped(false)
    setNotice('')
  }

  // Změna filtru
  function changeFilter(value: FilterStatus) {
    setFilter(value)
    setIndex(0)
    setFlipped(false)
    setNotice('')
  }

  // Další kartička
  function nextCard() {
    if (filteredCards.length === 0) return

    setIndex(previous =>
      (previous + 1) % filteredCards.length
    )
    setFlipped(false)
    setNotice('')
  }

  // Předchozí kartička
  function previousCard() {
    if (filteredCards.length === 0) return

    setIndex(previous =>
      (previous - 1 + filteredCards.length) %
      filteredCards.length
    )
    setFlipped(false)
    setNotice('')
  }

  // Uložení hodnocení do databáze
  async function rateCard(status: StudyStatus) {
    if (!currentCard || saving) return

    if (preview && subjectId === 'site') {
      const cardId = currentCard.id
      setCards(previous => previous.map(card =>
        card.id === cardId ? { ...card, status } : card
      ))
      setNotice(`Náhled: ${statusLabels[status]} (bez ukládání do databáze).`)
      setIndex(0)
      setFlipped(false)
      return
    }

    const cardId = currentCard.id
    const attempt = {
      attemptId: crypto.randomUUID(),
      cardId,
      status,
    }

    setSaving(true)
    setError('')
    setNotice('')

    try {
      // Stejné ID při opakování po síťové chybě
      let result

      try {
        result = await api.saveProgress(attempt)
      } catch (err) {
        if (err instanceof TypeError) {
          result = await api.saveProgress(attempt)
        } else {
          throw err
        }
      }

      // Aktualizace lokálního stavu
      setCards(previous =>
        previous.map(card =>
          card.id === cardId
            ? { ...card, status }
            : card
        )
      )

      setNotice(
        `Uloženo: ${statusLabels[status]}. ` +
        `Získáno ${result.xpAwarded} XP.`
      )

      // Přechod na další kartičku
      // Respektuje i aktivní filtr
      const remaining = filteredCards.filter(card => {
        if (card.id !== cardId) return true
        return filter === 'all' || filter === status
      })

      if (remaining.length === 0) {
        setIndex(0)
      } else {
        const next = (index + 1) % filteredCards.length
        const nextId = filteredCards[next]?.id

        const nextIndex = remaining.findIndex(
          card => card.id === nextId
        )

        setIndex(nextIndex >= 0 ? nextIndex : 0)
      }

      setFlipped(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Výsledek se nepodařilo uložit.'
      )
    } finally {
      setSaving(false)
    }
  }

  const completed = cards.filter(
    card => card.status === 'known'
  ).length

  return (
    
    <section className="study">
      <h1>Kartičky a procvičování</h1>
      {preview && <p role="status">Vývojový náhled: otázky ze sítí se načítají z JSON. Hodnocení se neukládá.</p>}

      <p>
        Vyber si maturitní předmět, okruh a téma.
        Procvičuj otázky a sleduj svůj pokrok.
      </p>

      {/* Výběr předmětu, okruhu a tématu */}
      <div className="study-selectors">
        <label>
          Předmět
          <select
            value={subjectId}
            onChange={e => changeSubject(e.target.value)}
          >
            <option value="">Vyber předmět</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Okruh
          <select
            value={topicId}
            disabled={!subjectId}
            onChange={e => changeTopic(e.target.value)}
          >
            <option value="">Vyber okruh</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Téma
          <select
            value={theme}
            disabled={!topicId || loading}
            onChange={e => changeTheme(e.target.value)}
          >
            <option value="">Všechna témata</option>
            {themes.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Filtrování podle znalostí */}
      <div className="study-filters">
        <label>
          Filtrovat podle znalosti
          <select
            value={filter}
            onChange={e =>
              changeFilter(e.target.value as FilterStatus)
            }
          >
            <option value="all">Všechny kartičky</option>
            <option value="unseen">Neprobrané</option>
            <option value="known">Umím</option>
            <option value="unknown">Neumím</option>
            <option value="review">Zopakovat</option>
          </select>
        </label>
      </div>

      {/* Celkový pokrok */}
      {topicId && !loading && (
        <div className="study-progress">
          <p>
            Naučené kartičky: {completed} / {cards.length}
          </p>

          <progress
            value={completed}
            max={cards.length || 1}
          />
        </div>
      )}

      {error && (
        <p role="alert" className="study-error">
          {error}
        </p>
      )}

      {notice && (
        <p role="status" className="study-notice">
          {notice}
        </p>
      )}

      {loading && <p>Načítám kartičky...</p>}

      {!topicId && (
        <p>Pro zahájení procvičování vyber předmět a okruh.</p>
      )}

      {topicId && !loading && filteredCards.length === 0 && (
        <p>
          Pro vybrané téma nebo filtr nejsou dostupné
          žádné kartičky.
        </p>
      )}

      {/* Samotná kartička */}
      {currentCard && !loading && (
        <div className="study-session">
          <p className="study-counter">
            Kartička {index + 1} z {filteredCards.length}
          </p>

          <div className="study-card">
            <p className="study-card-theme">
              {currentCard.theme}
            </p>

            <button
              type="button"
              className="study-card-flip"
              onClick={() => setFlipped(value => !value)}
              aria-label={
                flipped
                  ? 'Zobrazit otázku'
                  : 'Otočit kartičku na odpověď'
              }
            >
              <span className="study-card-label">
                {flipped ? 'Odpověď' : 'Otázka'}
              </span>

              <span className="study-card-content">
                {flipped
                  ? currentCard.answer
                  : currentCard.question}
              </span>

              <span className="study-card-hint">
                Klikni pro otočení kartičky
              </span>
            </button>
          </div>

          {/* Hodnocení znalostí */}
          <div className="study-rating">
            <button
              type="button"
              disabled={saving}
              onClick={() => rateCard('known')}
            >
              Umím
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => rateCard('unknown')}
            >
              Neumím
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => rateCard('review')}
            >
              Zopakovat
            </button>
          </div>

          {/* Přecházení mezi otázkami */}
          <div className="study-navigation">
            <button
              type="button"
              disabled={saving}
              onClick={previousCard}
            >
              Předchozí
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={nextCard}
            >
              Další kartička
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
