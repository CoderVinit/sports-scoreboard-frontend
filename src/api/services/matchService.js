import apiClient from '../client';

const matchService = {
  // Get all matches
  getAllMatches: async () => {
    const response = await apiClient.get('/matches');
    return response.data;
  },

  // Get live matches
  getLiveMatches: async () => {
    const response = await apiClient.get('/matches/live');
    return response.data;
  },

  // Get upcoming matches
  getUpcomingMatches: async () => {
    const response = await apiClient.get('/matches/upcoming');
    return response.data;
  },

  // Get match details
  getMatchDetails: async (matchId) => {
    const response = await apiClient.get(`/matches/${matchId}`);
    return response.data;
  },

  // Get match statistics
  getMatchStatistics: async (matchId) => {
    const response = await apiClient.get(`/matches/${matchId}/statistics`);
    return response.data;
  },

  // Get match commentary
  getMatchCommentary: async (matchId) => {
    const response = await apiClient.get(`/matches/${matchId}/commentary`);
    return response.data;
  },

  // Get live scorecard
  getLiveScorecard: async (matchId) => {
    const response = await apiClient.get(`/matches/${matchId}/live-scorecard`);
    return response.data;
  },

  // Create match (admin)
  createMatch: async (matchData) => {
    const response = await apiClient.post('/matches', matchData);
    return response.data;
  },

  // Update match status (admin)
  updateMatchStatus: async (matchId, status) => {
    const response = await apiClient.put(`/matches/${matchId}`, { status });
    return response.data;
  },

  // Delete match (admin)
  deleteMatch: async (matchId) => {
    const response = await apiClient.delete(`/matches/${matchId}`);
    return response.data;
  },
};

export default matchService;
