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
import { API_BASE_URL } from '../../config/api.config';

const AdminTeams = () => {
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.teams);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    shortName: '',
    logo: ''
  });

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleCreateTeam = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newTeam.name);
      formData.append('shortName', newTeam.shortName);

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setOpenDialog(false);
        setNewTeam({ name: '', shortName: '', logo: '' });
        setLogoFile(null);
        dispatch(fetchTeams());
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setNewTeam({
      name: team.name,
      shortName: team.shortName,
      logo: team.logo || ''
    });
    setLogoFile(null);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleUpdateTeam = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newTeam.name);
      formData.append('shortName', newTeam.shortName);

      if (selectedTeam && selectedTeam.logo) {
        formData.append('existingLogo', selectedTeam.logo);
      }

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(`${API_BASE_URL}/teams/${selectedTeam.id}`, {
        method: 'PUT',
        body: formData,
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
    setLogoFile(null);
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
              <Button
                variant="outlined"
                component="label"
                size="small"
              >
                {newTeam.logo ? 'Change Logo' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // For both create and update, keep file in state and preview locally
                    setLogoFile(file);
                    const previewUrl = URL.createObjectURL(file);
                    setNewTeam({ ...newTeam, logo: previewUrl });
                  }}
                />
              </Button>
              {newTeam.logo && (
                <>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Logo preview:
                  </Typography>
                  <img
                    src={newTeam.logo}
                    alt="Team logo preview"
                    style={{ marginTop: 4, width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                </>
              )}
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
