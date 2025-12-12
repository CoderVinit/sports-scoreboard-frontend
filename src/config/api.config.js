// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  
  // Teams
  TEAMS: '/teams',
  TEAM_BY_ID: (id) => `/teams/${id}`,
  
  // Players
  PLAYERS: '/players',
  PLAYER_BY_ID: (id) => `/players/${id}`,
  PLAYERS_BY_TEAM: (teamId) => `/teams/${teamId}/players`,
  
  // Matches
  MATCHES: '/matches',
  MATCH_BY_ID: (id) => `/matches/${id}`,
  LIVE_MATCHES: '/matches?status=live',
  
  // Innings
  INNINGS: '/innings',
  INNINGS_BY_MATCH: (matchId) => `/matches/${matchId}/innings`,
  
  // Balls
  BALLS: '/balls',
  BALLS_BY_INNINGS: (inningsId) => `/innings/${inningsId}/balls`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
