import type { UserProfile, LeaderboardSummary } from './types';

export const mockUserProfile: UserProfile = {
  id: 'u-jan-kotrba',
  name: 'Jan Kotrba',
  classGroup: '3.Bi',
  fieldOfStudy: 'Informační technologie',
  avatarUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&h=240&q=80',
  level: 14,
  streakDays: 4,
  cardsCompleted: 1650,
  subjects: [
    { id: 'sub-1', name: 'Programování', iconType: 'code', progressPercent: 41 },
    { id: 'sub-2', name: 'Sítě', iconType: 'network', progressPercent: 89 },
    { id: 'sub-3', name: 'Tvorba webů', iconType: 'web', progressPercent: 62 },
  ],
  last7Days: [
    { dayLabel: 'St', count: 40 },
    { dayLabel: 'Čt', count: 12 },
    { dayLabel: 'Pá', count: 0 },
    { dayLabel: 'So', count: 28 },
    { dayLabel: 'Ne', count: 35 },
    { dayLabel: 'Po', count: 32 },
    { dayLabel: 'Dnes', count: 18, isToday: true },
  ],
  badges: [
    { id: 'b-1', title: '3 dny v řadě', icon: 'flame', unlocked: true },
    { id: 'b-2', title: '1000 karet', icon: 'cards', unlocked: true },
    { id: 'b-3', title: 'Síťař', subtitle: '89 / 100 %', icon: 'network', unlocked: false },
    { id: 'b-4', title: 'Úroveň 14', icon: 'trophy', unlocked: false },
  ],
};

const activeDaysSet = new Set([2, 3, 6, 8, 10, 11, 12, 17, 19, 20, 21, 22, 23, 25, 27, 30, 31]);

export const mockLeaderboardData: LeaderboardSummary = {
  currentUserRank: 5,
  totalXp: 28358,
  progressPercent: 56,
  calendarDays: Array.from({ length: 31 }, (_, i) => ({
    dayNumber: i + 1,
    isActive: activeDaysSet.has(i + 1),
  })),
  students: [
    {
      id: 'st-1',
      rank: 1,
      name: 'Michal Suchan',
      xpThisMonth: 67359,
      xpAllTime: 95400,
      isCurrentUser: false,
    },
    {
      id: 'st-2',
      rank: 2,
      name: 'Jan Kotrba',
      xpThisMonth: 64612,
      xpAllTime: 88120,
      isCurrentUser: true,
    },
    {
      id: 'st-3',
      rank: 3,
      name: 'Adam David',
      xpThisMonth: 12798,
      xpAllTime: 31200,
      isCurrentUser: false,
    },
    {
      id: 'st-4',
      rank: 4,
      name: 'Jan Tománek',
      xpThisMonth: 4955,
      xpAllTime: 18450,
      isCurrentUser: false,
    },
  ],
};