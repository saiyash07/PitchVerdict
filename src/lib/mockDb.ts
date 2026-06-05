// PitchVerdict Mock Database and Data Model

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string; // 'GK' | 'LB' | 'CB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST'
  photoUrl: string;
  ratingOverall: number;
  stats: PlayerStats;
}

export interface Team {
  id: string;
  name: string;
  season: string; // e.g. '2023-2024'
  leagueId: string;
  logoUrl: string;
  ratingOverall: number;
  ratingAttack: number;
  ratingMidfield: number;
  ratingDefence: number;
  defaultFormation: string; // e.g. '4-3-3', '4-4-2', '3-5-2'
  players: Player[];
}

export interface League {
  id: string;
  name: string;
  country: string;
  logoUrl: string;
  teams: string[]; // List of team names available in this league
}

export const LEAGUES: League[] = [
  {
    id: 'pl',
    name: 'Premier League',
    country: 'England',
    logoUrl: '/logos/leagues/pl.svg',
    teams: [
      'Manchester City', 'Arsenal', 'Liverpool', 'Aston Villa', 'Tottenham Hotspur',
      'Chelsea', 'Manchester United', 'Newcastle United', 'West Ham United', 'Brighton & Hove Albion',
      'Bournemouth', 'Crystal Palace', 'Wolverhampton Wanderers', 'Fulham', 'Everton',
      'Brentford', 'Nottingham Forest', 'Luton Town', 'Burnley', 'Sheffield United',
      'Leicester City', 'Leeds United', 'Southampton', 'Watford', 'Norwich City'
    ]
  },
  {
    id: 'la-liga',
    name: 'La Liga',
    country: 'Spain',
    logoUrl: '/logos/leagues/laliga.svg',
    teams: [
      'Real Madrid', 'Barcelona', 'Girona', 'Atletico Madrid', 'Athletic Club',
      'Real Sociedad', 'Real Betis', 'Valencia', 'Villarreal', 'Getafe',
      'Osasuna', 'Sevilla', 'Las Palmas', 'Alaves', 'Rayo Vallecano',
      'Celta Vigo', 'Mallorca', 'Cadiz', 'Granada', 'Almeria',
      'Espanyol', 'Elche', 'Valladolid', 'Levante', 'Eibar'
    ]
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Germany',
    logoUrl: '/logos/leagues/bundesliga.svg',
    teams: [
      'Bayer Leverkusen', 'Bayern Munich', 'VfB Stuttgart', 'Borussia Dortmund', 'RB Leipzig',
      'Eintracht Frankfurt', 'TSG Hoffenheim', 'SC Freiburg', 'FC Heidenheim', 'Werder Bremen',
      'FC Augsburg', 'VfL Wolfsburg', 'Mainz 05', 'Borussia Monchengladbach', 'Union Berlin',
      'VfL Bochum', 'FC Koln', 'Darmstadt 98', 'Schalke 04', 'Hertha BSC',
      'Arminia Bielefeld', 'Greuther Furth', 'Werder Bremen', 'Fortuna Dusseldorf', 'Paderborn 07'
    ]
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    country: 'Italy',
    logoUrl: '/logos/leagues/seriea.svg',
    teams: [
      'Inter Milan', 'AC Milan', 'Juventus', 'Bologna', 'Roma',
      'Atalanta', 'Lazio', 'Fiorentina', 'Napoli', 'Torino',
      'Monza', 'Genoa', 'Lecce', 'Hellas Verona', 'Udinese',
      'Cagliari', 'Frosinone', 'Empoli', 'Sassuolo', 'Salernitana',
      'Sampdoria', 'Spezia', 'Cremonese', 'Venezia', 'Benevento'
    ]
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    country: 'France',
    logoUrl: '/logos/leagues/ligue1.svg',
    teams: [
      'Paris Saint-Germain', 'Monaco', 'Brest', 'Lille', 'Nice',
      'Lens', 'Marseille', 'Reims', 'Rennes', 'Toulouse',
      'Montpellier', 'Strasbourg', 'Le Havre', 'Nantes', 'Metz',
      'Lorient', 'Clermont Foot', 'Lyon', 'Auxerre', 'Saint-Etienne',
      'Bordeaux', 'Angers', 'Troyes', 'Dijon', 'Nimes'
    ]
  },
  {
    id: 'eredivisie',
    name: 'Eredivisie',
    country: 'Netherlands',
    logoUrl: '/logos/leagues/eredivisie.svg',
    teams: [
      'PSV Eindhoven', 'Feyenoord', 'Twente', 'AZ Alkmaar', 'Ajax',
      'NEC Nijmegen', 'Utrecht', 'Go Ahead Eagles', 'Sparta Rotterdam', 'Heerenveen',
      'Fortuna Sittard', 'Zwolle', 'Almere City', 'Heracles', 'Waalwijk',
      'Excelsior', 'Volendam', 'Vitesse', 'Groningen', 'Willem II',
      'Emmen', 'Cambuur', 'ADO Den Haag', 'VVV-Venlo', 'PEC Zwolle'
    ]
  },
  {
    id: 'primeira-liga',
    name: 'Primeira Liga',
    country: 'Portugal',
    logoUrl: '/logos/leagues/primeira.svg',
    teams: [
      'Sporting CP', 'Benfica', 'FC Porto', 'Braga', 'Vitoria de Guimaraes',
      'Moreirense', 'Arouca', 'Famalicao', 'Casa Pia', 'Farense',
      'Rio Ave', 'Gil Vicente', 'Estoril', 'Boavista', 'Estrela da Amadora',
      'Portimonense', 'Chaves', 'Vizela', 'Santa Clara', 'Maritimo',
      'Pacos de Ferreira', 'Belenenses SAD', 'Nacional', 'Tondela', 'Feirense'
    ]
  },
  {
    id: 'belgian-pro',
    name: 'Belgian Pro League',
    country: 'Belgium',
    logoUrl: '/logos/leagues/belgian.svg',
    teams: [
      'Club Brugge', 'Union Saint-Gilloise', 'Anderlecht', 'Genk', 'Cercle Brugge',
      'Antwerp', 'Gent', 'Mechelen', 'Sint-Truiden', 'Standard Liege',
      'Westerlo', 'Charleroi', 'OH Leuven', 'Kortrijk', 'Eupen',
      'RWD Molenbeek', 'Zulte Waregem', 'Ostend', 'Beerschot', 'Waasland-Beveren'
    ]
  },
  {
    id: 'scottish-prem',
    name: 'Scottish Premiership',
    country: 'Scotland',
    logoUrl: '/logos/leagues/scottish.svg',
    teams: [
      'Celtic', 'Rangers', 'Hearts', 'Kilmarnock', 'St Mirren',
      'Dundee', 'Aberdeen', 'Hibernian', 'Motherwell', 'Ross County',
      'St Johnstone', 'Livingston', 'Hamilton Academical', 'Dundee United', 'Kilmarnock'
    ]
  },
  {
    id: 'turkish-super',
    name: 'Turkish Süper Lig',
    country: 'Turkey',
    logoUrl: '/logos/leagues/turkish.svg',
    teams: [
      'Galatasaray', 'Fenerbahçe', 'Trabzonspor', 'Beşiktaş', 'Kasımpaşa',
      'Başakşehir', 'Alanyaspor', 'Sivasspor', 'Antalyaspor', 'Adana Demirspor',
      'Samsunspor', 'Kayserispor', 'Ankaragücü', 'Hatayspor', 'Gaziantep',
      'Konyaspor', 'Fatih Karagümrük', 'Pendikspor', 'İstanbulspor', 'Rizespor',
      'Giresunspor', 'Göztepe', 'Yeni Malatyaspor', 'Altay', 'Denizlispor'
    ]
  }
];

export const SEASONS = [
  '2024-2025',
  '2023-2024',
  '2022-2023',
  '2021-2022',
  '2020-2021'
];

interface SquadConfig {
  name: string;
  number: number;
  position: string;
  ratingOverall: number;
  stats: PlayerStats;
  espnId: string;
}

// Pre-defined Squads for selected major clubs with real ESPN Headshot IDs
// Pre-defined Squads for selected major clubs with real ESPN Headshot IDs
const REAL_SQUADS: Record<string, Record<string, SquadConfig[]>> = {
  'Real Madrid': {
    '2024-2025': [
      { name: 'Thibaut Courtois', number: 1, position: 'GK', ratingOverall: 90, stats: { pace: 46, shooting: 15, passing: 74, dribbling: 20, defending: 89, physical: 84 }, espnId: '159849' },
      { name: 'Dani Carvajal', number: 2, position: 'RB', ratingOverall: 86, stats: { pace: 80, shooting: 54, passing: 78, dribbling: 79, defending: 84, physical: 82 }, espnId: '170725' },
      { name: 'Éder Militão', number: 3, position: 'CB', ratingOverall: 85, stats: { pace: 82, shooting: 50, passing: 71, dribbling: 72, defending: 85, physical: 83 }, espnId: '256860' },
      { name: 'Antonio Rüdiger', number: 22, position: 'CB', ratingOverall: 87, stats: { pace: 82, shooting: 53, passing: 71, dribbling: 69, defending: 86, physical: 86 }, espnId: '170566' },
      { name: 'Ferland Mendy', number: 23, position: 'LB', ratingOverall: 82, stats: { pace: 90, shooting: 64, passing: 74, dribbling: 78, defending: 81, physical: 84 }, espnId: '238809' },
      { name: 'Aurélien Tchouaméni', number: 18, position: 'CDM', ratingOverall: 85, stats: { pace: 70, shooting: 69, passing: 81, dribbling: 79, defending: 83, physical: 84 }, espnId: '259160' },
      { name: 'Federico Valverde', number: 8, position: 'CM', ratingOverall: 88, stats: { pace: 88, shooting: 82, passing: 84, dribbling: 84, defending: 80, physical: 82 }, espnId: '231872' },
      { name: 'Jude Bellingham', number: 5, position: 'CAM', ratingOverall: 90, stats: { pace: 80, shooting: 85, passing: 83, dribbling: 88, defending: 78, physical: 85 }, espnId: '324255' },
      { name: 'Rodrygo', number: 11, position: 'RW', ratingOverall: 86, stats: { pace: 89, shooting: 82, passing: 80, dribbling: 87, defending: 32, physical: 68 }, espnId: '269871' },
      { name: 'Kylian Mbappé', number: 9, position: 'ST', ratingOverall: 91, stats: { pace: 97, shooting: 90, passing: 80, dribbling: 92, defending: 36, physical: 78 }, espnId: '226315' },
      { name: 'Vinícius Júnior', number: 7, position: 'LW', ratingOverall: 90, stats: { pace: 95, shooting: 83, passing: 81, dribbling: 91, defending: 29, physical: 72 }, espnId: '237974' },
    ],
    '2023-2024': [
      { name: 'Thibaut Courtois', number: 1, position: 'GK', ratingOverall: 90, stats: { pace: 46, shooting: 15, passing: 74, dribbling: 20, defending: 89, physical: 84 }, espnId: '159849' },
      { name: 'Dani Carvajal', number: 2, position: 'RB', ratingOverall: 86, stats: { pace: 80, shooting: 54, passing: 78, dribbling: 79, defending: 84, physical: 82 }, espnId: '170725' },
      { name: 'Éder Militão', number: 3, position: 'CB', ratingOverall: 86, stats: { pace: 82, shooting: 50, passing: 71, dribbling: 72, defending: 86, physical: 83 }, espnId: '256860' },
      { name: 'Antonio Rüdiger', number: 22, position: 'CB', ratingOverall: 87, stats: { pace: 82, shooting: 53, passing: 71, dribbling: 69, defending: 86, physical: 86 }, espnId: '170566' },
      { name: 'Ferland Mendy', number: 23, position: 'LB', ratingOverall: 82, stats: { pace: 90, shooting: 64, passing: 74, dribbling: 78, defending: 81, physical: 84 }, espnId: '238809' },
      { name: 'Aurélien Tchouaméni', number: 18, position: 'CDM', ratingOverall: 85, stats: { pace: 70, shooting: 69, passing: 81, dribbling: 79, defending: 83, physical: 84 }, espnId: '259160' },
      { name: 'Federico Valverde', number: 8, position: 'CM', ratingOverall: 88, stats: { pace: 88, shooting: 82, passing: 84, dribbling: 84, defending: 80, physical: 82 }, espnId: '231872' },
      { name: 'Toni Kroos', number: 8, position: 'CM', ratingOverall: 86, stats: { pace: 51, shooting: 81, passing: 93, dribbling: 84, defending: 71, physical: 68 }, espnId: '103007' },
      { name: 'Jude Bellingham', number: 5, position: 'CAM', ratingOverall: 89, stats: { pace: 80, shooting: 85, passing: 83, dribbling: 88, defending: 78, physical: 85 }, espnId: '324255' },
      { name: 'Rodrygo', number: 11, position: 'RW', ratingOverall: 86, stats: { pace: 89, shooting: 82, passing: 80, dribbling: 87, defending: 32, physical: 68 }, espnId: '269871' },
      { name: 'Vinícius Júnior', number: 7, position: 'LW', ratingOverall: 90, stats: { pace: 95, shooting: 83, passing: 81, dribbling: 91, defending: 29, physical: 72 }, espnId: '237974' },
    ],
    '2022-2023': [
      { name: 'Thibaut Courtois', number: 1, position: 'GK', ratingOverall: 90, stats: { pace: 46, shooting: 15, passing: 74, dribbling: 20, defending: 89, physical: 84 }, espnId: '159849' },
      { name: 'Dani Carvajal', number: 2, position: 'RB', ratingOverall: 86, stats: { pace: 80, shooting: 54, passing: 78, dribbling: 79, defending: 84, physical: 82 }, espnId: '170725' },
      { name: 'Éder Militão', number: 3, position: 'CB', ratingOverall: 86, stats: { pace: 82, shooting: 50, passing: 71, dribbling: 72, defending: 86, physical: 83 }, espnId: '256860' },
      { name: 'David Alaba', number: 4, position: 'CB', ratingOverall: 86, stats: { pace: 77, shooting: 70, passing: 81, dribbling: 80, defending: 85, physical: 77 }, espnId: '124317' },
      { name: 'Ferland Mendy', number: 23, position: 'LB', ratingOverall: 83, stats: { pace: 90, shooting: 64, passing: 74, dribbling: 78, defending: 81, physical: 84 }, espnId: '238809' },
      { name: 'Aurélien Tchouaméni', number: 18, position: 'CDM', ratingOverall: 84, stats: { pace: 70, shooting: 69, passing: 81, dribbling: 79, defending: 82, physical: 83 }, espnId: '259160' },
      { name: 'Luka Modrić', number: 10, position: 'CM', ratingOverall: 87, stats: { pace: 73, shooting: 76, passing: 89, dribbling: 88, defending: 72, physical: 66 }, espnId: '98517' },
      { name: 'Toni Kroos', number: 8, position: 'CM', ratingOverall: 87, stats: { pace: 53, shooting: 81, passing: 93, dribbling: 82, defending: 71, physical: 69 }, espnId: '103007' },
      { name: 'Federico Valverde', number: 15, position: 'CAM', ratingOverall: 86, stats: { pace: 87, shooting: 80, passing: 82, dribbling: 82, defending: 78, physical: 81 }, espnId: '231872' },
      { name: 'Karim Benzema', number: 9, position: 'ST', ratingOverall: 91, stats: { pace: 80, shooting: 88, passing: 83, dribbling: 87, defending: 42, physical: 78 }, espnId: '90152' },
      { name: 'Vinícius Júnior', number: 20, position: 'LW', ratingOverall: 88, stats: { pace: 95, shooting: 82, passing: 78, dribbling: 90, defending: 29, physical: 70 }, espnId: '237974' },
    ],
    '2021-2022': [
      { name: 'Thibaut Courtois', number: 1, position: 'GK', ratingOverall: 89, stats: { pace: 46, shooting: 15, passing: 74, dribbling: 20, defending: 89, physical: 84 }, espnId: '159849' },
      { name: 'Dani Carvajal', number: 2, position: 'RB', ratingOverall: 85, stats: { pace: 80, shooting: 54, passing: 78, dribbling: 79, defending: 84, physical: 82 }, espnId: '170725' },
      { name: 'Éder Militão', number: 3, position: 'CB', ratingOverall: 83, stats: { pace: 80, shooting: 50, passing: 71, dribbling: 72, defending: 83, physical: 82 }, espnId: '256860' },
      { name: 'David Alaba', number: 4, position: 'CB', ratingOverall: 86, stats: { pace: 77, shooting: 70, passing: 81, dribbling: 80, defending: 85, physical: 77 }, espnId: '124317' },
      { name: 'Ferland Mendy', number: 23, position: 'LB', ratingOverall: 83, stats: { pace: 90, shooting: 64, passing: 74, dribbling: 78, defending: 81, physical: 84 }, espnId: '238809' },
      { name: 'Casemiro', number: 14, position: 'CDM', ratingOverall: 89, stats: { pace: 65, shooting: 73, passing: 76, dribbling: 72, defending: 86, physical: 90 }, espnId: '170721' },
      { name: 'Luka Modrić', number: 10, position: 'CM', ratingOverall: 87, stats: { pace: 73, shooting: 76, passing: 89, dribbling: 88, defending: 72, physical: 66 }, espnId: '98517' },
      { name: 'Toni Kroos', number: 8, position: 'CM', ratingOverall: 88, stats: { pace: 53, shooting: 81, passing: 93, dribbling: 82, defending: 71, physical: 69 }, espnId: '103007' },
      { name: 'Federico Valverde', number: 15, position: 'CAM', ratingOverall: 84, stats: { pace: 86, shooting: 74, passing: 78, dribbling: 79, defending: 77, physical: 80 }, espnId: '231872' },
      { name: 'Karim Benzema', number: 9, position: 'ST', ratingOverall: 90, stats: { pace: 76, shooting: 86, passing: 81, dribbling: 87, defending: 40, physical: 77 }, espnId: '90152' },
      { name: 'Vinícius Júnior', number: 20, position: 'LW', ratingOverall: 84, stats: { pace: 95, shooting: 79, passing: 74, dribbling: 86, defending: 29, physical: 66 }, espnId: '237974' },
    ],
    '2020-2021': [
      { name: 'Thibaut Courtois', number: 1, position: 'GK', ratingOverall: 89, stats: { pace: 46, shooting: 15, passing: 74, dribbling: 20, defending: 89, physical: 84 }, espnId: '159849' },
      { name: 'Dani Carvajal', number: 2, position: 'RB', ratingOverall: 86, stats: { pace: 80, shooting: 54, passing: 78, dribbling: 79, defending: 84, physical: 82 }, espnId: '170725' },
      { name: 'Sergio Ramos', number: 4, position: 'CB', ratingOverall: 89, stats: { pace: 70, shooting: 70, passing: 76, dribbling: 73, defending: 88, physical: 84 }, espnId: '88481' },
      { name: 'Raphaël Varane', number: 5, position: 'CB', ratingOverall: 86, stats: { pace: 82, shooting: 49, passing: 64, dribbling: 65, defending: 87, physical: 82 }, espnId: '159851' },
      { name: 'Ferland Mendy', number: 23, position: 'LB', ratingOverall: 83, stats: { pace: 90, shooting: 64, passing: 74, dribbling: 78, defending: 81, physical: 84 }, espnId: '238809' },
      { name: 'Casemiro', number: 14, position: 'CDM', ratingOverall: 89, stats: { pace: 65, shooting: 73, passing: 76, dribbling: 72, defending: 86, physical: 90 }, espnId: '170721' },
      { name: 'Luka Modrić', number: 10, position: 'CM', ratingOverall: 87, stats: { pace: 73, shooting: 76, passing: 89, dribbling: 88, defending: 72, physical: 66 }, espnId: '98517' },
      { name: 'Toni Kroos', number: 8, position: 'CM', ratingOverall: 88, stats: { pace: 53, shooting: 81, passing: 93, dribbling: 82, defending: 71, physical: 69 }, espnId: '103007' },
      { name: 'Marco Asensio', number: 11, position: 'RW', ratingOverall: 83, stats: { pace: 80, shooting: 80, passing: 81, dribbling: 83, defending: 43, physical: 62 }, espnId: '216116' },
      { name: 'Eden Hazard', number: 7, position: 'LW', ratingOverall: 88, stats: { pace: 88, shooting: 82, passing: 83, dribbling: 91, defending: 35, physical: 66 }, espnId: '103013' },
      { name: 'Karim Benzema', number: 9, position: 'ST', ratingOverall: 89, stats: { pace: 74, shooting: 85, passing: 81, dribbling: 86, defending: 40, physical: 76 }, espnId: '90152' },
    ],
  },
  'Manchester City': {
    '2023-2024': [
      { name: 'Ederson', number: 31, position: 'GK', ratingOverall: 88, stats: { pace: 64, shooting: 15, passing: 91, dribbling: 25, defending: 86, physical: 79 }, espnId: '216117' },
      { name: 'Kyle Walker', number: 2, position: 'RB', ratingOverall: 84, stats: { pace: 91, shooting: 63, passing: 77, dribbling: 78, defending: 81, physical: 82 }, espnId: '139943' },
      { name: 'Rúben Dias', number: 3, position: 'CB', ratingOverall: 89, stats: { pace: 62, shooting: 39, passing: 68, dribbling: 66, defending: 90, physical: 87 }, espnId: '259203' },
      { name: 'Manuel Akanji', number: 25, position: 'CB', ratingOverall: 84, stats: { pace: 80, shooting: 54, passing: 75, dribbling: 74, defending: 84, physical: 81 }, espnId: '242407' },
      { name: 'Josko Gvardiol', number: 24, position: 'LB', ratingOverall: 83, stats: { pace: 78, shooting: 61, passing: 76, dribbling: 79, defending: 82, physical: 83 }, espnId: '318258' },
      { name: 'Rodri', number: 16, position: 'CDM', ratingOverall: 90, stats: { pace: 66, shooting: 80, passing: 86, dribbling: 84, defending: 87, physical: 85 }, espnId: '231843' },
      { name: 'Kevin De Bruyne', number: 17, position: 'CM', ratingOverall: 90, stats: { pace: 72, shooting: 87, passing: 94, dribbling: 87, defending: 65, physical: 78 }, espnId: '159846' },
      { name: 'Bernardo Silva', number: 20, position: 'CAM', ratingOverall: 88, stats: { pace: 78, shooting: 78, passing: 86, dribbling: 92, defending: 70, physical: 69 }, espnId: '198544' },
      { name: 'Phil Foden', number: 47, position: 'RW', ratingOverall: 88, stats: { pace: 86, shooting: 85, passing: 84, dribbling: 90, defending: 57, physical: 66 }, espnId: '282110' },
      { name: 'Jack Grealish', number: 10, position: 'LW', ratingOverall: 84, stats: { pace: 76, shooting: 76, passing: 84, dribbling: 87, defending: 47, physical: 74 }, espnId: '181734' },
      { name: 'Erling Haaland', number: 9, position: 'ST', ratingOverall: 91, stats: { pace: 89, shooting: 92, passing: 66, dribbling: 81, defending: 45, physical: 88 }, espnId: '324278' },
    ],
  },
  'Barcelona': {
    '2023-2024': [
      { name: 'Marc-André ter Stegen', number: 1, position: 'GK', ratingOverall: 89, stats: { pace: 48, shooting: 15, passing: 89, dribbling: 22, defending: 87, physical: 80 }, espnId: '158567' },
      { name: 'Jules Koundé', number: 23, position: 'RB', ratingOverall: 85, stats: { pace: 80, shooting: 45, passing: 73, dribbling: 74, defending: 85, physical: 78 }, espnId: '231692' },
      { name: 'Ronald Araújo', number: 4, position: 'CB', ratingOverall: 86, stats: { pace: 82, shooting: 51, passing: 65, dribbling: 63, defending: 86, physical: 84 }, espnId: '270821' },
      { name: 'Pau Cubarsí', number: 2, position: 'CB', ratingOverall: 79, stats: { pace: 68, shooting: 33, passing: 81, dribbling: 72, defending: 80, physical: 73 }, espnId: '368992' },
      { name: 'Alejandro Balde', number: 3, position: 'LB', ratingOverall: 81, stats: { pace: 91, shooting: 48, passing: 72, dribbling: 78, defending: 76, physical: 65 }, espnId: '323703' },
      { name: 'Frenkie de Jong', number: 21, position: 'CDM', ratingOverall: 87, stats: { pace: 82, shooting: 69, passing: 86, dribbling: 87, defending: 77, physical: 78 }, espnId: '219022' },
      { name: 'Pedri', number: 8, position: 'CM', ratingOverall: 86, stats: { pace: 78, shooting: 71, passing: 87, dribbling: 88, defending: 68, physical: 66 }, espnId: '250465' },
      { name: 'Ilkay Gündogan', number: 22, position: 'CAM', ratingOverall: 87, stats: { pace: 62, shooting: 80, passing: 86, dribbling: 84, defending: 72, physical: 72 }, espnId: '131424' },
      { name: 'Lamine Yamal', number: 19, position: 'RW', ratingOverall: 82, stats: { pace: 89, shooting: 76, passing: 80, dribbling: 88, defending: 35, physical: 60 }, espnId: '362150' },
      { name: 'Raphinha', number: 11, position: 'LW', ratingOverall: 84, stats: { pace: 89, shooting: 79, passing: 80, dribbling: 84, defending: 52, physical: 73 }, espnId: '231050' },
      { name: 'Robert Lewandowski', number: 9, position: 'ST', ratingOverall: 90, stats: { pace: 75, shooting: 91, passing: 79, dribbling: 85, defending: 44, physical: 83 }, espnId: '125824' },
    ],
    '2022-2023': [
      { name: 'Marc-André ter Stegen', number: 1, position: 'GK', ratingOverall: 89, stats: { pace: 48, shooting: 15, passing: 89, dribbling: 22, defending: 87, physical: 80 }, espnId: '158567' },
      { name: 'Jules Koundé', number: 23, position: 'RB', ratingOverall: 84, stats: { pace: 80, shooting: 45, passing: 73, dribbling: 74, defending: 85, physical: 78 }, espnId: '231692' },
      { name: 'Ronald Araújo', number: 4, position: 'CB', ratingOverall: 85, stats: { pace: 82, shooting: 51, passing: 65, dribbling: 63, defending: 86, physical: 84 }, espnId: '270821' },
      { name: 'Andreas Christensen', number: 15, position: 'CB', ratingOverall: 83, stats: { pace: 68, shooting: 32, passing: 74, dribbling: 68, defending: 84, physical: 74 }, espnId: '170757' },
      { name: 'Alejandro Balde', number: 3, position: 'LB', ratingOverall: 80, stats: { pace: 91, shooting: 48, passing: 72, dribbling: 78, defending: 76, physical: 65 }, espnId: '323703' },
      { name: 'Sergio Busquets', number: 5, position: 'CDM', ratingOverall: 85, stats: { pace: 42, shooting: 62, passing: 79, dribbling: 78, defending: 82, physical: 76 }, espnId: '111246' },
      { name: 'Frenkie de Jong', number: 21, position: 'CM', ratingOverall: 86, stats: { pace: 82, shooting: 69, passing: 86, dribbling: 87, defending: 77, physical: 78 }, espnId: '219022' },
      { name: 'Pedri', number: 8, position: 'CM', ratingOverall: 85, stats: { pace: 78, shooting: 71, passing: 87, dribbling: 88, defending: 68, physical: 66 }, espnId: '250465' },
      { name: 'Raphinha', number: 22, position: 'RW', ratingOverall: 83, stats: { pace: 89, shooting: 79, passing: 80, dribbling: 84, defending: 52, physical: 73 }, espnId: '231050' },
      { name: 'Ousmane Dembélé', number: 7, position: 'LW', ratingOverall: 84, stats: { pace: 93, shooting: 77, passing: 84, dribbling: 89, defending: 36, physical: 56 }, espnId: '231267' },
      { name: 'Robert Lewandowski', number: 9, position: 'ST', ratingOverall: 91, stats: { pace: 75, shooting: 91, passing: 79, dribbling: 85, defending: 44, physical: 83 }, espnId: '125824' },
    ],
    '2021-2022': [
      { name: 'Marc-André ter Stegen', number: 1, position: 'GK', ratingOverall: 89, stats: { pace: 48, shooting: 15, passing: 89, dribbling: 22, defending: 87, physical: 80 }, espnId: '158567' },
      { name: 'Dani Alves', number: 8, position: 'RB', ratingOverall: 79, stats: { pace: 68, shooting: 64, passing: 82, dribbling: 80, defending: 76, physical: 68 }, espnId: '45844' },
      { name: 'Gerard Piqué', number: 3, position: 'CB', ratingOverall: 84, stats: { pace: 56, shooting: 61, passing: 71, dribbling: 69, defending: 85, physical: 76 }, espnId: '95831' },
      { name: 'Ronald Araújo', number: 4, position: 'CB', ratingOverall: 83, stats: { pace: 80, shooting: 50, passing: 63, dribbling: 61, defending: 83, physical: 82 }, espnId: '270821' },
      { name: 'Jordi Alba', number: 18, position: 'LB', ratingOverall: 85, stats: { pace: 84, shooting: 69, passing: 81, dribbling: 82, defending: 77, physical: 70 }, espnId: '140280' },
      { name: 'Sergio Busquets', number: 5, position: 'CDM', ratingOverall: 86, stats: { pace: 42, shooting: 62, passing: 79, dribbling: 78, defending: 82, physical: 76 }, espnId: '111246' },
      { name: 'Frenkie de Jong', number: 21, position: 'CM', ratingOverall: 86, stats: { pace: 81, shooting: 69, passing: 85, dribbling: 87, defending: 76, physical: 77 }, espnId: '219022' },
      { name: 'Pedri', number: 16, position: 'CM', ratingOverall: 84, stats: { pace: 78, shooting: 70, passing: 84, dribbling: 85, defending: 66, physical: 63 }, espnId: '250465' },
      { name: 'Ousmane Dembélé', number: 7, position: 'RW', ratingOverall: 83, stats: { pace: 93, shooting: 77, passing: 81, dribbling: 87, defending: 36, physical: 56 }, espnId: '231267' },
      { name: 'Ferran Torres', number: 19, position: 'LW', ratingOverall: 82, stats: { pace: 82, shooting: 79, passing: 78, dribbling: 82, defending: 43, physical: 66 }, espnId: '259161' },
      { name: 'Pierre-Emerick Aubameyang', number: 25, position: 'ST', ratingOverall: 84, stats: { pace: 87, shooting: 84, passing: 74, dribbling: 79, defending: 36, physical: 68 }, espnId: '140274' },
    ],
    '2020-2021': [
      { name: 'Marc-André ter Stegen', number: 1, position: 'GK', ratingOverall: 90, stats: { pace: 48, shooting: 15, passing: 89, dribbling: 22, defending: 87, physical: 80 }, espnId: '158567' },
      { name: 'Sergi Roberto', number: 20, position: 'RB', ratingOverall: 83, stats: { pace: 76, shooting: 62, passing: 81, dribbling: 78, defending: 76, physical: 72 }, espnId: '147668' },
      { name: 'Gerard Piqué', number: 3, position: 'CB', ratingOverall: 86, stats: { pace: 56, shooting: 61, passing: 71, dribbling: 69, defending: 86, physical: 78 }, espnId: '95831' },
      { name: 'Clément Lenglet', number: 15, position: 'CB', ratingOverall: 84, stats: { pace: 70, shooting: 45, passing: 69, dribbling: 67, defending: 83, physical: 78 }, espnId: '214488' },
      { name: 'Jordi Alba', number: 18, position: 'LB', ratingOverall: 86, stats: { pace: 87, shooting: 69, passing: 81, dribbling: 82, defending: 77, physical: 70 }, espnId: '140280' },
      { name: 'Sergio Busquets', number: 5, position: 'CDM', ratingOverall: 87, stats: { pace: 42, shooting: 62, passing: 80, dribbling: 79, defending: 83, physical: 77 }, espnId: '111246' },
      { name: 'Frenkie de Jong', number: 21, position: 'CM', ratingOverall: 86, stats: { pace: 80, shooting: 69, passing: 85, dribbling: 87, defending: 76, physical: 77 }, espnId: '219022' },
      { name: 'Pedri', number: 16, position: 'CAM', ratingOverall: 82, stats: { pace: 76, shooting: 67, passing: 82, dribbling: 83, defending: 63, physical: 59 }, espnId: '250465' },
      { name: 'Ousmane Dembélé', number: 11, position: 'RW', ratingOverall: 83, stats: { pace: 92, shooting: 77, passing: 77, dribbling: 86, defending: 36, physical: 56 }, espnId: '231267' },
      { name: 'Antoine Griezmann', number: 7, position: 'LW', ratingOverall: 87, stats: { pace: 79, shooting: 85, passing: 84, dribbling: 86, defending: 57, physical: 72 }, espnId: '125796' },
      { name: 'Lionel Messi', number: 10, position: 'ST', ratingOverall: 93, stats: { pace: 85, shooting: 92, passing: 91, dribbling: 95, defending: 38, physical: 65 }, espnId: '45843' },
    ],
  },
  'Arsenal': {
    '2023-2024': [
      { name: 'David Raya', number: 22, position: 'GK', ratingOverall: 84, stats: { pace: 50, shooting: 15, passing: 85, dribbling: 20, defending: 83, physical: 78 }, espnId: '198305' },
      { name: 'Ben White', number: 4, position: 'RB', ratingOverall: 83, stats: { pace: 78, shooting: 49, passing: 76, dribbling: 77, defending: 82, physical: 77 }, espnId: '218653' },
      { name: 'William Saliba', number: 2, position: 'CB', ratingOverall: 87, stats: { pace: 82, shooting: 39, passing: 72, dribbling: 71, defending: 87, physical: 83 }, espnId: '259162' },
      { name: 'Gabriel Magalhães', number: 6, position: 'CB', ratingOverall: 85, stats: { pace: 70, shooting: 48, passing: 66, dribbling: 64, defending: 85, physical: 84 }, espnId: '233664' },
      { name: 'Oleksandr Zinchenko', number: 35, position: 'LB', ratingOverall: 80, stats: { pace: 72, shooting: 66, passing: 81, dribbling: 80, defending: 76, physical: 68 }, espnId: '210257' },
      { name: 'Declan Rice', number: 41, position: 'CDM', ratingOverall: 87, stats: { pace: 76, shooting: 71, passing: 79, dribbling: 80, defending: 84, physical: 85 }, espnId: '256926' },
      { name: 'Martin Ødegaard', number: 8, position: 'CAM', ratingOverall: 88, stats: { pace: 76, shooting: 81, passing: 89, dribbling: 88, defending: 58, physical: 63 }, espnId: '210158' },
      { name: 'Kai Havertz', number: 29, position: 'CM', ratingOverall: 83, stats: { pace: 81, shooting: 79, passing: 78, dribbling: 80, defending: 47, physical: 72 }, espnId: '250257' },
      { name: 'Bukayo Saka', number: 7, position: 'RW', ratingOverall: 87, stats: { pace: 86, shooting: 82, passing: 83, dribbling: 87, defending: 56, physical: 78 }, espnId: '301648' },
      { name: 'Gabriel Martinelli', number: 11, position: 'LW', ratingOverall: 84, stats: { pace: 93, shooting: 78, passing: 75, dribbling: 85, defending: 45, physical: 72 }, espnId: '275752' },
      { name: 'Leandro Trossard', number: 19, position: 'ST', ratingOverall: 83, stats: { pace: 79, shooting: 82, passing: 80, dribbling: 84, defending: 39, physical: 65 }, espnId: '198889' },
    ],
  },
  'Bayern Munich': {
    '2023-2024': [
      { name: 'Manuel Neuer', number: 1, position: 'GK', ratingOverall: 87, stats: { pace: 50, shooting: 15, passing: 88, dribbling: 22, defending: 85, physical: 81 }, espnId: '88492' },
      { name: 'Joshua Kimmich', number: 6, position: 'RB', ratingOverall: 87, stats: { pace: 68, shooting: 72, passing: 88, dribbling: 83, defending: 81, physical: 76 }, espnId: '210252' },
      { name: 'Matthijs de Ligt', number: 4, position: 'CB', ratingOverall: 85, stats: { pace: 66, shooting: 59, passing: 69, dribbling: 67, defending: 85, physical: 84 }, espnId: '250266' },
      { name: 'Dayot Upamecano', number: 2, position: 'CB', ratingOverall: 82, stats: { pace: 81, shooting: 43, passing: 68, dribbling: 66, defending: 82, physical: 83 }, espnId: '226308' },
      { name: 'Alphonso Davies', number: 19, position: 'LB', ratingOverall: 83, stats: { pace: 95, shooting: 66, passing: 74, dribbling: 84, defending: 77, physical: 76 }, espnId: '250263' },
      { name: 'Leon Goretzka', number: 8, position: 'CDM', ratingOverall: 84, stats: { pace: 78, shooting: 80, passing: 80, dribbling: 80, defending: 79, physical: 84 }, espnId: '179555' },
      { name: 'Konrad Laimer', number: 27, position: 'CM', ratingOverall: 82, stats: { pace: 80, shooting: 66, passing: 75, dribbling: 77, defending: 80, physical: 81 }, espnId: '210255' },
      { name: 'Jamal Musiala', number: 42, position: 'CAM', ratingOverall: 87, stats: { pace: 84, shooting: 80, passing: 82, dribbling: 91, defending: 62, physical: 64 }, espnId: '318255' },
      { name: 'Leroy Sané', number: 10, position: 'RW', ratingOverall: 85, stats: { pace: 91, shooting: 81, passing: 80, dribbling: 86, defending: 38, physical: 70 }, espnId: '216112' },
      { name: 'Kingsley Coman', number: 11, position: 'LW', ratingOverall: 84, stats: { pace: 90, shooting: 76, passing: 78, dribbling: 86, defending: 30, physical: 62 }, espnId: '185012' },
      { name: 'Harry Kane', number: 9, position: 'ST', ratingOverall: 90, stats: { pace: 69, shooting: 93, passing: 84, dribbling: 83, defending: 49, physical: 83 }, espnId: '158580' },
    ],
  },
  'Paris Saint-Germain': {
    '2023-2024': [
      { name: 'Gianluigi Donnarumma', number: 99, position: 'GK', ratingOverall: 88, stats: { pace: 50, shooting: 15, passing: 76, dribbling: 20, defending: 87, physical: 82 }, espnId: '210260' },
      { name: 'Achraf Hakimi', number: 2, position: 'RB', ratingOverall: 84, stats: { pace: 92, shooting: 75, passing: 79, dribbling: 80, defending: 76, physical: 78 }, espnId: '237973' },
      { name: 'Marquinhos', number: 5, position: 'CB', ratingOverall: 87, stats: { pace: 78, shooting: 56, passing: 75, dribbling: 73, defending: 88, physical: 80 }, espnId: '170720' },
      { name: 'Milan Skriniar', number: 37, position: 'CB', ratingOverall: 84, stats: { pace: 68, shooting: 41, passing: 64, dribbling: 65, defending: 85, physical: 82 }, espnId: '198304' },
      { name: 'Nuno Mendes', number: 25, position: 'LB', ratingOverall: 82, stats: { pace: 89, shooting: 60, passing: 74, dribbling: 81, defending: 76, physical: 73 }, espnId: '313625' },
      { name: 'Vitinha', number: 17, position: 'CDM', ratingOverall: 84, stats: { pace: 79, shooting: 73, passing: 82, dribbling: 84, defending: 74, physical: 70 }, espnId: '301647' },
      { name: 'Warren Zaïre-Emery', number: 33, position: 'CM', ratingOverall: 80, stats: { pace: 78, shooting: 68, passing: 77, dribbling: 81, defending: 73, physical: 76 }, espnId: '335012' },
      { name: 'Fabian Ruiz', number: 8, position: 'CAM', ratingOverall: 81, stats: { pace: 65, shooting: 77, passing: 81, dribbling: 80, defending: 73, physical: 74 }, espnId: '216110' },
      { name: 'Ousmane Dembélé', number: 10, position: 'RW', ratingOverall: 86, stats: { pace: 93, shooting: 77, passing: 84, dribbling: 89, defending: 36, physical: 56 }, espnId: '226309' },
      { name: 'Bradley Barcola', number: 29, position: 'LW', ratingOverall: 79, stats: { pace: 87, shooting: 72, passing: 74, dribbling: 82, defending: 30, physical: 63 }, espnId: '335015' },
      { name: 'Kylian Mbappé', number: 9, position: 'ST', ratingOverall: 91, stats: { pace: 97, shooting: 90, passing: 80, dribbling: 92, defending: 36, physical: 78 }, espnId: '226315' },
    ],
  },
};

const LAST_NAMES = ['Smith', 'Müller', 'Garcia', 'Rossi', 'Dubois', 'De Jong', 'Silva', 'Peeters', 'MacDonald', 'Yılmaz', 'Fernandez', 'Gomez', 'Martin', 'Bianchi', 'Schulz', 'Davies', 'Walker', 'Okan', 'Kovacic', 'Rakitic'];
const FIRST_NAMES = ['John', 'Thomas', 'David', 'Marco', 'Lucas', 'Frenkie', 'Cristiano', 'Kevin', 'Andy', 'Burak', 'Oliver', 'Manuel', 'Antoine', 'Alessandro', 'Jonas', 'Harry', 'Theo', 'Hakan', 'Luka', 'Ivan'];

// Procedural squad generator based on team name and rating
export function generateTeamData(name: string, leagueId: string, season: string): Team {
  const isReal = REAL_SQUADS[name] !== undefined;
  
  let baseRating = 78;
  if (name.includes('City') || name.includes('Real') || name.includes('Bayern') || name.includes('Barcelona') || name.includes('PSG') || name.includes('Inter') || name.includes('Arsenal') || name.includes('Liverpool')) {
    baseRating = 87;
  } else if (name.includes('United') || name.includes('Atletico') || name.includes('Dortmund') || name.includes('Milan') || name.includes('Leverkusen') || name.includes('Juventus') || name.includes('Sporting') || name.includes('Porto') || name.includes('Benfica')) {
    baseRating = 83;
  } else if (name.includes('Everton') || name.includes('Sevilla') || name.includes('Valencia') || name.includes('Lazio') || name.includes('Marseille') || name.includes('Ajax') || name.includes('Galatasaray') || name.includes('Fenerbahçe')) {
    baseRating = 80;
  } else {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }
    baseRating = 72 + (hash % 10);
  }

  const seasonIndex = SEASONS.indexOf(season);
  baseRating = baseRating - (seasonIndex * 1);

  const finalRatingOverall = baseRating;
  const ratingAttack = Math.min(99, baseRating + (name.charCodeAt(0) % 5) - 2);
  const ratingMidfield = Math.min(99, baseRating + (name.charCodeAt(1) % 5) - 2);
  const ratingDefence = Math.min(99, baseRating + (name.charCodeAt(2) % 5) - 2);

  let formation = '4-3-3';
  if ((name.charCodeAt(0) % 3) === 0) formation = '4-4-2';
  else if ((name.charCodeAt(0) % 3) === 1) formation = '3-5-2';

  const defaultPlayers: Player[] = [];

  if (isReal) {
    // Load handcrafted squad (with fallback to 2023-2024 if the selected season isn't explicitly defined)
    const teamSquads = REAL_SQUADS[name];
    const realPlayers = teamSquads[season] || teamSquads['2023-2024'];
    realPlayers.forEach((p, idx) => {
      // Use clean, real player headshots from ESPN CDN
      const photoUrl = `https://a.espncdn.com/i/headshots/soccer/players/full/${p.espnId}.png`;
      
      defaultPlayers.push({
        id: `${name.replace(/\s+/g, '-').toLowerCase()}-${idx}`,
        name: p.name || 'Unknown Player',
        number: p.number || (idx + 1),
        position: p.position || 'CM',
        photoUrl: photoUrl,
        ratingOverall: p.ratingOverall || 80,
        stats: p.stats || { pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physical: 70 }
      });
    });
  } else {
    // Generate starting 11 procedurally
    const positionsList = getPositionsForFormation(formation);
    
    positionsList.forEach((pos, idx) => {
      const fNameIdx = (name.charCodeAt(0) + idx * 7) % FIRST_NAMES.length;
      const lNameIdx = (name.charCodeAt(1) + idx * 11) % LAST_NAMES.length;
      const pName = `${FIRST_NAMES[fNameIdx]} ${LAST_NAMES[lNameIdx]}`;
      const jerseyNumber = pos === 'GK' ? 1 : (idx + 2);

      const pRating = Math.min(99, baseRating + (idx % 5) - 2);
      const pStats = getStatsForPosition(pos, pRating);
      
      // Fallback: A nice neutral, high-quality soccer jersey silhouette placeholder card for generated players
      const fallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(pName)}&radius=50&backgroundColor=b2d8d8`;

      defaultPlayers.push({
        id: `${name.replace(/\s+/g, '-').toLowerCase()}-${idx}`,
        name: pName,
        number: jerseyNumber,
        position: pos,
        photoUrl: fallbackUrl,
        ratingOverall: pRating,
        stats: pStats
      });
    });
  }

  return {
    id: `${name.replace(/\s+/g, '-').toLowerCase()}-${season.replace(/-/g, '')}`,
    name,
    season,
    leagueId,
    logoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffffff`,
    ratingOverall: finalRatingOverall,
    ratingAttack,
    ratingMidfield,
    ratingDefence,
    defaultFormation: formation,
    players: defaultPlayers
  };
}

function getPositionsForFormation(formation: string): string[] {
  switch (formation) {
    case '4-4-2':
      return ['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CM', 'RM', 'ST', 'ST'];
    case '3-5-2':
      return ['GK', 'CB', 'CB', 'CB', 'LWB', 'CDM', 'CM', 'CAM', 'RWB', 'ST', 'ST'];
    case '4-3-3':
    default:
      return ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
  }
}

function getStatsForPosition(position: string, rating: number): PlayerStats {
  const base = rating - 5;

  switch (position) {
    case 'GK':
      return {
        pace: Math.min(99, Math.round(base - 20)),
        shooting: 12,
        passing: Math.min(99, Math.round(base + 10)),
        dribbling: Math.min(99, Math.round(base - 10)),
        defending: Math.min(99, Math.round(base + 15)),
        physical: Math.min(99, Math.round(base + 5))
      };
    case 'LB':
    case 'RB':
    case 'LWB':
    case 'RWB':
      return {
        pace: Math.min(99, Math.round(base + 12)),
        shooting: Math.min(99, Math.round(base - 15)),
        passing: Math.min(99, Math.round(base + 2)),
        dribbling: Math.min(99, Math.round(base + 4)),
        defending: Math.min(99, Math.round(base + 5)),
        physical: Math.min(99, Math.round(base + 2))
      };
    case 'CB':
      return {
        pace: Math.min(99, Math.round(base - 5)),
        shooting: Math.min(99, Math.round(base - 25)),
        passing: Math.min(99, Math.round(base - 5)),
        dribbling: Math.min(99, Math.round(base - 10)),
        defending: Math.min(99, Math.round(base + 12)),
        physical: Math.min(99, Math.round(base + 12))
      };
    case 'CDM':
      return {
        pace: Math.min(99, Math.round(base - 2)),
        shooting: Math.min(99, Math.round(base - 10)),
        passing: Math.min(99, Math.round(base + 5)),
        dribbling: Math.min(99, Math.round(base + 2)),
        defending: Math.min(99, Math.round(base + 10)),
        physical: Math.min(99, Math.round(base + 8))
      };
    case 'CM':
      return {
        pace: Math.min(99, Math.round(base)),
        shooting: Math.min(99, Math.round(base - 5)),
        passing: Math.min(99, Math.round(base + 10)),
        dribbling: Math.min(99, Math.round(base + 6)),
        defending: Math.min(99, Math.round(base)),
        physical: Math.min(99, Math.round(base + 2))
      };
    case 'CAM':
      return {
        pace: Math.min(99, Math.round(base + 5)),
        shooting: Math.min(99, Math.round(base + 5)),
        passing: Math.min(99, Math.round(base + 12)),
        dribbling: Math.min(99, Math.round(base + 12)),
        defending: Math.min(99, Math.round(base - 25)),
        physical: Math.min(99, Math.round(base - 10))
      };
    case 'LW':
    case 'RW':
    case 'LM':
    case 'RM':
      return {
        pace: Math.min(99, Math.round(base + 15)),
        shooting: Math.min(99, Math.round(base + 5)),
        passing: Math.min(99, Math.round(base + 4)),
        dribbling: Math.min(99, Math.round(base + 12)),
        defending: Math.min(99, Math.round(base - 20)),
        physical: Math.min(99, Math.round(base - 5))
      };
    case 'ST':
      return {
        pace: Math.min(99, Math.round(base + 8)),
        shooting: Math.min(99, Math.round(base + 15)),
        passing: Math.min(99, Math.round(base - 8)),
        dribbling: Math.min(99, Math.round(base + 6)),
        defending: Math.min(99, Math.round(base - 30)),
        physical: Math.min(99, Math.round(base + 8))
      };
    default:
      return {
        pace: base,
        shooting: base,
        passing: base,
        dribbling: base,
        defending: base,
        physical: base
      };
  }
}
