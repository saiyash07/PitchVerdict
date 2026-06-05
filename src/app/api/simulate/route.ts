import { NextRequest, NextResponse } from 'next/server';
import { Player, Team } from '@/lib/mockDb';

interface SimulationEvent {
  minute: number;
  eventType: 'GOAL' | 'SAVE' | 'CARD' | 'TACKLE' | 'INFO';
  commentary: string;
  playerName?: string;
  teamId?: 'A' | 'B';
}

// Simple deterministic-probabilistic game simulator
function runMathSimulation(
  teamA: Team,
  teamB: Team,
  tacticsA: { mentality: string; style: string },
  tacticsB: { mentality: string; style: string }
) {
  let scoreA = 0;
  let scoreB = 0;
  const events: Omit<SimulationEvent, 'commentary'>[] = [];
  
  // Base stats calculation
  const attA = teamA.ratingAttack + (tacticsA.mentality === 'attacking' ? 5 : tacticsA.mentality === 'defensive' ? -5 : 0);
  const defA = teamA.ratingDefence - (tacticsA.mentality === 'attacking' ? 3 : tacticsA.mentality === 'defensive' ? -4 : 0);
  const midA = teamA.ratingMidfield;

  const attB = teamB.ratingAttack + (tacticsB.mentality === 'attacking' ? 5 : tacticsB.mentality === 'defensive' ? -5 : 0);
  const defB = teamB.ratingDefence - (tacticsB.mentality === 'attacking' ? 3 : tacticsB.mentality === 'defensive' ? -4 : 0);
  const midB = teamB.ratingMidfield;

  // Add Kick-off event
  events.push({
    minute: 1,
    eventType: 'INFO',
    playerName: undefined,
    teamId: undefined
  });

  // Helper to pick player based on stat weighting
  const pickPlayer = (players: Player[], positionType: 'FW' | 'MF' | 'DF' | 'GK', weightStat: 'shooting' | 'passing' | 'defending') => {
    // Filter player categories
    let pool = players;
    if (positionType === 'FW') {
      pool = players.filter(p => ['ST', 'LW', 'RW', 'CF'].includes(p.position));
    } else if (positionType === 'MF') {
      pool = players.filter(p => ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p.position));
    } else if (positionType === 'DF') {
      pool = players.filter(p => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position));
    } else if (positionType === 'GK') {
      pool = players.filter(p => p.position === 'GK');
    }
    
    if (pool.length === 0) pool = players; // Fallback
    
    // Weighted selection
    const totalWeight = pool.reduce((acc, p) => acc + p.stats[weightStat], 0);
    let rand = Math.random() * totalWeight;
    for (const p of pool) {
      rand -= p.stats[weightStat];
      if (rand <= 0) return p;
    }
    return pool[0];
  };

  // Run 90 minute match loop
  for (let min = 2; min <= 90; min++) {
    const chanceA = (attA - defB) * 0.05 + (midA - midB) * 0.02 + 0.08;
    const chanceB = (attB - defA) * 0.05 + (midB - midA) * 0.02 + 0.08;

    const randVal = Math.random();

    if (randVal < chanceA * 0.08) {
      // Team A Attack Opportunity
      const striker = pickPlayer(teamA.players, 'FW', 'shooting');
      const keeper = pickPlayer(teamB.players, 'GK', 'defending');
      
      // Shot outcome check: striker shooting vs keeper defending + luck
      const shotScore = striker.stats.shooting * Math.random();
      const saveScore = keeper.stats.defending * Math.random() * 1.2;

      if (shotScore > saveScore) {
        scoreA++;
        events.push({
          minute: min,
          eventType: 'GOAL',
          playerName: striker.name,
          teamId: 'A'
        });
      } else {
        events.push({
          minute: min,
          eventType: 'SAVE',
          playerName: keeper.name,
          teamId: 'B'
        });
      }
    } else if (randVal < (chanceA + chanceB) * 0.08) {
      // Team B Attack Opportunity
      const striker = pickPlayer(teamB.players, 'FW', 'shooting');
      const keeper = pickPlayer(teamA.players, 'GK', 'defending');

      const shotScore = striker.stats.shooting * Math.random();
      const saveScore = keeper.stats.defending * Math.random() * 1.2;

      if (shotScore > saveScore) {
        scoreB++;
        events.push({
          minute: min,
          eventType: 'GOAL',
          playerName: striker.name,
          teamId: 'B'
        });
      } else {
        events.push({
          minute: min,
          eventType: 'SAVE',
          playerName: keeper.name,
          teamId: 'A'
        });
      }
    } else if (Math.random() < 0.05) {
      // Card Booking Event
      const isTeamA = Math.random() > 0.5;
      const offender = pickPlayer(isTeamA ? teamA.players : teamB.players, 'DF', 'defending');
      events.push({
        minute: min,
        eventType: 'CARD',
        playerName: offender.name,
        teamId: isTeamA ? 'A' : 'B'
      });
    } else if (Math.random() < 0.04) {
      // General match highlight (tackle/interception)
      const isTeamA = Math.random() > 0.5;
      const defender = pickPlayer(isTeamA ? teamA.players : teamB.players, 'DF', 'defending');
      events.push({
        minute: min,
        eventType: 'TACKLE',
        playerName: defender.name,
        teamId: isTeamA ? 'A' : 'B'
      });
    }
  }

  // Add full-time whistle event
  events.push({
    minute: 90,
    eventType: 'INFO',
    playerName: undefined,
    teamId: undefined
  });

  return {
    scoreA,
    scoreB,
    events
  };
}

// Hardcoded fallback commentary writer if no Gemini key
function getFallbackCommentary(events: Omit<SimulationEvent, 'commentary'>[], teamA: Team, teamB: Team): SimulationEvent[] {
  let scoreA = 0;
  let scoreB = 0;

  return events.map((ev) => {
    let comm = '';
    
    if (ev.minute === 1) {
      comm = `Referee blows the whistle and we are underway at the stadium! ${teamA.name} in their traditional setup vs ${teamB.name}.`;
    } else if (ev.minute === 90) {
      comm = `Peep peep peep! There goes the final whistle! A fascinating tactical display ends here. Final score: ${teamA.name} ${scoreA} - ${scoreB} ${teamB.name}.`;
    } else {
      switch (ev.eventType) {
        case 'GOAL':
          if (ev.teamId === 'A') {
            scoreA++;
            comm = `GOOOOAL! ${ev.playerName} makes the breakthrough for ${teamA.name}! A stunning strike that leaves the keeper with absolutely no chance. ${teamA.name} ${scoreA}, ${teamB.name} ${scoreB}!`;
          } else {
            scoreB++;
            comm = `GOAL! ${teamB.name} score! ${ev.playerName} finds space in the penalty box and clinical slots it home. Crucial goal. ${teamA.name} ${scoreA}, ${teamB.name} ${scoreB}!`;
          }
          break;
        case 'SAVE':
          comm = `Great save! ${ev.playerName} leaps across his line to deny the opposition a certain goal. Excellent reflexes.`;
          break;
        case 'CARD':
          comm = `Yellow card! The referee goes to his pocket. ${ev.playerName} is booked for a reckless late challenge.`;
          break;
        case 'TACKLE':
          comm = `Outstanding piece of defending. ${ev.playerName} timings his sliding challenge perfectly to regain possession for his team.`;
          break;
        default:
          comm = `Interesting midfield exchange. Both teams are fighting hard to dominate possession.`;
      }
    }

    return {
      ...ev,
      commentary: comm
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teamA, teamB, tacticsA, tacticsB } = body as {
      teamA: Team;
      teamB: Team;
      tacticsA: { mentality: string; style: string };
      tacticsB: { mentality: string; style: string };
    };

    if (!teamA || !teamB || !tacticsA || !tacticsB) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Run math-based match simulation
    const result = runMathSimulation(teamA, teamB, tacticsA, tacticsB);

    // Call Gemini API if Key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are a legendary Champions League and Premier League football commentator (like Peter Drury or Martin Tyler).
You are calling a simulated matchup between ${teamA.name} (${teamA.season}, tactics: ${tacticsA.style}) and ${teamB.name} (${teamB.season}, tactics: ${tacticsB.style}).
The final score was ${teamA.name} ${result.scoreA} - ${result.scoreB} ${teamB.name}.

Here is the raw timeline of match events:
${JSON.stringify(result.events)}

Translate this timeline into realistic, dramatic, and emotionally charged play-by-play soccer commentary.
Make sure the tone increases in tension for late goals, praise key playmakers, and mention their specific defensive blocks or saves.

You MUST return the output strictly as a JSON array of objects with the exact schema:
[
  { "minute": number, "eventType": "GOAL" | "SAVE" | "CARD" | "TACKLE" | "INFO", "commentary": "your commentary string" }
]
Do not include any markdown fences or additional text, return ONLY the raw JSON array.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const finalCommentary = JSON.parse(text) as SimulationEvent[];
            return NextResponse.json({
              scoreA: result.scoreA,
              scoreB: result.scoreB,
              commentary: finalCommentary
            });
          }
        }
      } catch (err) {
        console.error('Gemini API call failed, falling back to local commentary:', err);
      }
    }

    // Fallback if no API Key or error
    const localCommentary = getFallbackCommentary(result.events, teamA, teamB);
    return NextResponse.json({
      scoreA: result.scoreA,
      scoreB: result.scoreB,
      commentary: localCommentary
    });
  } catch (error) {
    console.error('Simulation Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
