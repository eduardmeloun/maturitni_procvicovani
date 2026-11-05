import type {
  DailyActivity,
  CalendarDay,
  LeaderboardStudent,
  CardAttemptHistory,
} from './types';

/**
 * Spočítá nepřerušenou sérii aktivních dnů (streak) vedoucí až do dneška nebo včerejška.
 */
export function calculateStreak(dates: string[]): number {
  if (!dates || dates.length === 0) return 0;

  const uniqueSortedDates = Array.from(new Set(dates)).sort().reverse();
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(yesterdayDate);

  const mostRecent = uniqueSortedDates[0];
  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(mostRecent);

  for (let i = 1; i < uniqueSortedDates.length; i++) {
    const prevDate = new Date(uniqueSortedDates[i]);
    const diffTime = currentDate.getTime() - prevDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Výpočet úrovně a procenta postupu do další úrovně z celkových XP.
 * Každý level L vyžaduje (L * 1000) XP.
 */
export function calculateLevel(xp: number): {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  let level = 1;
  let threshold = 1000;
  let accumulated = xp;

  while (accumulated >= threshold) {
    accumulated -= threshold;
    level++;
    threshold = level * 1000;
  }

  const progressPercent = Math.min(100, Math.round((accumulated / threshold) * 100));

  return {
    level,
    currentXp: accumulated,
    nextLevelXp: threshold,
    progressPercent,
  };
}

/**
 * Agreguje výsledky za posledních 7 kalendářních dní končících dneškem pro sloupcový graf.
 */
export function formatLast7Days(history: CardAttemptHistory[]): {
  data: DailyActivity[];
  totalCards: number;
} {
  const czechDays = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
  const data: DailyActivity[] = [];
  let totalCards = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(d);
    const isToday = i === 0;

    const matched = history.find((h) => h.date === dateStr);
    const count = matched ? matched.cardsCount : 0;
    totalCards += count;

    data.push({
      dayLabel: isToday ? 'Dnes' : czechDays[d.getDay()],
      count,
      isToday,
    });
  }

  return { data, totalCards };
}

/**
 * Vygeneruje pole dnů pro měsíční kalendář s příznakem aktivity.
 */
export function generateMonthCalendar(
  activeDayNumbers: Set<number>,
  totalDays: number = 31
): CalendarDay[] {
  const days: CalendarDay[] = [];
  for (let i = 1; i <= totalDays; i++) {
    days.push({
      dayNumber: i,
      isActive: activeDayNumbers.has(i),
    });
  }
  return days;
}

/**
 * Seřadí žebříček studentů podle zvoleného filtru a přepočítá rank (1, 2, 3...).
 */
export function sortLeaderboard(
  students: LeaderboardStudent[],
  period: 'month' | 'all'
): LeaderboardStudent[] {
  return [...students]
    .sort((a, b) => {
      const valA = period === 'month' ? a.xpThisMonth : a.xpAllTime;
      const valB = period === 'month' ? b.xpThisMonth : b.xpAllTime;
      return valB - valA;
    })
    .map((student, index) => ({
      ...student,
      rank: index + 1,
    }));
}