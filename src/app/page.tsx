'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LEAGUES, SEASONS, generateTeamData, Player } from '@/lib/mockDb';
import BroadcastPitch from '@/components/BroadcastPitch';
import MatchupDuel from '@/components/MatchupDuel';
import ConfettiEffect from '@/components/ConfettiEffect';
import { Trophy, HelpCircle, Flame, Star, Play, RotateCcw } from 'lucide-react';

interface CommentaryEvent {
  minute: number;
  eventType: 'GOAL' | 'SAVE' | 'CARD' | 'TACKLE' | 'INFO';
  commentary: string;
  playerName?: string;
  teamId?: 'A' | 'B';
}

class StadiumAudio {
  private ctx: AudioContext | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private mainGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private roarGain: GainNode | null = null;
  private roarFilter: BiquadFilterNode | null = null;
  private isPlaying: boolean = false;

  constructor() {}

  private playWhistleSound(frequency = 2000, duration = 0.5, delay = 0) {
    if (!this.ctx || !this.mainGain || !this.isPlaying) return;
    
    const now = this.ctx.currentTime + delay;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 1.03, now); // Detune for natural beating

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(35, now); // Vibrating pea frequency

    lfoGain.gain.setValueAtTime(frequency * 0.05, now);

    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    whistleGain.gain.setValueAtTime(0, now);
    whistleGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    whistleGain.gain.setValueAtTime(0.12, now + duration - 0.08);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(whistleGain);
    osc2.connect(whistleGain);
    whistleGain.connect(this.mainGain);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    lfo.stop(now + duration + 0.1);
  }

  private playFanWhistleSound(delay = 0) {
    if (!this.ctx || !this.mainGain || !this.isPlaying) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 1400 + Math.random() * 500;
    const peakFreq = 2000 + Math.random() * 800;
    
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(peakFreq * 0.75, now + 0.35);

    whistleGain.gain.setValueAtTime(0, now);
    whistleGain.gain.linearRampToValueAtTime(0.04, now + 0.05);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(whistleGain);
    whistleGain.connect(this.mainGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  private playStadiumHorn(delay = 0, duration = 1.8) {
    if (!this.ctx || !this.mainGain || !this.isPlaying) return;

    const now = this.ctx.currentTime + delay;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const hornGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(115, now); // 115Hz fundamental stadium pitch

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(116.5, now); // Detuned for chorus thickness

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, now); // Horn body resonances
    filter.Q.setValueAtTime(2.0, now);

    // Rapid pulsation: "BZZT BZZT BZZT"
    const pulseOsc = this.ctx.createOscillator();
    const pulseGain = this.ctx.createGain();
    pulseOsc.type = 'square';
    pulseOsc.frequency.setValueAtTime(4.2, now); // 4.2Hz modulation rate
    pulseGain.gain.setValueAtTime(0.5, now);
    
    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(0.4, now);
    pulseOsc.connect(modGain);
    
    hornGain.gain.setValueAtTime(0, now);
    hornGain.gain.linearRampToValueAtTime(0.18, now + 0.15);
    hornGain.gain.setValueAtTime(0.18, now + duration - 0.2);
    hornGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(hornGain);
    modGain.connect(hornGain.gain); // Modulates volume to make it rattle
    hornGain.connect(this.mainGain);

    osc1.start(now);
    osc2.start(now);
    pulseOsc.start(now);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    pulseOsc.stop(now + duration + 0.1);
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Main Gain Node
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.mainGain.connect(this.ctx.destination);
      // Fade in the stadium hum over 2 seconds
      this.mainGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 2.0);

      // Create noise buffer (simulating crowd wash)
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filter approximation
        output[i] = 0.997 * lastOut + 0.003 * white;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }

      const whiteNoiseNode = this.ctx.createBufferSource();
      whiteNoiseNode.buffer = noiseBuffer;
      whiteNoiseNode.loop = true;

      // Low pass filter to make it sound like a distant crowd rumble
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.0, this.ctx.currentTime);

      // Connect noise source
      whiteNoiseNode.connect(this.filterNode);
      this.filterNode.connect(this.mainGain);
      whiteNoiseNode.start();

      // Add low pitch oscillators to simulate crowd hum (drones)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(105, this.ctx.currentTime); // A2 pitch area
      
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(135, this.ctx.currentTime);

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      const droneFilter = this.ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

      this.droneOsc1.connect(droneFilter);
      this.droneOsc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(this.mainGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      // Setup occasional cheer/roar node
      this.roarGain = this.ctx.createGain();
      this.roarGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      // Create goal cheer sound path (higher filter freq, louder)
      const cheerNoiseNode = this.ctx.createBufferSource();
      cheerNoiseNode.buffer = noiseBuffer;
      cheerNoiseNode.loop = true;

      this.roarFilter = this.ctx.createBiquadFilter();
      this.roarFilter.type = 'bandpass';
      this.roarFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.roarFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      cheerNoiseNode.connect(this.roarFilter);
      this.roarFilter.connect(this.roarGain);
      this.roarGain.connect(this.mainGain);
      cheerNoiseNode.start();

      // Continuous modulation to simulate crowd waves/movement
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // slow wave
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(this.mainGain.gain);
      lfo.start();

      // Schedule Kick-off whistle blares
      this.playWhistleSound(2000, 0.15, 0.1);
      this.playWhistleSound(2000, 0.15, 0.4);
      this.playWhistleSound(1800, 0.60, 0.7);

    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  triggerGoalRoar() {
    if (!this.ctx || !this.roarGain || !this.roarFilter) return;
    
    const now = this.ctx.currentTime;
    
    // Quick burst of massive loudness (boosted to 2.8x)
    this.roarGain.gain.cancelScheduledValues(now);
    this.roarGain.gain.setValueAtTime(this.roarGain.gain.value, now);
    this.roarGain.gain.linearRampToValueAtTime(2.8, now + 0.35);
    
    // Modulate filter frequency to simulate high energy crowd screaming
    this.roarFilter.frequency.cancelScheduledValues(now);
    this.roarFilter.frequency.setValueAtTime(380, now);
    this.roarFilter.frequency.exponentialRampToValueAtTime(1100, now + 0.45);
    
    // Slowly fade out the roar back to base crowd murmur over 5.5 seconds
    this.roarGain.gain.exponentialRampToValueAtTime(0.01, now + 5.5);
    this.roarFilter.frequency.exponentialRampToValueAtTime(450, now + 5.5);
    
    // General crowd rumble volume surge
    if (this.mainGain) {
      this.mainGain.gain.cancelScheduledValues(now);
      this.mainGain.gain.setValueAtTime(this.mainGain.gain.value, now);
      this.mainGain.gain.linearRampToValueAtTime(0.85, now + 0.25);
      this.mainGain.gain.exponentialRampToValueAtTime(0.25, now + 6.0);
    }

    // Play referee whistle for goal validation
    this.playWhistleSound(1950, 0.7, 0.0);

    // Play intense celebration whistles in the crowd
    this.playFanWhistleSound(0.1);
    this.playFanWhistleSound(0.22);
    this.playFanWhistleSound(0.35);
    this.playFanWhistleSound(0.55);
    this.playFanWhistleSound(0.75);
    this.playFanWhistleSound(0.98);
    this.playFanWhistleSound(1.25);
    this.playFanWhistleSound(1.6);

    // Play stadium airhorn!
    this.playStadiumHorn(0.2, 2.2);
  }

  triggerBooing() {
    if (!this.ctx || !this.roarGain || !this.roarFilter || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    
    // Quick ramp up of booing
    this.roarGain.gain.cancelScheduledValues(now);
    this.roarGain.gain.setValueAtTime(this.roarGain.gain.value, now);
    this.roarGain.gain.linearRampToValueAtTime(1.4, now + 0.4);

    // Booing has a lower, flatter frequency (around 220Hz - 260Hz)
    this.roarFilter.frequency.cancelScheduledValues(now);
    this.roarFilter.frequency.setValueAtTime(320, now);
    this.roarFilter.frequency.exponentialRampToValueAtTime(230, now + 0.5);

    // Fade out booing over 4 seconds
    this.roarGain.gain.exponentialRampToValueAtTime(0.01, now + 4.0);
    this.roarFilter.frequency.exponentialRampToValueAtTime(320, now + 4.0);

    if (this.mainGain) {
      this.mainGain.gain.cancelScheduledValues(now);
      this.mainGain.gain.setValueAtTime(this.mainGain.gain.value, now);
      this.mainGain.gain.linearRampToValueAtTime(0.55, now + 0.3);
      this.mainGain.gain.exponentialRampToValueAtTime(0.25, now + 4.5);
    }

    // Play referee whistle for foul / away goal
    this.playWhistleSound(1800, 0.55, 0.0);
  }

  triggerSaveReaction() {
    if (!this.ctx || !this.roarGain || !this.roarFilter) return;

    const now = this.ctx.currentTime;

    // A sudden gasp/sigh reaction (shorter roar, lower freq)
    this.roarGain.gain.cancelScheduledValues(now);
    this.roarGain.gain.setValueAtTime(this.roarGain.gain.value, now);
    this.roarGain.gain.linearRampToValueAtTime(0.9, now + 0.15);

    this.roarFilter.frequency.cancelScheduledValues(now);
    this.roarFilter.frequency.setValueAtTime(400, now);
    this.roarFilter.frequency.linearRampToValueAtTime(250, now + 0.5);

    this.roarGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
    
    if (this.mainGain) {
      this.mainGain.gain.cancelScheduledValues(now);
      this.mainGain.gain.setValueAtTime(this.mainGain.gain.value, now);
      this.mainGain.gain.linearRampToValueAtTime(0.45, now + 0.15);
      this.mainGain.gain.exponentialRampToValueAtTime(0.25, now + 2.5);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.ctx && this.mainGain) {
      const now = this.ctx.currentTime;
      try {
        this.mainGain.gain.cancelScheduledValues(now);
        this.mainGain.gain.setValueAtTime(this.mainGain.gain.value, now);
        this.mainGain.gain.linearRampToValueAtTime(0, now + 1.2);
        
        const currentContext = this.ctx;
        setTimeout(() => {
          if (!this.isPlaying && currentContext.state !== 'closed') {
            currentContext.close();
          }
        }, 1300);
      } catch (e) {
        console.warn(e);
      }
      this.ctx = null;
    }
  }
}

export default function Home() {
  const audioManagerRef = useRef<StadiumAudio | null>(null);

  useEffect(() => {
    audioManagerRef.current = new StadiumAudio();
    return () => {
      audioManagerRef.current?.stop?.();
    };
  }, []);

  // Mouse position state for interactive background parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized offset (-15px to 15px) based on screen center
      const offsetX = (e.clientX / window.innerWidth - 0.5) * 30;
      const offsetY = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x: offsetX, y: offsetY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // --- STATE ---
  // Team A Selection
  const [leagueA, setLeagueA] = useState('pl');
  const [seasonA, setSeasonA] = useState('2023-2024');
  const [teamAName, setTeamAName] = useState('Arsenal');
  const [formationA, setFormationA] = useState('4-3-3');
  const [styleA, setStyleA] = useState('Tiki-Taka');
  const [mentalityA, setMentalityA] = useState('balanced');

  // Team B Selection
  const [leagueB, setLeagueB] = useState('la-liga');
  const [seasonB, setSeasonB] = useState('2023-2024');
  const [teamBName, setTeamBName] = useState('Real Madrid');
  const [formationB, setFormationB] = useState('4-3-3');
  const [styleB, setStyleB] = useState('Direct Counter');
  const [mentalityB, setMentalityB] = useState('balanced');

  // Resolved Teams
  const teamA = useMemo(() => generateTeamData(teamAName, leagueA, seasonA), [teamAName, leagueA, seasonA]);
  const teamB = useMemo(() => generateTeamData(teamBName, leagueB, seasonB), [teamBName, leagueB, seasonB]);

  // Player Matchup Selections
  const [selectedPlayerA, setSelectedPlayerA] = useState<Player | null>(null);
  const [selectedPlayerB, setSelectedPlayerB] = useState<Player | null>(null);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSimComplete, setIsSimComplete] = useState(false);
  const [simCommentary, setSimCommentary] = useState<CommentaryEvent[]>([]);
  const [visibleCommentary, setVisibleCommentary] = useState<CommentaryEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [gameClock, setGameClock] = useState(1);
  const [simScoreA, setSimScoreA] = useState(0);
  const [simScoreB, setSimScoreB] = useState(0);
  const [scoreAPop, setScoreAPop] = useState(false);
  const [scoreBPop, setScoreBPop] = useState(false);

  // Live Stats
  const [statPossessionA, setStatPossessionA] = useState(50);
  const [statShotsA, setStatShotsA] = useState(0);
  const [statShotsB, setStatShotsB] = useState(0);
  const [statCardsA, setStatCardsA] = useState(0);
  const [statCardsB, setStatCardsB] = useState(0);

  const commentaryEndRef = useRef<HTMLDivElement>(null);

  // Adjust defaults when leagues change
  const handleLeagueAChange = (newLeague: string) => {
    setLeagueA(newLeague);
    const selectedLeague = LEAGUES.find((l) => l.id === newLeague);
    if (selectedLeague && selectedLeague.teams.length > 0) {
      const match = selectedLeague.teams.find(t => t === 'Arsenal' || t === 'Manchester City' || t === 'Paris Saint-Germain') || selectedLeague.teams[0];
      setTeamAName(match);
    }
  };

  const handleLeagueBChange = (newLeague: string) => {
    setLeagueB(newLeague);
    const selectedLeague = LEAGUES.find((l) => l.id === newLeague);
    if (selectedLeague && selectedLeague.teams.length > 0) {
      const match = selectedLeague.teams.find(t => t === 'Real Madrid' || t === 'Barcelona' || t === 'Bayern Munich') || selectedLeague.teams[0];
      setTeamBName(match);
    }
  };

  // Handle auto duel matching
  useEffect(() => {
    if (selectedPlayerA && selectedPlayerB) {
      const duelEl = document.getElementById('duel-container');
      if (duelEl) {
        duelEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedPlayerA, selectedPlayerB]);

  // Auto scroll commentary ticker
  useEffect(() => {
    if (commentaryEndRef.current) {
      commentaryEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleCommentary]);

  // Ticker Interval Logic
  useEffect(() => {
    if (!isSimulating) return;

    let interval: NodeJS.Timeout;
    if (currentEventIndex < simCommentary.length) {
      interval = setInterval(() => {
        const nextEvent = simCommentary[currentEventIndex];
        setGameClock(nextEvent.minute);
        setVisibleCommentary((prev) => [...prev, nextEvent]);

        // Trigger crowd noises based on events
        if (nextEvent.eventType === 'GOAL') {
          if (nextEvent.teamId === 'A') {
            audioManagerRef.current?.triggerGoalRoar?.();
          } else {
            audioManagerRef.current?.triggerBooing?.();
          }
        } else if (nextEvent.eventType === 'SAVE') {
          audioManagerRef.current?.triggerSaveReaction?.();
        } else if (nextEvent.eventType === 'CARD') {
          audioManagerRef.current?.triggerBooing?.();
        }

        // Process stats
        if (nextEvent.eventType === 'GOAL') {
          if (nextEvent.teamId === 'A') {
            setSimScoreA((prev) => prev + 1);
            setScoreAPop(true);
            setTimeout(() => setScoreAPop(false), 600);
            setStatShotsA((prev) => prev + 1);
          } else {
            setSimScoreB((prev) => prev + 1);
            setScoreBPop(true);
            setTimeout(() => setScoreBPop(false), 600);
            setStatShotsB((prev) => prev + 1);
          }
        } else if (nextEvent.eventType === 'SAVE') {
          if (nextEvent.teamId === 'A') {
            setStatShotsB((prev) => prev + 1);
          } else {
            setStatShotsA((prev) => prev + 1);
          }
        } else if (nextEvent.eventType === 'CARD') {
          if (nextEvent.teamId === 'A') {
            setStatCardsA((prev) => prev + 1);
          } else {
            setStatCardsB((prev) => prev + 1);
          }
        }

        // Fluctuate possession
        const basePossession = styleA === 'Tiki-Taka' ? 57 : styleB === 'Tiki-Taka' ? 43 : 50;
        const randomness = Math.floor(Math.random() * 9) - 4;
        setStatPossessionA(Math.max(30, Math.min(70, basePossession + randomness)));

        setCurrentEventIndex((prev) => prev + 1);
      }, 2000);
    } else if (simCommentary.length > 0) {
      // Defer state updates to next tick to avoid synchronous setState inside render/effect cycles
      const timer = setTimeout(() => {
        setIsSimulating(false);
        setIsSimComplete(true);
        audioManagerRef.current?.stop?.();
      }, 0);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [isSimulating, currentEventIndex, simCommentary, styleA, styleB]);

  const handleStartSimulation = async () => {
    if (!teamA || !teamB) return;

    setSimScoreA(0);
    setSimScoreB(0);
    setStatShotsA(0);
    setStatShotsB(0);
    setStatCardsA(0);
    setStatCardsB(0);
    setStatPossessionA(50);
    setGameClock(1);
    setVisibleCommentary([]);
    setCurrentEventIndex(0);
    setIsSimComplete(false);
    setIsSimulating(true);

    // Start background crowd sound
    audioManagerRef.current?.start?.();

    setTimeout(() => {
      const simEl = document.getElementById('simulation-section');
      if (simEl) simEl.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamA,
          teamB,
          tacticsA: { mentality: mentalityA, style: styleA },
          tacticsB: { mentality: mentalityB, style: styleB }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSimCommentary(data.commentary);
      } else {
        throw new Error('Simulation failed');
      }
    } catch (err) {
      console.error(err);
      setIsSimulating(false);
    }
  };

  const handleResetSimulation = () => {
    setIsSimComplete(false);
    setIsSimulating(false);
    setSimCommentary([]);
    setVisibleCommentary([]);
    setCurrentEventIndex(0);
    setSimScoreA(0);
    setSimScoreB(0);

    // Stop crowd sound
    audioManagerRef.current?.stop?.();

    const setupEl = document.getElementById('setup-section');
    if (setupEl) setupEl.scrollIntoView({ behavior: 'smooth' });
  };

  const selectedLeagueA = LEAGUES.find(l => l.id === leagueA);
  const selectedLeagueB = LEAGUES.find(l => l.id === leagueB);

  const winner = useMemo(() => {
    if (!isSimComplete) return null;
    if (simScoreA > simScoreB) return teamA;
    if (simScoreB > simScoreA) return teamB;
    return null;
  }, [isSimComplete, simScoreA, simScoreB, teamA, teamB]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Drifting dots tactical background layer */}
      <div className="tactical-grid-bg" style={{ transform: `translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px)` }} />

      {/* Floating Tactical Chalkboard SVGs (Drifting & Parallax) */}
      <svg className="floating-tactical-item" style={{ top: '15%', left: '8%', width: '130px', height: '130px', animation: 'drift-slow 22s ease-in-out infinite', transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)` }} viewBox="0 0 100 100">
        <circle cx="20" cy="80" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="80" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M25 75 Q 40 30, 75 25" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
        <path d="M72 30 L 76 24 L 69 25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="16" y="93" fill="currentColor" fontSize="8" fontWeight="bold">CM</text>
        <text x="82" y="15" fill="currentColor" fontSize="8" fontWeight="bold">ST</text>
      </svg>

      <svg className="floating-tactical-item" style={{ top: '45%', right: '5%', width: '160px', height: '160px', animation: 'drift-slow 28s ease-in-out infinite 2s', transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }} viewBox="0 0 100 100">
        <rect x="10" y="20" width="80" height="60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <path d="M20 50 H 80" stroke="currentColor" strokeWidth="1" />
        <path d="M35 30 L 48 48" stroke="currentColor" strokeWidth="1.5" />
        <path d="M47 43 L 49 49 L 43 47" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="35" cy="30" r="3" fill="currentColor" />
        <circle cx="48" cy="48" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <svg className="floating-tactical-item" style={{ bottom: '10%', left: '5%', width: '110px', height: '110px', animation: 'drift-slow 20s ease-in-out infinite 1s', transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }} viewBox="0 0 100 100">
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
        <text x="54" y="46" fill="currentColor" fontSize="7">Press Area</text>
      </svg>

      <svg className="floating-tactical-item" style={{ bottom: '12%', right: '10%', width: '140px', height: '140px', animation: 'drift-slow 25s ease-in-out infinite 3s', transform: `translate(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px)` }} viewBox="0 0 100 100">
        <polygon points="20,70 80,70 50,25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="20" cy="70" r="3" fill="currentColor" />
        <circle cx="80" cy="70" r="3" fill="currentColor" />
        <circle cx="50" cy="25" r="3" fill="currentColor" />
        <path d="M22 65 Q 40 40, 47 29" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M42 32 L 48 28 L 47 35" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="14" y="82" fill="currentColor" fontSize="8" fontWeight="bold">LB</text>
        <text x="80" y="82" fill="currentColor" fontSize="8" fontWeight="bold">RB</text>
        <text x="46" y="18" fill="currentColor" fontSize="8" fontWeight="bold">DM</text>
      </svg>
      
      {/* Background Blobs for Glassmorphism depth */}
      <div className="bg-blob bg-blob-1" style={{ transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px) scale(1.05)` }} />
      <div className="bg-blob bg-blob-2" style={{ transform: `translate(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px) scale(1.02)` }} />
      <div className="bg-blob bg-blob-3" style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px) scale(0.98)` }} />

      {/* Header Broadcaster */}
      <header
        className="glass-panel-heavy"
        style={{
          margin: '20px 20px 0 20px',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '20px',
          border: '1px solid rgba(22, 163, 74, 0.2)',
          boxShadow: 'var(--shadow-premium)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)',
              color: '#ffffff'
            }}
          >
            {/* Soccer Ball Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m12 12-3-3m3 3 3-3m-3 3-2 5m2-5 2 5m-2-5v-7" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.75px', color: '#0f172a', lineHeight: 1.1, fontFamily: 'var(--font-sans)' }}>
              PitchVerdict
            </h1>
            <p style={{ fontSize: '9px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Tactical Match Simulator
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
          <span style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Top 10 Leagues</span>
          <span>•</span>
          <span style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Past 5 Seasons</span>
          <span>•</span>
          <span style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>AI Punditry</span>
        </div>
      </header>

      {/* Main Workspace */}
      <main style={{ flex: 1, padding: '20px', maxWidth: '1400px', width: '100%', margin: '0 auto', zIndex: 1 }}>
        
        {/* Setup Section */}
        <section id="setup-section" style={{ scrollMarginTop: '20px' }}>
          <div className="setup-grid">
            
            {/* Team A Setup Panel */}
            <div className="glass-panel-heavy" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="team-badge-indicator" style={{ background: '#2563eb', color: '#ffffff' }}>TEAM A</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>HOME</span>
              </div>

              {/* Selector fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="input-label">League</label>
                  <select className="select-field" value={leagueA} onChange={(e) => handleLeagueAChange(e.target.value)}>
                    {LEAGUES.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Season</label>
                  <select className="select-field" value={seasonA} onChange={(e) => setSeasonA(e.target.value)}>
                    {SEASONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Club Team</label>
                <select className="select-field" value={teamAName} onChange={(e) => setTeamAName(e.target.value)}>
                  {selectedLeagueA?.teams.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Tactics Panel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.01)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)' }}>
                <div>
                  <label className="input-label">Formation</label>
                  <select className="select-field" value={formationA} onChange={(e) => setFormationA(e.target.value)}>
                    <option value="4-3-3">4-3-3</option>
                    <option value="4-4-2">4-4-2</option>
                    <option value="3-5-2">3-5-2</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Playstyle</label>
                  <select className="select-field" value={styleA} onChange={(e) => setStyleA(e.target.value)}>
                    <option value="Tiki-Taka">Tiki-Taka</option>
                    <option value="Gegenpressing">Gegenpressing</option>
                    <option value="Direct Counter">Direct Counter</option>
                    <option value="Long Ball">Long Ball</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Mentality</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {['defensive', 'balanced', 'attacking'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMentalityA(m)}
                        className={`mentality-btn ${mentalityA === m ? 'active' : ''}`}
                        style={{
                          flex: 1,
                          padding: '7px 0',
                          fontSize: '11px',
                          fontWeight: 800,
                          borderRadius: '8px',
                          border: mentalityA === m ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.08)',
                          background: mentalityA === m ? 'rgba(22, 163, 74, 0.08)' : 'rgba(255,255,255,0.45)',
                          color: mentalityA === m ? 'var(--primary)' : 'var(--text-muted)',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          boxShadow: mentalityA === m ? '0 4px 12px rgba(22, 163, 74, 0.15)' : 'none',
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pitch Display A */}
              {teamA && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Team Lineup (GK First)
                  </h4>
                  <BroadcastPitch
                    teamName={teamA.name}
                    formation={formationA}
                    players={teamA.players}
                    onPlayerSelect={(p) => setSelectedPlayerA(p)}
                    selectedPlayerId={selectedPlayerA?.id}
                    accentColor="#2563eb"
                  />
                </div>
              )}
            </div>

            {/* Team B Setup Panel */}
            <div className="glass-panel-heavy" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="team-badge-indicator" style={{ background: '#dc2626', color: '#ffffff' }}>TEAM B</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>AWAY</span>
              </div>

              {/* Selector fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="input-label">League</label>
                  <select className="select-field" value={leagueB} onChange={(e) => handleLeagueBChange(e.target.value)}>
                    {LEAGUES.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Season</label>
                  <select className="select-field" value={seasonB} onChange={(e) => setSeasonB(e.target.value)}>
                    {SEASONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Club Team</label>
                <select className="select-field" value={teamBName} onChange={(e) => setTeamBName(e.target.value)}>
                  {selectedLeagueB?.teams.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Tactics Panel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.01)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)' }}>
                <div>
                  <label className="input-label">Formation</label>
                  <select className="select-field" value={formationB} onChange={(e) => setFormationB(e.target.value)}>
                    <option value="4-3-3">4-3-3</option>
                    <option value="4-4-2">4-4-2</option>
                    <option value="3-5-2">3-5-2</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Playstyle</label>
                  <select className="select-field" value={styleB} onChange={(e) => setStyleB(e.target.value)}>
                    <option value="Tiki-Taka">Tiki-Taka</option>
                    <option value="Gegenpressing">Gegenpressing</option>
                    <option value="Direct Counter">Direct Counter</option>
                    <option value="Long Ball">Long Ball</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Mentality</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {['defensive', 'balanced', 'attacking'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMentalityB(m)}
                        className={`mentality-btn ${mentalityB === m ? 'active' : ''}`}
                        style={{
                          flex: 1,
                          padding: '7px 0',
                          fontSize: '11px',
                          fontWeight: 800,
                          borderRadius: '8px',
                          border: mentalityB === m ? '2px solid var(--accent-red)' : '1px solid rgba(0,0,0,0.08)',
                          background: mentalityB === m ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.45)',
                          color: mentalityB === m ? 'var(--accent-red)' : 'var(--text-muted)',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          boxShadow: mentalityB === m ? '0 4px 12px rgba(220, 38, 38, 0.15)' : 'none',
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pitch Display B */}
              {teamB && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Team Lineup (GK First)
                  </h4>
                  <BroadcastPitch
                    teamName={teamB.name}
                    formation={formationB}
                    players={teamB.players}
                    onPlayerSelect={(p) => setSelectedPlayerB(p)}
                    selectedPlayerId={selectedPlayerB?.id}
                    accentColor="#dc2626"
                  />
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Player Matchup Duel Section */}
        {selectedPlayerA && selectedPlayerB && teamA && teamB && (
          <section id="duel-container" style={{ margin: '40px 0', scrollMarginTop: '20px' }}>
            <MatchupDuel
              playerA={selectedPlayerA}
              playerB={selectedPlayerB}
              teamAName={teamA.name}
              teamBName={teamB.name}
              accentA="#2563eb"
              accentB="#dc2626"
              onClose={() => {
                setSelectedPlayerA(null);
                setSelectedPlayerB(null);
              }}
            />
          </section>
        )}

        {/* Prompt to compare players */}
        {(!selectedPlayerA || !selectedPlayerB) && (
          <div
            className="glass-panel"
            style={{
              margin: '30px 0',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}
          >
            <HelpCircle size={16} />
            <span>Tip: Click a player card on Pitch A AND a player card on Pitch B to view a detailed head-to-head radar analysis.</span>
          </div>
        )}

        {/* Simulation Trigger Button */}
        {teamA && teamB && !isSimulating && !isSimComplete && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <button
              onClick={handleStartSimulation}
              className="action-btn-main"
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '16px 48px',
                fontSize: '16px',
                fontWeight: 800,
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(15,23,42,0.25)',
                transition: 'all 0.2s'
              }}
            >
              <Play fill="#ffffff" size={16} />
              <span>KICK-OFF SIMULATION</span>
            </button>
          </div>
        )}

        {/* Live Simulation Screen Section */}
        {(isSimulating || isSimComplete) && teamA && teamB && (
          <section
            id="simulation-section"
            className="glass-panel-heavy animate-reveal"
            style={{
              margin: '40px 0',
              padding: '30px',
              scrollMarginTop: '20px',
              border: '1.5px solid rgba(255,255,255,0.75)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.04)'
            }}
          >
            {winner && <ConfettiEffect />}

            {winner && (
              <div
                className="celebration-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%), url(/images/stadium_crowd.png) center/cover no-repeat',
                  border: '2px solid rgba(251, 191, 36, 0.5)',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  marginBottom: '30px',
                  boxShadow: '0 15px 35px rgba(245, 158, 11, 0.15), inset 0 0 40px rgba(0, 0, 0, 0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0) 70%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Trophy size={48} color="#f59e0b" style={{ margin: '0 auto 12px auto', filter: 'drop-shadow(0 4px 6px rgba(245,158,11,0.3))' }} className="animate-bounce-slow" />
                  <h3 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#f59e0b', margin: '0 0 4px 0' }}>
                    Champions
                  </h3>
                  <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.5)', margin: '0 0 8px 0' }}>
                    {winner.name}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600, maxWidth: '400px', margin: '0 auto' }}>
                    A spectacular tactical masterclass seals the victory in the {winner.season} campaign!
                  </p>
                </div>
              </div>
            )}

            {/* Scoreboard Broadcast Bar */}
            <div
              className="glass-panel"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 32px',
                background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.82) 0%, rgba(15, 23, 42, 0.92) 100%), url(/images/stadium_crowd.png) center/cover no-repeat',
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                borderRadius: '16px',
                marginBottom: '30px',
                boxShadow: '0 12px 30px rgba(16, 46, 26, 0.15), inset 0 0 30px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Home Team */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <span className="p-badge" style={{ background: '#2563eb', color: '#ffffff', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px' }}>HOME</span>
                <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{teamA.name}</span>
              </div>

              {/* Scoreboard display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div 
                  className={scoreAPop ? 'score-pop' : ''} 
                  style={{ 
                    fontSize: '38px', 
                    fontWeight: 900, 
                    fontFamily: 'var(--font-mono)', 
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    transition: 'transform 0.1s ease-in-out'
                  }}
                >
                  {simScoreA}
                </div>
                
                {/* Timer container */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    minWidth: '80px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                    {gameClock}&apos;
                  </span>
                  <div style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.5px', marginTop: '1px' }}>
                    {isSimComplete ? 'FULL TIME' : 'LIVE'}
                  </div>
                </div>

                <div 
                  className={scoreBPop ? 'score-pop' : ''} 
                  style={{ 
                    fontSize: '38px', 
                    fontWeight: 900, 
                    fontFamily: 'var(--font-mono)', 
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    transition: 'transform 0.1s ease-in-out'
                  }}
                >
                  {simScoreB}
                </div>
              </div>

              {/* Away Team */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, flexDirection: 'row-reverse' }}>
                <span className="p-badge" style={{ background: '#dc2626', color: '#ffffff', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px' }}>AWAY</span>
                <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{teamB.name}</span>
              </div>
            </div>

            <div className="sim-layout">
              {/* Left Column: Live match report commentary list */}
              <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', height: '400px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={14} color="#d97706" /> Live Commentary Feed
                </h4>
                
                {/* Commentary Box Container */}
                <div
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {visibleCommentary.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '13px', gap: '12px' }}>
                      {/* Soccer Ball Spinner */}
                      <svg className="animate-spin-ball" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" stroke="var(--primary)" strokeWidth="2" fill="#ffffff" />
                        <polygon points="12,9.5 14.37,11.23 13.47,14.02 10.53,14.02 9.63,11.23" fill="#0f172a" />
                        <line x1="12" y1="9.5" x2="12" y2="2" />
                        <line x1="14.37" y1="11.23" x2="21.5" y2="9" />
                        <line x1="13.47" y1="14.02" x2="18" y2="21" />
                        <line x1="10.53" y1="14.02" x2="6" y2="21" />
                        <line x1="9.63" y1="11.23" x2="2.5" y2="9" />
                      </svg>
                      <span style={{ fontWeight: 600 }}>Establishing satellite link... Analyzing team formations...</span>
                    </div>
                  )}

                  {visibleCommentary.map((log, index) => {
                    const isGoal = log.eventType === 'GOAL';
                    const isSave = log.eventType === 'SAVE';
                    const isCard = log.eventType === 'CARD';

                    return (
                      <div
                        key={index}
                        className="animate-reveal"
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: isGoal 
                            ? 'rgba(217, 119, 6, 0.08)' 
                            : isCard 
                            ? 'rgba(220, 38, 38, 0.06)'
                            : 'rgba(255,255,255,0.7)',
                          borderLeft: isGoal 
                            ? '4px solid var(--accent-gold)' 
                            : isCard 
                            ? '4px solid var(--accent-red)' 
                            : isSave 
                            ? '4px solid var(--primary)'
                            : '1px solid rgba(0,0,0,0.03)'
                        }}
                      >
                        {/* Time marker */}
                        <span style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)', background: 'rgba(22, 163, 74, 0.08)', border: '1px solid rgba(22, 163, 74, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                          {log.minute}&apos;
                        </span>

                        <div style={{ flex: 1 }}>
                          {/* Event type tags */}
                          {isGoal && (
                            <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', marginRight: '6px', letterSpacing: '0.5px' }}>
                              [GOAL]
                            </span>
                          )}
                          {isSave && (
                            <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginRight: '6px', letterSpacing: '0.5px' }}>
                              [SAVE]
                            </span>
                          )}
                          {isCard && (
                            <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', marginRight: '6px', letterSpacing: '0.5px' }}>
                              [BOOKING]
                            </span>
                          )}
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a', lineHeight: 1.4 }}>
                            {log.commentary}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={commentaryEndRef} />
                </div>
              </div>

              {/* Right Column: Live Match stats gauges */}
              <div className="stats-panel" style={{ flex: 1 }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={14} color="var(--primary)" /> Match Stats
                </h4>
                
                <div style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '20px' }}>
                  
                  {/* Possession gauge */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', fontSize: '11px', fontWeight: 700, marginBottom: '6px', justifyContent: 'space-between' }}>
                      <span>{statPossessionA}%</span>
                      <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Possession</span>
                      <span>{100 - statPossessionA}%</span>
                    </div>
                    <div style={{ height: '10px', borderRadius: '5px', display: 'flex', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.06)', border: '1.5px solid rgba(255,255,255,0.7)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div style={{ width: `${statPossessionA}%`, background: '#2563eb', transition: 'width 0.5s' }} />
                      <div style={{ width: `${100 - statPossessionA}%`, background: '#dc2626', transition: 'width 0.5s' }} />
                    </div>
                  </div>

                  {/* Shots gauge */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', fontSize: '11px', fontWeight: 700, marginBottom: '6px', justifyContent: 'space-between' }}>
                      <span>{statShotsA}</span>
                      <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shots on Target</span>
                      <span>{statShotsB}</span>
                    </div>
                    <div style={{ height: '10px', borderRadius: '5px', display: 'flex', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.06)', border: '1.5px solid rgba(255,255,255,0.7)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div style={{ width: statShotsA + statShotsB > 0 ? `${(statShotsA / (statShotsA + statShotsB)) * 100}%` : '50%', background: '#2563eb', transition: 'width 0.5s' }} />
                      <div style={{ width: statShotsA + statShotsB > 0 ? `${(statShotsB / (statShotsA + statShotsB)) * 100}%` : '50%', background: '#dc2626', transition: 'width 0.5s' }} />
                    </div>
                  </div>

                  {/* Cards counter */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ fontWeight: 800, color: '#2563eb' }}>{statCardsA}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bookings</span>
                    <span style={{ fontWeight: 800, color: '#dc2626' }}>{statCardsB}</span>
                  </div>

                  {/* Playstyles detail */}
                  <div style={{ marginTop: '20px' }}>
                    <h5 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Tactical Setup</h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#2563eb' }}>{styleA}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{formationA} • {mentalityA}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: '#dc2626' }}>{styleB}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{formationB} • {mentalityB}</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Post Match day controls */}
            {isSimComplete && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '30px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '24px' }}>
                <button
                  onClick={handleResetSimulation}
                  className="action-btn-secondary"
                  style={{
                    background: 'rgba(0,0,0,0.06)',
                    color: '#0f172a',
                    border: 'none',
                    padding: '12px 32px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <RotateCcw size={14} />
                  <span>BACK TO TACTICS</span>
                </button>

                <button
                  onClick={handleStartSimulation}
                  className="action-btn-main"
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 32px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Trophy size={14} />
                  <span>REPLAY MATCH</span>
                </button>
              </div>
            )}
          </section>
        )}

      </main>

      {/* Footer */}
      <footer style={{ background: '#f8fafc', color: 'rgba(15, 23, 42, 0.5)', padding: '24px 20px', textAlign: 'center', fontSize: '12px', borderTop: '1px solid rgba(0, 0, 0, 0.05)', zIndex: 1 }}>
        <p>© 2026 PitchVerdict. Europe&apos;s Top 10 Leagues. Dynamic SVG Graphics. All Rights Reserved.</p>
        <p style={{ fontSize: '10px', marginTop: '6px', color: 'rgba(15, 23, 42, 0.35)' }}>
          Powered by Google Gemini AI & pure CSS glassmorphism.
        </p>
      </footer>

      {/* Embedded CSS rules for interactive details */}
      <style jsx>{`
        .setup-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .input-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        .select-field {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 6px;
          background-color: #ffffff;
          color: var(--text-main);
          font-size: 13px;
          font-weight: 600;
          outline: none;
          transition: border-color 0.2s;
        }
        .select-field:focus {
          border-color: var(--primary);
        }
        .team-badge-indicator {
          font-size: 9px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .sim-layout {
          display: flex;
          gap: 30px;
        }
        .action-btn-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(15,23,42,0.2) !important;
        }
        .action-btn-main:active {
          transform: translateY(0);
        }
        .action-btn-secondary:hover {
          background: rgba(0,0,0,0.1) !important;
        }
        .spinner {
          border: 2px solid rgba(0,0,0,0.1);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border-left-color: var(--primary);
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .celebration-card {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
        @media (max-width: 1000px) {
          .setup-grid {
            grid-template-columns: 1fr;
          }
          .sim-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
