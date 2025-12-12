import apiClient from '../client';

const ballService = {
  // Get all balls
  getAllBalls: async () => {
    const response = await apiClient.get('/balls');
    return response.data;
  },

  // Get ball by ID
  getBallById: async (ballId) => {
    const response = await apiClient.get(`/balls/${ballId}`);
    return response.data;
  },

  // Get balls by innings
  getBallsByInnings: async (inningsId) => {
    const response = await apiClient.get(`/balls?inningsId=${inningsId}`);
    return response.data;
  },

  // Get recent balls for an innings
  getRecentBalls: async (inningsId, limit = 5) => {
    const response = await apiClient.get(`/balls/innings/${inningsId}/recent?limit=${limit}`);
    return response.data;
  },

  // Create ball (admin - record ball in score entry)
  createBall: async (ballData) => {
    const response = await apiClient.post('/balls', ballData);
    return response.data;
  },

  // Update ball (admin)
  updateBall: async (ballId, ballData) => {
    const response = await apiClient.put(`/balls/${ballId}`, ballData);
    return response.data;
  },

  // Delete ball (admin)
  deleteBall: async (ballId) => {
    const response = await apiClient.delete(`/balls/${ballId}`);
    return response.data;
  },
};

export default ballService;
