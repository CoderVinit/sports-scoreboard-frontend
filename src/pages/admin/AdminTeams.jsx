import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid
} from '@mui/material';
import { fetchTeams, createTeam } from '../../features/teams/teamSlice';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminTeams = () => {
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.teams);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    shortName: '',
    logo: ''
  });

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleCreateTeam = async () => {
    await dispatch(createTeam(newTeam));
    setOpenDialog(false);
    setNewTeam({ name: '', shortName: '', logo: '' });
    dispatch(fetchTeams());
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setNewTeam({
      name: team.name,
      shortName: team.shortName,
      logo: team.logo || ''
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleUpdateTeam = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/teams/${selectedTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      });

      if (response.ok) {
        dispatch(fetchTeams());
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedTeam(null);
    setNewTeam({ name: '', shortName: '', logo: '' });
  };

  const handleSubmit = () => {
    if (editMode) {
      handleUpdateTeam();
    } else {
      handleCreateTeam();
    }
  };

  return (
    <AdminLayout
      title="Teams"
      subtitle="Add and manage teams used across all matches."
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Teams
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => setOpenDialog(true)}
        >
          Add New Team
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Team Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Short Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Players Count</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams && Array.isArray(teams) && teams.length > 0 ? (
              teams.map((team) => (
                <TableRow key={team.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {team.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{team.shortName}</TableCell>
                  <TableCell>{team.playerCount || 0}</TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleEditTeam(team)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="textSecondary">No teams available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Team' : 'Add New Team'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the official details for this team as they should appear across the scoreboard.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Team Name"
                value={newTeam.name}
                margin="dense"
                size="small"
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Name (3-4 letters)"
                value={newTeam.shortName}
                margin="dense"
                size="small"
                inputProps={{ maxLength: 4 }}
                helperText="Shown on scorecards and tables (e.g. IND, AUS)."
                onChange={(e) => setNewTeam({ ...newTeam, shortName: e.target.value.toUpperCase() })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Logo URL (optional)"
                value={newTeam.logo}
                margin="dense"
                size="small"
                type="url"
                onChange={(e) => setNewTeam({ ...newTeam, logo: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newTeam.name.trim() || !newTeam.shortName.trim()}
          >
            {editMode ? 'Update Team' : 'Add Team'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTeams;
