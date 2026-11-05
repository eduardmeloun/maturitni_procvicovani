import styles from './Stats.module.scss'
import { useEffect, useState } from 'react'
import { api, request } from '../../lib/api'
import type { User } from '../../lib/contracts'
import { ProfileView } from './ProfileView'
import { LeaderboardView } from './LeaderboardView'
import type { UserProfile, LeaderboardSummary, LeaderboardStudent } from './types'
import { calculateLevel, calculateStreak, formatLast7Days } from './calculations'
export function StatsPage({ page, user }: { page: 'profile' | 'leaderboard'; user: User | null }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [board, setBoard] = useState<LeaderboardSummary | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    async function load() {
      const students = await request<LeaderboardStudent[]>('/leaderboard')
      const ranked = [...students].sort((a,b) => b.xpThisMonth-a.xpThisMonth || a.id.localeCompare(b.id)).map((s,i) => ({ ...s, rank: i+1, isCurrentUser: s.id === user?.id }))
      const own = students.find(s => s.id === user?.id)
      const [progress, activity, cards, subjects, topics] = user ? await Promise.all([api.progress(), api.activity(), api.cards(), api.subjects(), api.topics()]) : [[],[],[],[],[]]
      const completed = progress.filter(p => p.status === 'known').length
      const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(new Date())
      const [year, month] = today.split('-').map(Number)
      if (!active) return
      setBoard({ students: ranked, currentUserRank: ranked.find(s => s.isCurrentUser)?.rank || 0, totalXp: own?.xpAllTime || 0,
        progressPercent: cards.length ? Math.round(completed/cards.length*100) : 0,
        calendarDays: Array.from({ length: new Date(year,month,0).getDate() }, (_,i) => ({ dayNumber: i+1, isActive: activity.some(a => a.day === today.slice(0,8) + String(i+1).padStart(2,'0')) })) })
      if (user) setProfile({ id: user.id, name: user.username, classGroup: user.className, fieldOfStudy: user.field,
        avatarUrl: user.avatarUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y="75" x="20" font-size="75"%3E' + encodeURIComponent(user.username[0]) + '%3C/text%3E%3C/svg%3E',
        level: calculateLevel(own?.xpAllTime || 0).level, streakDays: calculateStreak(activity.map(a => a.day)), cardsCompleted: completed,
        subjects: subjects.map(s => { const subset = cards.filter(c => topics.some(t => t.id === c.topicId && t.subjectId === s.id)); return { id: s.id, name: s.name, iconType: 'code', progressPercent: subset.length ? Math.round(subset.filter(c => c.status === 'known').length/subset.length*100) : 0 } }),
        last7Days: formatLast7Days(activity.map(a => ({ date: a.day, cardsCount: a.attempts, xpGained: a.xp }))).data,
        badges: [{ id: 'first', title: 'První kartička', icon: 'cards', unlocked: completed > 0 }, { id: 'hundred', title: '100 kartiček', icon: 'trophy', unlocked: completed >= 100 }] })
    }
    load().catch(error => { if (active) setError(error.message) })
    return () => { active = false }
  }, [page, user])
  if (error || (page === 'profile' ? !profile : !board)) return <section className={styles.page}><div className={styles.container}><div className={styles.panel}>
    {error ? <><p role="alert">{error}</p><button onClick={() => window.location.reload()}>Zkusit znovu</button></> : <p role="status">Načítám {page === 'profile' ? 'profil' : 'žebříček'}…</p>}
  </div></div></section>
  return page === 'profile' ? <ProfileView user={profile!} /> : <LeaderboardView data={board!} />
}
