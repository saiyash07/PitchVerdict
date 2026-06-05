'use client';

import React, { useState } from 'react';
import { Player } from '@/lib/mockDb';

interface BroadcastPitchProps {
  teamName: string;
  formation: string;
  players: Player[];
  onPlayerSelect?: (player: Player) => void;
  selectedPlayerId?: string;
  accentColor?: string; // e.g. '#2b5cd3' for player indicator highlights
}

interface Coordinate {
  x: number; // percentage from left
  y: number; // percentage from top
}

function getPositionMatchScore(playerPos: string, slotPos: string): number {
  const p = playerPos.toUpperCase();
  const s = slotPos.toUpperCase();
  
  if (p === s) return 100;
  
  if (s === 'GK') return p === 'GK' ? 100 : 0;
  if (p === 'GK') return 0;
  
  if (s === 'CB') {
    if (p === 'CB') return 100;
    if (p === 'LB' || p === 'RB' || p === 'LWB' || p === 'RWB') return 80;
    if (p === 'CDM') return 60;
    return 20;
  }
  
  if (s === 'LB' || s === 'LWB') {
    if (p === 'LB' || p === 'LWB') return 100;
    if (p === 'LM' || p === 'LW') return 80;
    if (p === 'CB') return 60;
    if (p === 'RB' || p === 'RWB') return 40;
    return 20;
  }
  
  if (s === 'RB' || s === 'RWB') {
    if (p === 'RB' || p === 'RWB') return 100;
    if (p === 'RM' || p === 'RW') return 80;
    if (p === 'CB') return 60;
    if (p === 'LB' || p === 'LWB') return 40;
    return 20;
  }
  
  if (s === 'CDM') {
    if (p === 'CDM') return 100;
    if (p === 'CM') return 80;
    if (p === 'CB') return 50;
    return 20;
  }
  
  if (s === 'CM') {
    if (p === 'CM') return 100;
    if (p === 'CDM' || p === 'CAM') return 85;
    if (p === 'LM' || p === 'RM') return 75;
    return 20;
  }
  
  if (s === 'CAM') {
    if (p === 'CAM') return 100;
    if (p === 'CM') return 85;
    if (p === 'ST' || p === 'CF') return 75;
    if (p === 'LW' || p === 'RW') return 70;
    return 20;
  }
  
  if (s === 'LM') {
    if (p === 'LM' || p === 'LW') return 100;
    if (p === 'CM' || p === 'CAM') return 80;
    return 20;
  }
  
  if (s === 'RM') {
    if (p === 'RM' || p === 'RW') return 100;
    if (p === 'CM' || p === 'CAM') return 80;
    return 20;
  }
  
  if (s === 'LW') {
    if (p === 'LW') return 100;
    if (p === 'LM') return 90;
    if (p === 'RW') return 70;
    if (p === 'ST' || p === 'CF') return 60;
    return 20;
  }
  
  if (s === 'RW') {
    if (p === 'RW') return 100;
    if (p === 'RM') return 90;
    if (p === 'LW') return 70;
    if (p === 'ST' || p === 'CF') return 60;
    return 20;
  }
  
  if (s === 'ST' || s === 'CF') {
    if (p === 'ST' || p === 'CF') return 100;
    if (p === 'CAM') return 80;
    if (p === 'LW' || p === 'RW') return 75;
    return 20;
  }
  
  return 10;
}

function getCoordinatesForSquad(squad: Player[], formation: string): Record<string, Coordinate> {
  let slots: { pos: string; x: number; y: number }[] = [];
  
  if (formation === '3-5-2') {
    slots = [
      { pos: 'GK', x: 50, y: 77 },
      { pos: 'LWB', x: 12, y: 48 },
      { pos: 'RWB', x: 88, y: 48 },
      { pos: 'ST', x: 35, y: 16 },
      { pos: 'ST', x: 65, y: 16 },
      { pos: 'CB', x: 28, y: 63 },
      { pos: 'CB', x: 50, y: 65 },
      { pos: 'CB', x: 72, y: 63 },
      { pos: 'CDM', x: 50, y: 49 },
      { pos: 'CM', x: 32, y: 34 },
      { pos: 'CAM', x: 68, y: 34 }
    ];
  } else if (formation === '4-4-2') {
    slots = [
      { pos: 'GK', x: 50, y: 77 },
      { pos: 'LB', x: 15, y: 63 },
      { pos: 'RB', x: 85, y: 63 },
      { pos: 'LM', x: 15, y: 44 },
      { pos: 'RM', x: 85, y: 44 },
      { pos: 'ST', x: 35, y: 16 },
      { pos: 'ST', x: 65, y: 16 },
      { pos: 'CB', x: 35, y: 63 },
      { pos: 'CB', x: 65, y: 63 },
      { pos: 'CM', x: 38, y: 44 },
      { pos: 'CM', x: 62, y: 44 }
    ];
  } else {
    // 4-3-3 (Default)
    slots = [
      { pos: 'GK', x: 50, y: 77 },
      { pos: 'LB', x: 15, y: 63 },
      { pos: 'RB', x: 85, y: 63 },
      { pos: 'LW', x: 18, y: 18 },
      { pos: 'RW', x: 82, y: 18 },
      { pos: 'ST', x: 50, y: 15 },
      { pos: 'CB', x: 35, y: 63 },
      { pos: 'CB', x: 65, y: 63 },
      { pos: 'CDM', x: 50, y: 49 },
      { pos: 'CM', x: 28, y: 34 },
      { pos: 'CAM', x: 72, y: 34 }
    ];
  }

  const result: Record<string, Coordinate> = {};
  const unassigned = [...squad].slice(0, 11);
  
  for (const slot of slots) {
    let bestIdx = -1;
    let bestScore = -1;
    
    for (let i = 0; i < unassigned.length; i++) {
      const score = getPositionMatchScore(unassigned[i].position, slot.pos);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    
    if (bestIdx !== -1) {
      const matchedPlayer = unassigned.splice(bestIdx, 1)[0];
      result[matchedPlayer.id] = { x: slot.x, y: slot.y };
    }
  }
  
  // Assign any leftover players
  const remainingSlots = slots.slice(Object.keys(result).length);
  for (let i = 0; i < unassigned.length && i < remainingSlots.length; i++) {
    result[unassigned[i].id] = { x: remainingSlots[i].x, y: remainingSlots[i].y };
  }
  
  return result;
}

export default function BroadcastPitch({
  teamName,
  formation,
  players,
  onPlayerSelect,
  selectedPlayerId,
  accentColor = '#2b5cd3',
}: BroadcastPitchProps) {

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const getInitials = (name: string): string => {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sortPlayersForTv = (squad: Player[]): Player[] => {
    const order = ['GK', 'LWB', 'LB', 'CB', 'RB', 'RWB', 'LM', 'CDM', 'CM', 'CAM', 'RM', 'LW', 'RW', 'ST', 'CF'];
    return [...squad].sort((a, b) => {
      const idxA = order.indexOf(a.position);
      const idxB = order.indexOf(b.position);
      return idxA - idxB;
    });
  };

  const sortedPlayers = sortPlayersForTv(players);
  const coordsMap = getCoordinatesForSquad(players, formation);

  return (
    <div key={`${formation}-${teamName}`} className="pitch-container">
      <div className="pitch-greenfield" />
      
      {/* Animated scan line over green field */}
      <div className="pitch-scan-bar" />

      <div className="pitch-box-markings">
        <div className="pitch-line pitch-center-line" />
        <div className="pitch-center-circle" />
        <div className="pitch-line pitch-penalty-area-top" />
        <div className="pitch-line pitch-penalty-area-bottom" />
      </div>

      {sortedPlayers.slice(0, 11).map((player, index) => {
          const coord = coordsMap[player.id] || { x: 50, y: 50 };
          const isSelected = selectedPlayerId === player.id;
          const isFallbackUrl = player.photoUrl.includes('dicebear.com') || player.photoUrl.includes('initials');
          const hasImageError = imageErrors[player.id] || isFallbackUrl;
          
          // Classify card type based on overall player rating
          const cardTypeClass = player.ratingOverall >= 85 
            ? 'football-card-gold' 
            : player.ratingOverall >= 78 
            ? 'football-card-silver' 
            : 'football-card-bronze';

          return (
            <button
              key={player.id}
              onClick={() => onPlayerSelect?.(player)}
              className="player-node animate-reveal"
              style={{
                position: 'absolute',
                left: `${coord.x}%`,
                top: `${coord.y}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${index * 0.08}s`,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: isSelected ? 10 : 2,
                outline: 'none',
              }}
            >
              {/* Pulsing selection indicator ring */}
              {isSelected && <div className="animate-pulse-ring" style={{ borderColor: accentColor }} />}

              {/* Player Card Frame */}
              <div
                className={`player-badge-outer ${isSelected ? 'selected' : cardTypeClass}`}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: isSelected ? '#ffffff' : undefined,
                  border: isSelected ? `3px solid ${accentColor}` : undefined,
                  boxShadow: isSelected 
                    ? `0 0 20px ${accentColor}77, 0 4px 10px rgba(0,0,0,0.15)` 
                    : '0 4px 12px rgba(16, 46, 26, 0.15)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative'
                }}
              >
                {/* Avatar */}
                {hasImageError ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: isSelected 
                        ? `linear-gradient(135deg, ${accentColor} 0%, #0f172a 100%)` 
                        : 'rgba(0,0,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#ffffff' : '#0f172a',
                      fontWeight: 800,
                      fontSize: '13px',
                      letterSpacing: '0.02em',
                      textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    {getInitials(player.name)}
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImageErrors(prev => ({ ...prev, [player.id]: true }))}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />
                )}

                {/* Rating Badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  {player.ratingOverall}
                </span>

                {/* Number Badge */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    background: isSelected ? accentColor : '#0f172a',
                    color: '#ffffff',
                    fontSize: '8px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                  }}
                >
                  {player.number}
                </span>
              </div>

              {/* Player Label Info (Broadcast Style) */}
              <div
                style={{
                  marginTop: '8px',
                  background: isSelected ? accentColor : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: isSelected ? `1.5px solid ${accentColor}` : '1px solid rgba(22, 163, 74, 0.15)',
                  boxShadow: '0 4px 12px rgba(16, 46, 26, 0.06)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  maxWidth: '95px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ color: isSelected ? '#ffffff' : '#0f172a', fontSize: '10px', fontWeight: 800, lineHeight: 1.1 }}>
                  {player.name.split(' ').pop()}
                </div>
                <div style={{ color: isSelected ? 'rgba(255, 255, 255, 0.85)' : 'var(--text-muted)', fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', marginTop: '1px' }}>
                  {player.position}
                </div>
              </div>
            </button>
          );
        })}

      <style jsx global>{`
        .player-badge-outer:hover {
          transform: scale(1.15) !important;
          background: rgba(255, 255, 255, 1) !important;
          box-shadow: 0 8px 20px rgba(0,0,0,0.18) !important;
        }
        .player-node {
          transition: transform 0.2s ease;
        }
        .player-node:active {
          transform: translate(-50%, -50%) scale(0.95) !important;
        }
      `}</style>
    </div>
  );
}
