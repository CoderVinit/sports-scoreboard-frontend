// Mock data for cricket scoreboard

export const mockTeams = [
  {
    id: 1,
    name: 'India Under-19',
    shortName: 'IND U19',
    logo: '🇮🇳',
    country: 'India',
  },
  {
    id: 2,
    name: 'UAE Under-19',
    shortName: 'UAE U19',
    logo: '🇦🇪',
    country: 'UAE',
  },
  {
    id: 3,
    name: 'Pakistan Under-19',
    shortName: 'PAK U19',
    logo: '🇵🇰',
    country: 'Pakistan',
  },
  {
    id: 4,
    name: 'Malaysia Under-19',
    shortName: 'MAL U19',
    logo: '🇲🇾',
    country: 'Malaysia',
  },
];

export const mockPlayers = [
  // India Players
  { id: 1, name: 'Kanishk Chouhan', teamId: 1, role: 'Batsman', battingStyle: 'Right-hand bat' },
  { id: 2, name: 'Abhigyan Kundu', teamId: 1, role: 'Wicket Keeper', battingStyle: 'Left-hand bat' },
  { id: 3, name: 'Vihaan Malhotra', teamId: 1, role: 'Batsman', battingStyle: 'Right-hand bat' },
  { id: 4, name: 'Uddish Suri', teamId: 1, role: 'Bowler', bowlingStyle: 'Right-arm medium' },
  { id: 5, name: 'Yug Sharma', teamId: 1, role: 'Bowler', bowlingStyle: 'Left-arm fast' },
  
  // UAE Players
  { id: 6, name: 'Ahmed Hassan', teamId: 2, role: 'Batsman', battingStyle: 'Right-hand bat' },
  { id: 7, name: 'Mohammed Ali', teamId: 2, role: 'Bowler', bowlingStyle: 'Right-arm fast' },
  { id: 8, name: 'Khalid Ibrahim', teamId: 2, role: 'All-rounder', battingStyle: 'Right-hand bat' },
  
  // Pakistan Players
  { id: 9, name: 'Saad Ahmed', teamId: 3, role: 'Batsman', battingStyle: 'Right-hand bat' },
  { id: 10, name: 'Hassan Ali', teamId: 3, role: 'Bowler', bowlingStyle: 'Right-arm fast' },
  
  // Malaysia Players
  { id: 11, name: 'Ahmad Faiz', teamId: 4, role: 'Batsman', battingStyle: 'Right-hand bat' },
  { id: 12, name: 'Syed Rahman', teamId: 4, role: 'Bowler', bowlingStyle: 'Right-arm spin' },
];

export const mockMatches = [
  {
    id: 1,
    teamA: mockTeams[0],
    teamB: mockTeams[1],
    venue: 'ICCA Dubai',
    date: '2025-12-12',
    time: '09:00',
    status: 'live',
    matchType: 'T20',
    tournament: 'Under-19s Asia Cup',
    tossWinner: mockTeams[1],
    tossDecision: 'field',
    currentInnings: 1,
    result: null,
  },
  {
    id: 2,
    teamA: mockTeams[2],
    teamB: mockTeams[3],
    venue: 'Dubai International Cricket Stadium',
    date: '2025-12-12',
    time: '14:00',
    status: 'live',
    matchType: 'T20',
    tournament: 'Under-19s Asia Cup',
    tossWinner: mockTeams[3],
    tossDecision: 'field',
    currentInnings: 1,
    result: null,
  },
  {
    id: 3,
    teamA: mockTeams[0],
    teamB: mockTeams[2],
    venue: 'ICCA Dubai',
    date: '2025-12-13',
    time: '09:00',
    status: 'upcoming',
    matchType: 'T20',
    tournament: 'Under-19s Asia Cup',
    tossWinner: null,
    tossDecision: null,
    currentInnings: null,
    result: null,
  },
];

export const mockInnings = [
  {
    id: 1,
    matchId: 1,
    battingTeamId: 1,
    bowlingTeamId: 2,
    inningsNumber: 1,
    runs: 392,
    wickets: 5,
    overs: 46.5,
    extras: 15,
    isDeclared: false,
    isCompleted: false,
  },
];

export const mockBalls = [
  // Sample balls for the current over
  { id: 1, inningsId: 1, over: 46, ball: 1, runs: 0, isWicket: false, extras: 0, batsmanId: 1, bowlerId: 7 },
  { id: 2, inningsId: 1, over: 46, ball: 2, runs: 6, isWicket: false, extras: 0, batsmanId: 1, bowlerId: 7 },
  { id: 3, inningsId: 1, over: 46, ball: 3, runs: 4, isWicket: false, extras: 0, batsmanId: 1, bowlerId: 7 },
  { id: 4, inningsId: 1, over: 46, ball: 4, runs: 1, isWicket: false, extras: 0, batsmanId: 1, bowlerId: 7 },
  { id: 5, inningsId: 1, over: 46, ball: 5, runs: 1, isWicket: false, extras: 0, batsmanId: 3, bowlerId: 7 },
];

export const mockBattingStats = [
  {
    playerId: 1,
    playerName: 'Kanishk Chouhan',
    runs: 20,
    balls: 8,
    fours: 1,
    sixes: 2,
    strikeRate: 250.0,
    isOut: false,
    dismissal: null,
  },
  {
    playerId: 2,
    playerName: 'Abhigyan Kundu',
    runs: 6,
    balls: 6,
    fours: 0,
    sixes: 0,
    strikeRate: 100.0,
    isOut: false,
    dismissal: null,
  },
  {
    playerId: 3,
    playerName: 'Vihaan Malhotra',
    runs: 69,
    balls: 55,
    fours: 8,
    sixes: 2,
    strikeRate: 125.45,
    isOut: true,
    dismissal: 'b Yug Sharma',
  },
];

export const mockBowlingStats = [
  {
    playerId: 4,
    playerName: 'Uddish Suri',
    overs: 9.5,
    maidens: 0,
    runs: 76,
    wickets: 2,
    economy: 7.72,
    wides: 19,
    noBalls: 5,
  },
  {
    playerId: 5,
    playerName: 'Yug Sharma',
    overs: 8,
    maidens: 1,
    runs: 48,
    wickets: 1,
    economy: 6.0,
    wides: 26,
    noBalls: 7,
  },
];

export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@cricket.com',
    role: 'admin',
    password: 'admin123', // In real app, this would be hashed
  },
  {
    id: 2,
    username: 'user',
    email: 'user@cricket.com',
    role: 'user',
    password: 'user123',
  },
];

// Commentary data
export const mockCommentary = [
  { id: 1, over: 46.5, ball: 5, text: 'Yug Sharma to Vihaan Malhotra, 1 run, worked away towards square leg for a single' },
  { id: 2, over: 46.5, ball: 4, text: 'Yug Sharma to Kanishk Chouhan, 1 run, pushed towards mid-on for a quick single' },
  { id: 3, over: 46.5, ball: 3, text: 'Yug Sharma to Kanishk Chouhan, FOUR! Beautiful drive through the covers' },
  { id: 4, over: 46.5, ball: 2, text: 'Yug Sharma to Kanishk Chouhan, SIX! Massive hit over long-on!' },
  { id: 5, over: 46.5, ball: 1, text: 'Yug Sharma to Kanishk Chouhan, no run, defended back to the bowler' },
];

// Partnership data
export const mockPartnerships = [
  {
    id: 1,
    runs: 26,
    balls: 13,
    batsman1: 'Vihaan Malhotra',
    batsman2: 'Kanishk Chouhan',
    batsman1Contribution: 13,
    batsman2Contribution: 13,
  },
];

// Fall of wickets
export const mockFallOfWickets = [
  { wicket: 1, runs: 45, over: 8.2, batsman: 'Player 1' },
  { wicket: 2, runs: 89, over: 15.4, batsman: 'Player 2' },
  { wicket: 3, runs: 156, over: 28.1, batsman: 'Player 3' },
  { wicket: 4, runs: 234, over: 38.3, batsman: 'Player 4' },
  { wicket: 5, runs: 366, over: 44.0, batsman: 'Vihaan Malhotra' },
];
