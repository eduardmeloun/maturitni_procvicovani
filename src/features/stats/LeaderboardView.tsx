import { useState } from 'react'
import { Icon, LinkButton } from '../../shared/ui'
import type { LeaderboardSummary } from './types'
import { sortLeaderboard } from './calculations'
import styles from './Stats.module.scss'

export function LeaderboardView({ data }: { data: LeaderboardSummary }) {
  const [period, setPeriod] = useState<'month' | 'all'>('month')
  const [monthDate] = useState(() => {
    const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(new Date())
    return new Date(`${today.slice(0, 7)}-01T12:00:00Z`)
  })
  const sorted = sortLeaderboard(data.students, period)
  const current = sorted.find(student => student.isCurrentUser)
  const monthOffset = (monthDate.getUTCDay() + 6) % 7
  const monthLabel = new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric', timeZone: 'Europe/Prague' }).format(monthDate)
  const activeDays = data.calendarDays.filter(day => day.isActive).length
  return <section className={styles.page}>
    <div className={styles.container}>
      <header className={styles.heading}><div><span className={styles.eyebrow}><Icon name="cap" size={16} /> SPOLEČNĚ AŽ K MATURITĚ</span><h1>Každá kartička <span>tě posouvá výš.</span></h1><p>Trocha motivace navíc. Podívej se, jak si vedeš mezi ostatními.</p></div><LinkButton href="/flashcards">Jdu si procvičit <Icon name="arrow" size={17} /></LinkButton></header>
      <div className={styles.metrics}>
        <div className={styles.metric}><span className={styles.amberIcon}><Icon name="cap" size={22} /></span><div><span>{current ? 'Tvoje umístění' : 'Zapojení studenti'}</span><strong>{current ? `#${current.rank}` : sorted.length.toLocaleString('cs-CZ')}</strong><small>{current ? period === 'month' ? 'V tomto měsíci' : 'Za celou dobu' : 'Každý začíná první kartičkou'}</small></div></div>
        <div className={styles.metric}><span className={styles.blueIcon}><Icon name="sparkle" size={22} /></span><div><span>{current ? 'Tvoje zkušenosti' : 'Nejvyšší počet XP'}</span><strong>{(current ? period === 'month' ? current.xpThisMonth : current.xpAllTime : sorted[0] ? period === 'month' ? sorted[0].xpThisMonth : sorted[0].xpAllTime : 0).toLocaleString('cs-CZ')} <em>XP</em></strong><small>{period === 'month' ? 'Nasbíráno tento měsíc' : 'Nasbíráno za celou dobu'}</small></div></div>
        <div className={styles.metric}><span className={styles.greenIcon}><Icon name={current ? 'check' : 'users'} size={22} /></span><div><span>{current ? 'Zvládnuté učivo' : 'Učíme se společně'}</span><strong>{current ? `${data.progressPercent} %` : 'Krok za krokem'}</strong><small>{current ? 'Ze všech dostupných kartiček' : 'Vlastním tempem, každý den'}</small></div></div>
      </div>
      <div className={styles.leaderGrid}>
        <section className={`${styles.panel} ${styles.rankingPanel}`} aria-labelledby="ranking-heading">
          <div className={styles.rankingHeader}><div><h2 id="ranking-heading">Žebříček studentů</h2><p>{sorted.length} studentů · seřazeno podle XP</p></div><div className={styles.periodSwitch} role="group" aria-label="Období žebříčku"><button aria-pressed={period === 'month'} onClick={() => setPeriod('month')}>Tento měsíc</button><button aria-pressed={period === 'all'} onClick={() => setPeriod('all')}>Celkově</button></div></div>
          {sorted.length ? <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th scope="col">Pořadí</th><th scope="col">Student</th><th scope="col">Zkušenosti</th></tr></thead><tbody>{sorted.map(student => <tr key={student.id} className={student.isCurrentUser ? styles.currentRow : ''}><td><span className={`${styles.rank} ${student.rank <= 3 ? styles['place' + student.rank] : ''}`}>{student.rank}</span></td><th scope="row"><span className={styles.student}><span className={styles.studentAvatar} aria-hidden="true">{student.name.slice(0, 2).toLocaleUpperCase('cs-CZ')}</span><span className={styles.studentName}>{student.name}</span>{student.isCurrentUser && <span className={styles.you}>Ty</span>}</span></th><td className={styles.xp}>{(period === 'month' ? student.xpThisMonth : student.xpAllTime).toLocaleString('cs-CZ')} <span>XP</span></td></tr>)}</tbody></table></div> : <div className={styles.empty}><Icon name="users" size={32} /><h3>První místo zatím čeká.</h3><p>Začni procvičovat a zapoj se do žebříčku.</p></div>}
          <p className={styles.tableNote}><Icon name="shield" size={15} /> XP získáváš za nově zvládnuté kartičky. Každý pokrok se počítá.</p>
        </section>
        <aside className={styles.sidebar}>
          {current && <section className={styles.panel} aria-labelledby="calendar-heading"><div className={styles.panelHeading}><div><h2 id="calendar-heading">Tvoje aktivita</h2><p className={styles.monthLabel}>{monthLabel}</p></div><span className={styles.sectionIcon}><Icon name="clock" size={20} /></span></div><div className={styles.calendar}>{['Po','Út','St','Čt','Pá','So','Ne'].map(day => <span className={styles.weekday} key={day}>{day}</span>)}{Array.from({ length: monthOffset }, (_, i) => <span key={`blank-${i}`} aria-hidden="true" />)}{data.calendarDays.map(day => <span key={day.dayNumber} className={`${styles.calendarDay} ${day.isActive ? styles.activeDay : ''}`} aria-label={`${day.dayNumber}. ${monthLabel}: ${day.isActive ? 'aktivní den' : 'bez aktivity'}`}>{day.dayNumber}</span>)}</div><div className={styles.calendarLegend}><span><i />Aktivní den</span><strong>{activeDays} za měsíc</strong></div></section>}
          <div className={styles.tip}><span className={styles.tipIcon}><Icon name="sparkle" size={22} /></span><h3>Tvůj největší soupeř?<br />Tvoje včerejší já.</h3><p>Pořadí je příjemný bonus. Důležité je, kolik toho dnes zvládneš oproti včerejšku.</p><LinkButton variant="text" href="/flashcards">Zkusit další kartičku <Icon name="arrow" size={16} /></LinkButton></div>
        </aside>
      </div>
    </div>
  </section>
}
