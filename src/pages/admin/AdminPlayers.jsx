import { useEffect, useState } from 'react';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, MenuItem, Chip, Snackbar, Alert, Avatar,
  IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import playerService from '../../api/services/playerService';
import teamService from '../../api/services/teamService';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    teamId: '',
    jerseyNumber: '',
    role: 'batsman',
    battingStyle: '',
    bowlingStyle: '',
    dateOfBirth: '',
    nationality: '',
    photo: ''
  });

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await playerService.getAllPlayers();
      setPlayers(response.data || response);
    } catch (error) {
      console.error('Error fetching players:', error);
      setSnackbar({ open: true, message: 'Failed to fetch players', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamService.getAllTeams();
      setTeams(response.data || response);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleOpenDialog = (player = null) => {
    if (player) {
      setEditMode(true);
      setCurrentPlayer(player);
      setNewPlayer({
        name: player.name || '',
        teamId: player.teamId || '',
        jerseyNumber: player.jerseyNumber || '',
        role: player.role || 'batsman',
        battingStyle: player.battingStyle || '',
        bowlingStyle: player.bowlingStyle || '',
        dateOfBirth: player.dateOfBirth || '',
        nationality: player.nationality || '',
        photo: player.photo || ''
      });
    } else {
      setEditMode(false);
      setCurrentPlayer(null);
      setNewPlayer({
        name: '',
        teamId: '',
        jerseyNumber: '',
        role: 'batsman',
        battingStyle: '',
        bowlingStyle: '',
        dateOfBirth: '',
        nationality: '',
        photo: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentPlayer(null);
  };

  const handleCreatePlayer = async () => {
    try {
      setLoading(true);
      const playerData = {
        ...newPlayer,
        jerseyNumber: newPlayer.jerseyNumber ? parseInt(newPlayer.jerseyNumber) : null,
        teamId: parseInt(newPlayer.teamId)
      };

      if (editMode && currentPlayer) {
        await playerService.updatePlayer(currentPlayer.id, playerData);
        setSnackbar({ open: true, message: 'Player updated successfully!', severity: 'success' });
      } else {
        await playerService.createPlayer(playerData);
        setSnackbar({ open: true, message: 'Player created successfully!', severity: 'success' });
      }

      handleCloseDialog();
      fetchPlayers();
    } catch (error) {
      console.error('Error saving player:', error);
      setSnackbar({ open: true, message: 'Failed to save player', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;

    try {
      await playerService.deletePlayer(playerId);
      setSnackbar({ open: true, message: 'Player deleted successfully!', severity: 'success' });
      fetchPlayers();
    } catch (error) {
      console.error('Error deleting player:', error);
      setSnackbar({ open: true, message: 'Failed to delete player', severity: 'error' });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'batsman': return 'primary';
      case 'bowler': return 'secondary';
      case 'all-rounder': return 'success';
      case 'wicket-keeper': return 'warning';
      default: return 'default';
    }
  };

  // Filter players based on selected team
  const filteredPlayers = selectedTeamId 
    ? players.filter(player => player.teamId === parseInt(selectedTeamId))
    : players;

  return (
    <AdminLayout
      title="Players"
      subtitle="Maintain player profiles used in scorecards and statistics."
    >
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight="bold">
            Manage Players
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Player
          </Button>
        </Box>
      </Paper>

      {/* Team Filter */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Filter by Team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
            >
              <MenuItem value="">All Teams</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="body2" color="textSecondary">
              Showing {filteredPlayers.length} of {players.length} players
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Player</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Team</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Jersey #</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Batting</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bowling</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Matches</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers && Array.isArray(filteredPlayers) && filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <TableRow key={player.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={player.photo} alt={player.name}>
                        {player.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {player.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{player.team?.name || 'N/A'}</TableCell>
                  <TableCell>{player.jerseyNumber || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={player.role} 
                      color={getRoleColor(player.role)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{player.battingStyle?.replace('-', ' ') || '-'}</TableCell>
                  <TableCell>{player.bowlingStyle?.replace(/-/g, ' ') || '-'}</TableCell>
                  <TableCell>{player.matchesPlayed || 0}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDialog(player)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeletePlayer(player.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary">
                    {loading ? 'Loading players...' : 'No players available'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Player Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Player' : 'Add New Player'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Capture the player profile exactly as it should appear in match scorecards.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Player Name"
                value={newPlayer.name}
                margin="dense"
                size="small"
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Team"
                value={newPlayer.teamId}
                margin="dense"
                size="small"
                onChange={(e) => setNewPlayer({ ...newPlayer, teamId: e.target.value })}
                required
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Jersey Number"
                value={newPlayer.jerseyNumber}
                margin="dense"
                size="small"
                onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Role"
                value={newPlayer.role}
                margin="dense"
                size="small"
                onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })}
                required
              >
                <MenuItem value="batsman">Batsman</MenuItem>
                <MenuItem value="bowler">Bowler</MenuItem>
                <MenuItem value="all-rounder">All-Rounder</MenuItem>
                <MenuItem value="wicket-keeper">Wicket-Keeper</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Batting Style"
                value={newPlayer.battingStyle}
                margin="dense"
                size="small"
                onChange={(e) => setNewPlayer({ ...newPlayer, battingStyle: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="right-hand">Right Hand</MenuItem>
                <MenuItem value="left-hand">Left Hand</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Bowling Style"
                value={newPlayer.bowlingStyle}
                margin="dense"
                size="small"
                onChange={(e) => setNewPlayer({ ...newPlayer, bowlingStyle: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="right-arm-fast">Right Arm Fast</MenuItem>
                <MenuItem value="left-arm-fast">Left Arm Fast</MenuItem>
                <MenuItem value="right-arm-medium">Right Arm Medium</MenuItem>
                <MenuItem value="left-arm-medium">Left Arm Medium</MenuItem>
                <MenuItem value="right-arm-off-spin">Right Arm Off Spin</MenuItem>
                <MenuItem value="right-arm-leg-spin">Right Arm Leg Spin</MenuItem>
                <MenuItem value="left-arm-orthodox">Left Arm Orthodox</MenuItem>
                <MenuItem value="left-arm-chinaman">Left Arm Chinaman</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                value={newPlayer.dateOfBirth}
                margin="dense"
                size="small"
                onChange={(e) => setNewPlayer({ ...newPlayer, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nationality"
                value={newPlayer.nationality}
                margin="dense"
                size="small"
                onChange={(e) => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Photo URL"
                value={newPlayer.photo}
                margin="dense"
                size="small"
                type="url"
                onChange={(e) => setNewPlayer({ ...newPlayer, photo: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreatePlayer} 
            variant="contained" 
            disabled={loading || !newPlayer.name || !newPlayer.teamId}
          >
            {loading ? 'Saving...' : editMode ? 'Update Player' : 'Create Player'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPlayers;
