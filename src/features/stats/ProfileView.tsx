import { Icon, LinkButton } from '../../shared/ui'
import type { IconName } from '../../shared/ui/Icon'
import type { UserProfile } from './types'
import styles from './Stats.module.scss'

const badgeIcons: Record<string, IconName> = { flame: 'target', cards: 'book', network: 'users', trophy: 'cap' }

export function ProfileView({ user }: { user: UserProfile }) {
  const weeklyTotal = user.last7Days.reduce((sum, day) => sum + day.count, 0)
  const chartMax = Math.max(1, ...user.last7Days.map(day => day.count))
  const unlockedCount = user.badges.filter(badge => badge.unlocked).length
  return <section className={styles.page}>
    <div className={styles.container}>
      <header className={styles.heading}>
        <div><span className={styles.eyebrow}><Icon name="chart" size={16} /> TVŮJ STUDIJNÍ PŘEHLED</span><h1>Malé kroky. <span>Tvůj velký pokrok.</span></h1><p>Všechno, co už máš za sebou, přehledně na jednom místě.</p></div>
        <LinkButton href="/flashcards">Pokračovat v učení <Icon name="arrow" size={17} /></LinkButton>
      </header>
      <div className={styles.identity}>
        <div className={styles.avatar}>{user.avatarUrl && !user.avatarUrl.startsWith('data:') ? <img src={user.avatarUrl} alt="" /> : user.name.slice(0, 2).toLocaleUpperCase('cs-CZ')}</div>
        <div className={styles.identityCopy}><span>MŮJ PROFIL</span><h2>{user.name}</h2><p>{[user.classGroup, user.fieldOfStudy].filter(Boolean).join(' · ') || 'Tvůj prostor pro přípravu k maturitě'}</p></div>
        <span className={styles.levelPill}><Icon name="cap" size={16} /> Úroveň {user.level}</span>
      </div>
      <div className={styles.metrics}>
        <div className={styles.metric}><span className={styles.blueIcon}><Icon name="cap" size={22} /></span><div><span>Studijní úroveň</span><strong>{user.level}</strong><small>Roste s nasbíranými XP</small></div></div>
        <div className={styles.metric}><span className={styles.amberIcon}><Icon name="clock" size={22} /></span><div><span>Série aktivních dnů</span><strong>{user.streakDays} <em>{user.streakDays === 1 ? 'den' : user.streakDays >= 2 && user.streakDays <= 4 ? 'dny' : 'dnů'}</em></strong><small>Pravidelnost dělá rozdíl</small></div></div>
        <div className={styles.metric}><span className={styles.greenIcon}><Icon name="check" size={22} /></span><div><span>Zvládnuté kartičky</span><strong>{user.cardsCompleted.toLocaleString('cs-CZ')}</strong><small>Kartičky označené jako „umím“</small></div></div>
      </div>
      <div className={styles.profileGrid}>
        <section className={styles.panel} aria-labelledby="subjects-heading">
          <div className={styles.panelHeading}><div><h2 id="subjects-heading">Jak si vedeš v předmětech</h2><p>Každá zvládnutá kartička tě posouvá dál.</p></div><span className={styles.sectionIcon}><Icon name="book" size={20} /></span></div>
          <div className={styles.subjectList}>{user.subjects.map((subject, index) => <div className={styles.subjectRow} key={subject.id}>
            <div className={styles.subjectTitle}><span className={styles.subjectNumber}>{String(index + 1).padStart(2, '0')}</span><h3>{subject.name}</h3><strong>{subject.progressPercent} <small>%</small></strong></div>
            <div className={styles.progressBar} role="progressbar" aria-label={subject.name} aria-valuenow={subject.progressPercent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${subject.progressPercent}%` }} /></div>
          </div>)}{!user.subjects.length && <p className={styles.empty}>Zatím tu nejsou žádné předměty.</p>}</div>
          <LinkButton variant="text" href="/flashcards" className={styles.panelLink}>Vybrat kartičky k procvičení <Icon name="arrow" size={16} /></LinkButton>
        </section>
        <section className={styles.panel} aria-labelledby="activity-heading">
          <div className={styles.panelHeading}><div><h2 id="activity-heading">Tvoje aktivita</h2><p>Posledních 7 dní</p></div><span className={styles.countPill}>{weeklyTotal.toLocaleString('cs-CZ')} pokusů</span></div>
          <div className={styles.chart} aria-label="Počet pokusů za posledních sedm dní">{user.last7Days.map((day, index) => <div key={index} className={`${styles.chartColumn} ${day.isToday ? styles.today : ''}`}>
            <span className={styles.barCount}>{day.count}</span><div className={styles.barTrack}><div className={styles.bar} style={{ height: `${day.count ? Math.max(4, day.count / chartMax * 100) : 0}%` }} /></div><span className={styles.dayLabel}>{day.dayLabel}</span>
          </div>)}</div>
          <p className={styles.chartNote}><Icon name="clock" size={15} />{weeklyTotal ? 'I krátké procvičování se počítá. Jen tak dál.' : 'Začni první kartičkou a sleduj, jak tvůj přehled ožívá.'}</p>
        </section>
        <section className={`${styles.panel} ${styles.badgesPanel}`} aria-labelledby="badges-heading">
          <div className={styles.panelHeading}><div><h2 id="badges-heading">Tvoje odznaky</h2><p>Malé odměny za tvoji vytrvalost.</p></div><span className={styles.countPill}>{unlockedCount} z {user.badges.length} odemčeno</span></div>
          <div className={styles.badges}>{user.badges.map(badge => <div key={badge.id} className={`${styles.badge} ${badge.unlocked ? styles.unlocked : ''}`}><span className={styles.badgeIcon}><Icon name={badgeIcons[badge.icon] || 'cap'} size={26} /></span><div><h3>{badge.title}</h3><p>{badge.subtitle || (badge.unlocked ? 'Odznak získán' : 'Ještě na tebe čeká')}</p></div><span className={styles.badgeStatus}>{badge.unlocked ? <><Icon name="check" size={14} /> Získáno</> : 'Zamčeno'}</span></div>)}</div>
        </section>
      </div>
    </div>
  </section>
}
