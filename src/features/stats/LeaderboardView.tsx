import React, { useState } from 'react';
import type { LeaderboardSummary } from './types';
import { mockLeaderboardData } from './mockData';
import { sortLeaderboard } from './calculations';

interface LeaderboardViewProps {
  data?: LeaderboardSummary;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ data = mockLeaderboardData }) => {
  const [period, setPeriod] = useState<'month' | 'all'>('month');
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const sortedStudents = sortLeaderboard(data.students, period);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px', backgroundColor: '#cbd5e1', minHeight: '100vh', fontFamily: "'Manrope', sans-serif" }}>
      {/* 3 horní souhrnné karty */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e293b' }}>Rank</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>#{data.currentUserRank}</span>
          <span style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '2px' }}>Your current position</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e293b' }}>Total XP</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{data.totalXp.toLocaleString('cs-CZ')}</span>
          <span style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '2px' }}>Experience points</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e293b' }}>Progress</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="16" height="10" rx="3" ry="3" />
              <line x1="22" y1="11" x2="22" y2="13" />
              <rect x="4" y="9" width="8" height="6" fill="#1d4ed8" stroke="none" rx="1.5" />
            </svg>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{data.progressPercent}%</span>
          </div>
          <span style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '2px' }}>Cards completed</span>
        </div>
      </div>

      {/* Měsíční kalendář aktivity */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
          {weekdays.map((day, idx) => (
            <div key={idx} style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb', paddingBottom: '4px' }}>
              {day}
            </div>
          ))}
          {data.calendarDays.map((d) => (
            <div
              key={d.dayNumber}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: d.isActive ? '#1d4ed8' : '#e2e8f0',
                color: d.isActive ? '#ffffff' : '#334155',
              }}
            >
              {d.dayNumber}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.68rem', color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#1d4ed8' }} />
            <span>Aktivní den</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#e2e8f0' }} />
            <span>Bez aktivity</span>
          </div>
        </div>
      </div>

      {/* Žebříček studentů */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Žebříček studentů</h3>
          <button
            onClick={() => setPeriod(period === 'month' ? 'all' : 'month')}
            style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            {period === 'month' ? 'Tento měsíc' : 'Celkově'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '10px' }}>
          {sortedStudents.map((student) => {
            const rankBg =
              student.rank === 1
                ? '#1d4ed8'
                : student.rank === 2
                ? '#2563eb'
                : student.rank === 3
                ? '#0284c7'
                : '#ffffff';

            const rankTextColor = student.rank <= 3 ? '#ffffff' : '#0f172a';
            const xpToShow = period === 'month' ? student.xpThisMonth : student.xpAllTime;

            return (
              <div
                key={student.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: student.isCurrentUser ? '6px 8px' : '6px 4px',
                  backgroundColor: student.isCurrentUser ? '#f8fafc' : 'transparent',
                  borderRadius: student.isCurrentUser ? '6px' : '0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: rankBg,
                      color: rankTextColor,
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      border: student.rank > 3 ? '1px solid #cbd5e1' : 'none',
                    }}
                  >
                    {student.rank}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{student.name}</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                  {xpToShow.toLocaleString('cs-CZ')} XP
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};