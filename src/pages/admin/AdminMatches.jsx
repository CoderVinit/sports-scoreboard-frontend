import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Paper, Typography, Box, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid
} from '@mui/material';
import { fetchMatches, createMatch } from '../../features/matches/matchSlice';
import { fetchTeams } from '../../features/teams/teamSlice';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

const AdminMatches = () => {
  const dispatch = useDispatch();
  const { matches, loading } = useSelector((state) => state.matches);
  const { teams } = useSelector((state) => state.teams);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMatch, setNewMatch] = useState({
    team1Id: '',
    team2Id: '',
    matchType: 'T20',
    venue: '',
    matchDate: new Date().toISOString().split('T')[0],
    totalOvers: 20
  });

  useEffect(() => {
    dispatch(fetchMatches());
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleCreateMatch = async () => {
    await dispatch(createMatch(newMatch));
    setOpenDialog(false);
    setNewMatch({
      team1Id: '',
      team2Id: '',
      matchType: 'T20',
      venue: '',
      matchDate: new Date().toISOString().split('T')[0],
      totalOvers: 20
    });
    dispatch(fetchMatches());
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Matches
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => setOpenDialog(true)}
        >
          Create New Match
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Match</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Venue</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches && matches.map((match) => (
              <TableRow key={match.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {match.team1Name} vs {match.team2Name}
                  </Typography>
                </TableCell>
                <TableCell>{match.matchType}</TableCell>
                <TableCell>{match.venue}</TableCell>
                <TableCell>{new Date(match.matchDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={match.status}
                    color={match.status === 'live' ? 'error' : match.status === 'completed' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    component={Link}
                    to={`/admin/score-entry/${match.id}`}
                    variant="contained"
                    size="small"
                    startIcon={<SportsScoreIcon />}
                    sx={{ mr: 1 }}
                  >
                    Score Entry
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Match Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Match</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Team 1"
                value={newMatch.team1Id}
                onChange={(e) => setNewMatch({ ...newMatch, team1Id: e.target.value })}
              >
                {teams && teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Team 2"
                value={newMatch.team2Id}
                onChange={(e) => setNewMatch({ ...newMatch, team2Id: e.target.value })}
              >
                {teams && teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Match Type"
                value={newMatch.matchType}
                onChange={(e) => setNewMatch({ ...newMatch, matchType: e.target.value })}
              >
                <MenuItem value="T20">T20</MenuItem>
                <MenuItem value="ODI">ODI</MenuItem>
                <MenuItem value="Test">Test</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Total Overs"
                value={newMatch.totalOvers}
                onChange={(e) => setNewMatch({ ...newMatch, totalOvers: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Venue"
                value={newMatch.venue}
                onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Match Date"
                value={newMatch.matchDate}
                onChange={(e) => setNewMatch({ ...newMatch, matchDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateMatch} variant="contained">
            Create Match
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMatches;
