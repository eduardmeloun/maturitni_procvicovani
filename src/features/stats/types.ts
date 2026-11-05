export type SubjectName = 'Programování' | 'Sítě' | 'Tvorba webů' | string;

export interface SubjectProgress {
  id: string;
  name: SubjectName;
  iconType: 'code' | 'network' | 'web';
  progressPercent: number; // 0 - 100 %
}

export type BadgeIconType = 'flame' | 'cards' | 'network' | 'trophy';

export interface Badge {
  id: string;
  title: string;
  subtitle?: string; // např. "89 / 100 %"
  icon: BadgeIconType;
  unlocked: boolean;
}

export interface DailyActivity {
  dayLabel: string; // např. "St", "Čt", "Dnes"
  count: number;
  isToday?: boolean;
}

export interface CalendarDay {
  dayNumber: number;
  isActive: boolean;
}

export interface LeaderboardStudent {
  id: string;
  rank: number;
  name: string;
  xpThisMonth: number;
  xpAllTime: number;
  isCurrentUser?: boolean;
}

export interface CardAttemptHistory {
  date: string; // formát YYYY-MM-DD
  cardsCount: number;
  xpGained: number;
}

export interface UserProfile {
  id: string;
  name: string;
  classGroup: string;
  fieldOfStudy: string;
  avatarUrl: string;
  level: number;
  streakDays: number;
  cardsCompleted: number;
  subjects: SubjectProgress[];
  last7Days: DailyActivity[];
  badges: Badge[];
}

export interface LeaderboardSummary {
  currentUserRank: number;
  totalXp: number;
  progressPercent: number;
  calendarDays: CalendarDay[];
  students: LeaderboardStudent[];
}