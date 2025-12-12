import apiClient from '../client';

const inningsService = {
  // Get all innings
  getAllInnings: async () => {
    const response = await apiClient.get('/innings');
    return response.data;
  },

  // Get innings by ID
  getInningsById: async (inningsId) => {
    const response = await apiClient.get(`/innings/${inningsId}`);
    return response.data;
  },

  // Get innings by match
  getInningsByMatch: async (matchId) => {
    const response = await apiClient.get(`/innings?matchId=${matchId}`);
    return response.data;
  },

  // Create innings (admin)
  createInnings: async (inningsData) => {
    const response = await apiClient.post('/innings', inningsData);
    return response.data;
  },

  // Update innings (admin)
  updateInnings: async (inningsId, inningsData) => {
    const response = await apiClient.put(`/innings/${inningsId}`, inningsData);
    return response.data;
  },

  // Delete innings (admin)
  deleteInnings: async (inningsId) => {
    const response = await apiClient.delete(`/innings/${inningsId}`);
    return response.data;
  },
};

export default inningsService;
