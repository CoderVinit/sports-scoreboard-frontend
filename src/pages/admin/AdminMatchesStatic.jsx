import { useState, useEffect } from 'react';
import { Paper, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Grid, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { matchService, teamService } from '../../api/services';
import EditIcon from '@mui/icons-material/Edit';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import AddIcon from '@mui/icons-material/Add';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminMatchesStatic = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newMatch, setNewMatch] = useState({
    team1Id: '',
    team2Id: '',
    matchFormat: 'T20',
    totalOvers: 20,
    venue: '',
    city: '',
    matchDate: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    series: 'Team Horizon Premier League',
    tossWinnerId: '',
    tossDecision: 'bat',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [matchesData, teamsData] = await Promise.all([
          matchService.getAllMatches(),
          teamService.getAllTeams()
        ]);
        setMatches(matchesData.data || matchesData.matches || []);
        setTeams(teamsData.data || teamsData.teams || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const navigate = useNavigate();

  const handleEditMatch = (match) => {
    setSelectedMatch(match);
    setEditMode(true);
    setNewMatch({
      team1Id: match.team1Id || match.team1?.id || '',
      team2Id: match.team2Id || match.team2?.id || '',
      matchFormat: match.matchFormat || 'T20',
      totalOvers: match.totalOvers || 20,
      venue: match.venue || '',
      city: match.city || '',
      matchDate: new Date(match.matchDate).toISOString().slice(0, 16),
      series: match.series || 'Team Horizon Premier League',
      tossWinnerId: match.tossWinnerId || '',
      tossDecision: match.tossDecision || 'bat',
    });
    setOpenDialog(true);
  };

  const handleUpdateMatch = async () => {
    try {
      setSubmitting(true);
      const matchData = {
        ...newMatch,
        matchDate: new Date(newMatch.matchDate).toISOString(),
        // Convert empty strings to null for toss fields
        tossWinnerId: newMatch.tossWinnerId || null,
        tossDecision: newMatch.tossDecision || null,
      };
      
      // Add batting first ID if both toss winner and decision are selected
      if (newMatch.tossWinnerId && newMatch.tossDecision) {
        matchData.battingFirstId = newMatch.tossDecision === 'bat' ? newMatch.tossWinnerId : 
                          (newMatch.tossWinnerId === newMatch.team1Id ? newMatch.team2Id : newMatch.team1Id);
      }
      
      await matchService.updateMatch(selectedMatch.id, matchData);
      setSnackbar({ open: true, message: 'Match updated successfully!', severity: 'success' });
      handleCloseDialog();
      
      // Refresh matches
      const response = await matchService.getAllMatches();
      setMatches(response.data || response.matches || []);
    } catch (error) {
      console.error('Error updating match:', error);
      setSnackbar({ open: true, message: 'Failed to update match', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateMatch = async () => {
    try {
      setSubmitting(true);
      const matchData = {
        ...newMatch,
        matchDate: new Date(newMatch.matchDate).toISOString(),
        // Convert empty strings to null for toss fields
        tossWinnerId: newMatch.tossWinnerId || null,
        tossDecision: newMatch.tossDecision || null,
      };
      
      // Add batting first ID if both toss winner and decision are selected
      if (newMatch.tossWinnerId && newMatch.tossDecision) {
        matchData.battingFirstId = newMatch.tossDecision === 'bat' ? newMatch.tossWinnerId : 
                          (newMatch.tossWinnerId === newMatch.team1Id ? newMatch.team2Id : newMatch.team1Id);
      }
      
      await matchService.createMatch(matchData);
      setSnackbar({ open: true, message: 'Match created successfully!', severity: 'success' });
      handleCloseDialog();
      
      // Refresh matches
      const response = await matchService.getAllMatches();
      setMatches(response.data || response.matches || []);
    } catch (error) {
      console.error('Error creating match:', error);
      setSnackbar({ open: true, message: 'Failed to create match', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedMatch(null);
    setNewMatch({
      team1Id: '',
      team2Id: '',
      matchFormat: 'T20',
      totalOvers: 20,
      venue: '',
      city: '',
      matchDate: new Date().toISOString().slice(0, 16),
      series: 'Team Horizon Premier League',
      tossWinnerId: '',
      tossDecision: 'bat',
    });
  };

  const handleSubmit = () => {
    if (editMode) {
      handleUpdateMatch();
    } else {
      handleCreateMatch();
    }
  };

  const handleMatchFormatChange = (format) => {
    const oversMap = {
      'T20': 20,
      'T10': 10,
      'ODI': 50,
      'Test': 90,
      'The Hundred': 100
    };
    setNewMatch({ ...newMatch, matchFormat: format, totalOvers: oversMap[format] || 20 });
  };

  return (
    <AdminLayout
      title="Matches"
      subtitle="Create and maintain fixtures for the tournament."
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
            Manage Matches
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create New Match
          </Button>
        </Box>
      </Paper>

      {/* Create / Edit Match Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Match' : 'Create New Match'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure the basic details, venue, schedule and optional toss for this match.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Team 1"
                value={newMatch.team1Id}
                margin="dense"
                size="small"
                onChange={(e) => setNewMatch({ ...newMatch, team1Id: e.target.value })}
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
                select
                fullWidth
                label="Team 2"
                value={newMatch.team2Id}
                margin="dense"
                size="small"
                onChange={(e) => setNewMatch({ ...newMatch, team2Id: e.target.value })}
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id} disabled={team.id === newMatch.team1Id}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Match Format"
                value={newMatch.matchFormat}
                margin="dense"
                size="small"
                onChange={(e) => handleMatchFormatChange(e.target.value)}
              >
                <MenuItem value="T20">T20</MenuItem>
                <MenuItem value="T10">T10</MenuItem>
                <MenuItem value="ODI">ODI</MenuItem>
                <MenuItem value="Test">Test</MenuItem>
                <MenuItem value="The Hundred">The Hundred</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Total Overs"
                value={newMatch.totalOvers}
                margin="dense"
                size="small"
                onChange={(e) => setNewMatch({ ...newMatch, totalOvers: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Venue"
                value={newMatch.venue}
                margin="dense"
                size="small"
                onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={newMatch.city}
                margin="dense"
                size="small"
                onChange={(e) => setNewMatch({ ...newMatch, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Match Date & Time"
                value={newMatch.matchDate}
                onChange={(e) => setNewMatch({ ...newMatch, matchDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Series"
                value={newMatch.series}
                margin="dense"
                size="small"
                onChange={(e) => setNewMatch({ ...newMatch, series: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Toss Winner (Optional)"
                value={newMatch.tossWinnerId}
                margin="dense"
                size="small"
                onChange={(e) => setNewMatch({ ...newMatch, tossWinnerId: e.target.value })}
                helperText="Leave blank if toss is not yet decided."
              >
                <MenuItem value="">None (Not selected)</MenuItem>
                {teams.filter(t => t.id === newMatch.team1Id || t.id === newMatch.team2Id).map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Toss Decision (Optional)"
                value={newMatch.tossDecision}
                onChange={(e) => setNewMatch({ ...newMatch, tossDecision: e.target.value })}
                disabled={!newMatch.tossWinnerId}
                margin="dense"
                size="small"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="bat">Bat</MenuItem>
                <MenuItem value="bowl">Bowl</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitting || !newMatch.team1Id || !newMatch.team2Id || !newMatch.venue || !newMatch.matchDate}
          >
            {submitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Match' : 'Create Match')}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Match ID</strong></TableCell>
              <TableCell><strong>Teams</strong></TableCell>
              <TableCell><strong>Venue</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No matches found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>#{match.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {match.team1?.shortName || match.team1?.name || 'Team 1'} vs {match.team2?.shortName || match.team2?.name || 'Team 2'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {match.series || match.tournament || 'Tournament'}
                  </Typography>
                </TableCell>
                <TableCell>{match.venue}</TableCell>
                <TableCell>{new Date(match.matchDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={match.status}
                    color={match.status === 'live' ? 'error' : match.status === 'upcoming' ? 'info' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditMatch(match)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  {match.status === 'live' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={<ScoreboardIcon />}
                      onClick={() => navigate(`/admin/score-entry/${match.id}`)}
                    >
                      Score Entry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )))
               }
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
};

export default AdminMatchesStatic;
