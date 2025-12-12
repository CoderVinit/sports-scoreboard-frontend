import { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Grid, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { matchService, teamService } from '../../api/services';
import EditIcon from '@mui/icons-material/Edit';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import AddIcon from '@mui/icons-material/Add';

const AdminMatchesStatic = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
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

  const handleCreateMatch = async () => {
    try {
      setSubmitting(true);
      const matchData = {
        ...newMatch,
        matchDate: new Date(newMatch.matchDate).toISOString(),
        battingFirstId: newMatch.tossDecision === 'bat' ? newMatch.tossWinnerId : 
                        (newMatch.tossWinnerId === newMatch.team1Id ? newMatch.team2Id : newMatch.team1Id),
        status: 'scheduled'
      };
      
      await matchService.createMatch(matchData);
      setSnackbar({ open: true, message: 'Match created successfully!', severity: 'success' });
      setOpenDialog(false);
      
      // Refresh matches
      const response = await matchService.getAllMatches();
      setMatches(response.data || response.matches || []);
      
      // Reset form
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
    } catch (error) {
      console.error('Error creating match:', error);
      setSnackbar({ open: true, message: 'Failed to create match', severity: 'error' });
    } finally {
      setSubmitting(false);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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

      {/* Create Match Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Match</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Team 1"
                value={newMatch.team1Id}
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
                onChange={(e) => setNewMatch({ ...newMatch, totalOvers: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Venue"
                value={newMatch.venue}
                onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={newMatch.city}
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Series"
                value={newMatch.series}
                onChange={(e) => setNewMatch({ ...newMatch, series: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Toss Winner"
                value={newMatch.tossWinnerId}
                onChange={(e) => setNewMatch({ ...newMatch, tossWinnerId: e.target.value })}
              >
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
                label="Toss Decision"
                value={newMatch.tossDecision}
                onChange={(e) => setNewMatch({ ...newMatch, tossDecision: e.target.value })}
              >
                <MenuItem value="bat">Bat</MenuItem>
                <MenuItem value="bowl">Bowl</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateMatch} 
            variant="contained" 
            disabled={submitting || !newMatch.team1Id || !newMatch.team2Id || !newMatch.venue || !newMatch.matchDate}
          >
            {submitting ? 'Creating...' : 'Create Match'}
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
                    onClick={() => alert('Edit match feature (static demo)')}
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
    </Container>
  );
};

export default AdminMatchesStatic;
