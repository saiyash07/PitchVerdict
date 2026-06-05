'use client';

import React, { useState } from 'react';
import { Player } from '@/lib/mockDb';
import { X, Sword } from 'lucide-react';

interface MatchupDuelProps {
  playerA: Player;
  playerB: Player;
  teamAName: string;
  teamBName: string;
  onClose: () => void;
  accentA?: string;
  accentB?: string;
}

export default function MatchupDuel({
  playerA,
  playerB,
  teamAName,
  teamBName,
  onClose,
  accentA = '#3b82f6',
  accentB = '#ef4444',
}: MatchupDuelProps) {
  const [imgErrA, setImgErrA] = useState(false);
  const [imgErrB, setImgErrB] = useState(false);

  const getInitials = (name: string): string => {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isFallbackA = playerA.photoUrl.includes('dicebear.com') || playerA.photoUrl.includes('initials');
  const isFallbackB = playerB.photoUrl.includes('dicebear.com') || playerB.photoUrl.includes('initials');
  const hasErrA = imgErrA || isFallbackA;
  const hasErrB = imgErrB || isFallbackB;

  // Radar Chart Settings
  const cx = 120;
  const cy = 120;
  const r = 80;
  const labels = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'];
  
  const getStatsArray = (player: Player) => [
    player.stats.pace,
    player.stats.shooting,
    player.stats.passing,
    player.stats.dribbling,
    player.stats.defending,
    player.stats.physical,
  ];

  const statsA = getStatsArray(playerA);
  const statsB = getStatsArray(playerB);

  // Calculate coordinates for a polygon
  const getCoordinatesString = (stats: number[]) => {
    return stats
      .map((val, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const x = cx + (val / 100) * r * Math.cos(angle);
        const y = cy + (val / 100) * r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const pointsA = getCoordinatesString(statsA);
  const pointsB = getCoordinatesString(statsB);

  // Concentric background grids (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPoints = gridLevels.map((level) => {
    return labels
      .map((_, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const x = cx + level * r * Math.cos(angle);
        const y = cy + level * r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  });

  return (
    <div
      className="glass-panel-heavy animate-reveal"
      style={{
        padding: '24px',
        position: 'relative',
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        border: '1px solid rgba(22, 163, 74, 0.15)',
        boxShadow: 'var(--shadow-premium)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sword size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Matchup Analysis</h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <X size={16} color="#0f172a" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="duel-grid">
        {/* Player A Details */}
        {(() => {
          const cardTypeBorder = playerA.ratingOverall >= 85 
            ? '2px solid #ca8a04' 
            : playerA.ratingOverall >= 78 
            ? '2px solid #94a3b8' 
            : '2px solid #b45309';
          const cardTypeShadow = playerA.ratingOverall >= 85 
            ? '0 8px 24px rgba(202, 138, 4, 0.1)' 
            : '0 8px 24px rgba(0, 0, 0, 0.02)';

          return (
            <div 
              className="player-detail-card" 
              style={{ 
                borderLeft: `4px solid ${accentA}`,
                border: cardTypeBorder,
                boxShadow: cardTypeShadow,
                background: 'rgba(255, 255, 255, 0.85)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {hasErrA ? (
                  <div
                    className="duel-avatar"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${accentA} 0%, #0f172a 100%)`,
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '13px',
                      letterSpacing: '0.02em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    {getInitials(playerA.name)}
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={playerA.photoUrl}
                    alt={playerA.name}
                    className="duel-avatar"
                    referrerPolicy="no-referrer"
                    onError={() => setImgErrA(true)}
                  />
                )}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{playerA.name}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{teamAName}</p>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span className="p-badge" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#0f172a' }}>#{playerA.number}</span>
                    <span className="p-badge" style={{ backgroundColor: 'rgba(22, 163, 74, 0.08)', color: 'var(--primary)' }}>{playerA.position}</span>
                  </div>
                </div>
              </div>
              
              <div className="rating-holder" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Overall Rating</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: accentA }}>{playerA.ratingOverall}</span>
              </div>
            </div>
          );
        })()}

        {/* SVG Radar Chart */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
            {/* Grid Circles / Hexagons */}
            {gridPoints.map((points, idx) => (
              <polygon
                key={idx}
                points={points}
                fill="none"
                stroke="rgba(15, 23, 42, 0.08)"
                strokeWidth="1"
              />
            ))}

            {/* Axis Lines */}
            {labels.map((_, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const x2 = cx + r * Math.cos(angle);
              const y2 = cy + r * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(15, 23, 42, 0.08)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axis Labels */}
            {labels.map((label, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const labelDistance = r + 16;
              const x = cx + labelDistance * Math.cos(angle);
              const y = cy + labelDistance * Math.sin(angle) + 4;
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="11px"
                  fontWeight="800"
                >
                  {label}
                </text>
              );
            })}

            {/* Polygon Player A */}
            <polygon
              points={pointsA}
              fill={`${accentA}22`}
              stroke={accentA}
              strokeWidth="2.5"
              style={{ transition: 'points 0.5s ease-in-out' }}
            />

            {/* Polygon Player B */}
            <polygon
              points={pointsB}
              fill={`${accentB}22`}
              stroke={accentB}
              strokeWidth="2.5"
              style={{ transition: 'points 0.5s ease-in-out' }}
            />
          </svg>
        </div>

        {/* Player B Details */}
        {(() => {
          const cardTypeBorder = playerB.ratingOverall >= 85 
            ? '2px solid #ca8a04' 
            : playerB.ratingOverall >= 78 
            ? '2px solid #94a3b8' 
            : '2px solid #b45309';
          const cardTypeShadow = playerB.ratingOverall >= 85 
            ? '0 8px 24px rgba(202, 138, 4, 0.1)' 
            : '0 8px 24px rgba(0, 0, 0, 0.02)';

          return (
            <div 
              className="player-detail-card" 
              style={{ 
                borderRight: `4px solid ${accentB}`,
                border: cardTypeBorder,
                boxShadow: cardTypeShadow,
                background: 'rgba(255, 255, 255, 0.85)',
                textAlign: 'right'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: 'row-reverse' }}>
                {hasErrB ? (
                  <div
                    className="duel-avatar"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${accentB} 0%, #0f172a 100%)`,
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '13px',
                      letterSpacing: '0.02em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    {getInitials(playerB.name)}
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={playerB.photoUrl}
                    alt={playerB.name}
                    className="duel-avatar"
                    referrerPolicy="no-referrer"
                    onError={() => setImgErrB(true)}
                  />
                )}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{playerB.name}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{teamBName}</p>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', justifyContent: 'flex-end' }}>
                    <span className="p-badge" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#0f172a' }}>#{playerB.number}</span>
                    <span className="p-badge" style={{ backgroundColor: 'rgba(22, 163, 74, 0.08)', color: 'var(--primary)' }}>{playerB.position}</span>
                  </div>
                </div>
              </div>

              <div className="rating-holder" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Overall Rating</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: accentB }}>{playerB.ratingOverall}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Comparison Stats Bar Table */}
      <div style={{ marginTop: '24px' }}>
        <h5 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '4px' }}>
          Stat Comparison
        </h5>
        
        {labels.map((lbl, idx) => {
          const valA = statsA[idx];
          const valB = statsB[idx];
          const sum = valA + valB;
          const pctA = sum > 0 ? (valA / sum) * 100 : 50;
          const pctB = sum > 0 ? (valB / sum) * 100 : 50;

          return (
            <div key={lbl} style={{ margin: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, marginBottom: '2px' }}>
                <span style={{ color: accentA }}>{valA}</span>
                <span style={{ color: 'var(--text-muted)' }}>{lbl}</span>
                <span style={{ color: accentB }}>{valB}</span>
              </div>
              <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.05)' }}>
                <div style={{ width: `${pctA}%`, backgroundColor: accentA, transition: 'width 0.4s' }} />
                <div style={{ width: `${pctB}%`, backgroundColor: accentB, transition: 'width 0.4s' }} />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .duel-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 16px;
          align-items: center;
        }
        .player-detail-card {
          padding: 16px;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .player-detail-card:hover {
          transform: translateY(-2px);
        }
        .duel-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 10px rgba(16, 46, 26, 0.15);
        }
        .p-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
        }
        @media (max-width: 600px) {
          .duel-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .player-detail-card {
            text-align: left !important;
            border-right: none !important;
            border-left: 4px solid var(--primary) !important;
          }
          .player-detail-card div {
            flex-direction: row !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
