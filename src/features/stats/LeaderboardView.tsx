import { useState } from 'react'
import type { LeaderboardSummary } from './types'
import { sortLeaderboard } from './calculations'
import styles from './LeaderboardView.module.scss'

export function LeaderboardView({ data, preview = false }: { data: LeaderboardSummary; preview?: boolean }) {
  const [period, setPeriod] = useState<'month' | 'all'>('month')
  const [today] = useState(() => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(new Date()))
  const monthDate = new Date(`${today.slice(0, 7)}-01T12:00:00Z`)
  const monthLabel = new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric', timeZone: 'Europe/Prague' }).format(monthDate)
  const sorted = sortLeaderboard(data.students, period)
  const current = sorted.find(student => student.isCurrentUser)
  const progress = Math.max(0, Math.min(100, data.progressPercent))
  const monthOffset = monthDate.getUTCDay()

  return <section className={`${styles.page} ${preview ? styles.preview : ''}`} aria-label="Žebříček studentů">
    <div className={styles.container}>
      {!preview && <><div className={styles.metrics}>
        <section className={styles.metric} aria-labelledby="rank-label">
          <h2 id="rank-label">Pořadí</h2>
          <strong>{current ? `#${current.rank}` : '—'}</strong>
          <p>{current ? 'Tvoje aktuální umístění' : 'Přihlas se pro své umístění'}</p>
        </section>
        <section className={styles.metric} aria-labelledby="xp-label">
          <h2 id="xp-label">Celkové XP</h2>
          <strong className={styles.totalXp}>{current ? data.totalXp.toLocaleString('cs-CZ') : '—'}</strong>
          <p>Zkušenostní body</p>
        </section>
        <section className={styles.metric} aria-labelledby="progress-label">
          <h2 id="progress-label">Pokrok</h2>
          <div className={styles.progressValue}>
            <div className={styles.progressTrack} role="progressbar" aria-label="Zvládnuté kartičky" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
            <strong>{current ? `${progress} %` : '—'}</strong>
          </div>
          <p>Zvládnuté kartičky</p>
        </section>
      </div>

      <section className={styles.calendarPanel} aria-label={`Aktivita za ${monthLabel}`}>
        <div className={styles.calendarHeading}><h2>Tvoje aktivita</h2><span className={styles.month}>{monthLabel}</span></div>
        <div className={styles.calendar}>
          {['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'].map(day => <span className={styles.weekday} key={day}>{day}</span>)}
          {Array.from({ length: monthOffset }, (_, i) => <span key={`blank-${i}`} aria-hidden="true" />)}
          {data.calendarDays.map(day => <span key={day.dayNumber} className={`${styles.calendarDay} ${day.isActive ? styles.activeDay : ''} ${today.endsWith(`-${String(day.dayNumber).padStart(2, '0')}`) ? styles.today : ''}`} aria-label={`${day.dayNumber}. ${monthLabel}: ${day.isActive ? 'aktivní den' : 'bez aktivity'}`}>{day.dayNumber}</span>)}
        </div>
        <div className={styles.calendarFooter}>
          <div className={styles.legend}><span><i className={styles.activeKey} />Aktivní den</span><span><i />Bez aktivity</span></div>
        </div>
        {!current && <p className={styles.guestNote}>Po přihlášení tu uvidíš svoji studijní aktivitu.</p>}
      </section>

      </>}
      <section className={styles.rankingPanel} aria-labelledby="ranking-heading">
        <div className={styles.rankingHeader}>
          {preview ? <h2 id="ranking-heading">Žebříček studentů</h2> : <h1 id="ranking-heading">Žebříček studentů</h1>}
          <select aria-label="Období žebříčku" value={period} onChange={event => setPeriod(event.target.value as 'month' | 'all')}><option value="month">Tento měsíc</option><option value="all">Celkově</option></select>
        </div>
        {sorted.length ? <ol className={styles.ranking}>
          {sorted.map(student => <li key={student.id} className={student.isCurrentUser ? styles.currentRow : ''}>
            <span className={`${styles.rank} ${student.rank <= 3 ? styles[`place${student.rank}`] : ''}`} aria-label={`${student.rank}. místo`}>{student.rank}</span>
            <span className={styles.studentName}>{student.name}{student.isCurrentUser && <span className={styles.you}>Ty</span>}</span>
            <span className={styles.xp}>{(period === 'month' ? student.xpThisMonth : student.xpAllTime).toLocaleString('cs-CZ')} <span>XP</span></span>
          </li>)}
        </ol> : <div className={styles.empty}><p>První místo zatím čeká.</p><a href="/flashcards">Začít procvičovat</a></div>}
      </section>
    </div>
  </section>
}