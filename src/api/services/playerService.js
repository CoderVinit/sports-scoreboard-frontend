import apiClient from '../client';

const playerService = {
  // Get all players
  getAllPlayers: async () => {
    const response = await apiClient.get('/players');
    return response.data;
  },

  // Get player by ID
  getPlayerById: async (playerId) => {
    const response = await apiClient.get(`/players/${playerId}`);
    return response.data;
  },

  // Get players by team
  getPlayersByTeam: async (teamId) => {
    const response = await apiClient.get(`/players?teamId=${teamId}`);
    return response.data;
  },

  // Create player (admin)
  createPlayer: async (playerData) => {
    const response = await apiClient.post('/players', playerData);
    return response.data;
  },

  // Update player (admin)
  updatePlayer: async (playerId, playerData) => {
    const response = await apiClient.put(`/players/${playerId}`, playerData);
    return response.data;
  },

  // Delete player (admin)
  deletePlayer: async (playerId) => {
    const response = await apiClient.delete(`/players/${playerId}`);
    return response.data;
  },
};

export default playerService;
