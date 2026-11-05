import { useEffect, useState } from 'react'
import { request } from '../../../lib/api'
import type { LeaderboardStudent } from '../../../features/stats/types'
import { Button, Icon } from '../../../shared/ui'
import styles from '../HomePage.module.scss'

export function LeaderboardSection({ onJoin }: { onJoin: () => void }) {
  const [rankings, setRankings] = useState<LeaderboardStudent[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  useEffect(() => {
    let active = true
    request<LeaderboardStudent[]>('/leaderboard').then(students => {
      if (active) { setRankings([...students].sort((a, b) => b.xpThisMonth - a.xpThisMonth || a.id.localeCompare(b.id)).slice(0, 3)); setState('ready') }
    }).catch(() => { if (active) setState('error') })
    return () => { active = false }
  }, [])
  return (
    <section className={styles.leaderboard} id="leaderboard">
      <div className={styles.leaderCopy}>
        <span className={styles.eyebrow}>Trocha zdravé motivace</span>
        <h2>Každý den o kousek<br /><span>blíž k cíli.</span></h2>
        <p>Uč se pravidelně, sbírej body a oslavuj každý malý úspěch. Maturita není sprint — ale nemusíš na to být sám.</p>
        <Button onClick={onJoin}>Přidat se k učení <Icon name="arrow" size={17} /></Button>
      </div>
      <div className={styles.rankCard}>
        <div className={styles.rankHeading}>
          <div><span className={styles.rankIcon}><Icon name="chart" size={19} /></span><span><strong>Studijní parta</strong><small>Tento měsíc</small></span></div>
          <span className={styles.rankLabel}>TOP 3</span>
        </div>
        {rankings.map((student, index) => (
          <div className={styles.rankRow} key={student.id}>
            <span className={styles.rankPosition}>{String(index + 1).padStart(2, '0')}</span>
            <span className={`${styles.avatar} ${styles[['avatarBlue', 'avatarOrange', 'avatarGreen'][index]]}`}>{student.name.slice(0, 1).toLocaleUpperCase('cs-CZ')}</span>
            <span className={styles.rankName}>{student.name}<small>Tento měsíc</small></span>
            <strong>{student.xpThisMonth.toLocaleString('cs-CZ')} <small>XP</small></strong>
          </div>
        ))}
        {state === 'loading' && <p className={styles.rankFoot} role="status">Načítám žebříček…</p>}
        {state === 'error' && <p className={styles.rankFoot} role="status">Žebříček teď není dostupný. Zkus to později.</p>}
        {state === 'ready' && !rankings.length && <p className={styles.rankFoot}>První místo zatím čeká. Přidej se k učení!</p>}
        <p className={styles.rankFoot}><Icon name="sparkle" size={15} /> Tvoje tempo, tvoje cesta.</p>
      </div>
    </section>
  )
}