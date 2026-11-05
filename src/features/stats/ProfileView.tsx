import React from 'react';
import type { UserProfile } from './types';
import { mockUserProfile } from './mockData';

interface ProfileViewProps {
  user?: UserProfile;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user = mockUserProfile }) => {
  const totalWeeklyCards = user.last7Days.reduce((acc, curr) => acc + curr.count, 0);
  const unlockedBadgesCount = user.badges.filter((b) => b.unlocked).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px', backgroundColor: '#cbd5e1', minHeight: '100vh', fontFamily: "'Manrope', sans-serif" }}>
      {/* Uživatelská identita */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: '96px', height: '96px', borderRadius: '50%', border: '4px solid #2563eb', padding: '2px', backgroundColor: '#cbd5e1', overflow: 'hidden', marginBottom: '8px' }}>
          <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{user.name}</h2>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
          {user.classGroup} - {user.fieldOfStudy}
        </div>
      </div>

      {/* 3 horní statistické karty */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e293b', marginTop: '6px' }}>Úroveň:</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{user.level}</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e293b', marginTop: '6px' }}>Dnešní streak:</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{user.streakDays} dny</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
            <path d="M6 2v20" />
          </svg>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e293b', marginTop: '6px' }}>Splněno karet:</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{user.cardsCompleted.toLocaleString('cs-CZ')}</span>
        </div>
      </div>

      {/* Moje Maturitní Okruhy */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>Moje Maturitní Okruhy</h3>
        {user.subjects.map((subject) => (
          <div key={subject.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '32px', height: '24px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
              {subject.iconType === 'code' && '>_'}
              {subject.iconType === 'network' && '⇄'}
              {subject.iconType === 'web' && '🌐'}
            </div>
            <span style={{ width: '95px', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{subject.name}</span>
            <div style={{ flex: 1, height: '18px', backgroundColor: '#e2e8f0', border: '1.5px solid #0f172a', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${subject.progressPercent}%`, background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '8px 0 0 8px' }} />
            </div>
            <span style={{ width: '38px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{subject.progressPercent} %</span>
          </div>
        ))}
      </div>

      {/* Posledních 7 dní */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Posledních 7 dní</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{totalWeeklyCards} kartiček</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', paddingTop: '10px' }}>
          {user.last7Days.map((day, idx) => {
            const barHeight = Math.max(4, Math.round((day.count / 45) * 80));
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '32px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: day.isToday ? '#1d4ed8' : '#1e293b' }}>{day.count}</span>
                <div style={{ width: '14px', height: `${barHeight}px`, backgroundColor: day.isToday ? '#1d4ed8' : '#93c5fd', borderRadius: '4px', transition: 'height 0.3s ease' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: day.isToday ? 800 : 600, color: day.isToday ? '#1d4ed8' : '#64748b', marginTop: '2px' }}>{day.dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Odznaky */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Odznaky</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{unlockedBadgesCount} z {user.badges.length}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {user.badges.map((badge) => (
            <div key={badge.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '6px',
                backgroundColor: badge.unlocked ? '#eff6ff' : '#f1f5f9',
                border: badge.unlocked ? '1px solid #bfdbfe' : 'none',
                color: badge.unlocked ? '#2563eb' : '#94a3b8',
              }}>
                {badge.icon === 'flame' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                )}
                {badge.icon === 'cards' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="13" height="13" x="9" y="9" rx="2" />
                    <rect width="13" height="13" x="2" y="2" rx="2" />
                  </svg>
                )}
                {badge.icon === 'network' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="4" rx="1" />
                    <rect x="2" y="18" width="6" height="4" rx="1" />
                    <rect x="16" y="18" width="6" height="4" rx="1" />
                    <path d="M12 6v6" />
                    <path d="M5 18v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" />
                  </svg>
                )}
                {badge.icon === 'trophy' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.15 }}>{badge.title}</span>
              {badge.subtitle && <span style={{ fontSize: '0.58rem', color: '#64748b', marginTop: '2px' }}>{badge.subtitle}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};