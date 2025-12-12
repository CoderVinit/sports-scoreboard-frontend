import apiClient from '../client';

const teamService = {
  // Get all teams
  getAllTeams: async () => {
    const response = await apiClient.get('/teams');
    return response.data;
  },

  // Get team by ID
  getTeamById: async (teamId) => {
    const response = await apiClient.get(`/teams/${teamId}`);
    return response.data;
  },

  // Create team (admin)
  createTeam: async (teamData) => {
    const response = await apiClient.post('/teams', teamData);
    return response.data;
  },

  // Update team (admin)
  updateTeam: async (teamId, teamData) => {
    const response = await apiClient.put(`/teams/${teamId}`, teamData);
    return response.data;
  },

  // Delete team (admin)
  deleteTeam: async (teamId) => {
    const response = await apiClient.delete(`/teams/${teamId}`);
    return response.data;
  },
};

export default teamService;
