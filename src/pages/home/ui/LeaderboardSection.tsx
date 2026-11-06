import { Icon } from '../../../shared/ui'
import styles from '../HomePage.module.scss'

const rankings = [
  { position: '01', initial: 'K', name: 'Klára N.', streak: '4 dny v řadě', points: '1 280', color: 'avatarBlue' },
  { position: '02', initial: 'M', name: 'Matěj S.', streak: '3 dny v řadě', points: '1 140', color: 'avatarOrange' },
]

export function LeaderboardSection() {
  return (
    <section className={styles.leaderboard} id="leaderboard">
      <div className={styles.leaderCopy}>
        <span className={styles.eyebrow}>Trocha zdravé motivace</span>
        <h2>Každý den o kousek<br /><span>blíž k cíli.</span></h2>
        <p>Uč se pravidelně, sbírej body a oslavuj každý malý úspěch. Maturita není sprint — ale nemusíš na to být sám.</p>
        
      </div>
      <div className={styles.rankCard}>
        <div className={styles.rankHeading}>
          <div><span className={styles.rankIcon}><Icon name="chart" size={19} /></span><span><strong>Studijní parta</strong><small>Tento týden</small></span></div>
          <span className={styles.rankLabel}>TOP 3</span>
        </div>
        {rankings.map((student) => (
          <div className={styles.rankRow} key={student.position}>
            <span className={styles.rankPosition}>{student.position}</span>
            <span className={`${styles.avatar} ${styles[student.color as keyof typeof styles]}`}>{student.initial}</span>
            <span className={styles.rankName}>{student.name}<small>{student.streak}</small></span>
            <strong>{student.points} <small>XP</small></strong>
          </div>
        ))}
        <div className={`${styles.rankRow} ${styles.currentRank}`}>
          <span className={styles.rankPosition}>03</span>
          <span className={`${styles.avatar} ${styles.avatarGreen}`}>T</span>
          <span className={styles.rankName}>Teď jsi na řadě<small>Další můžeš být ty!</small></span>
          <span className={styles.rankArrow}><Icon name="arrow" size={16} /></span>
        </div>
        
      </div>
    </section>
  )
}