import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Card, CardContent,
  Divider, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { matchService, ballService, playerService } from '../../api/services';

const AdminScoreEntryStatic = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  
  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [currentBall, setCurrentBall] = useState({
    runs: '',
    extras: 0,
    extraType: 'none',
    isWicket: false,
    batsmanId: '',
    nonStrikerId: '',
    bowlerId: '',
    dismissalType: '',
    fielderId: '',
    commentary: '',
  });

  const [scoreData, setScoreData] = useState({
    runs: 0,
    wickets: 0,
    overs: 0,
    currentOver: 0,
    currentBallInOver: 0,
    balls: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [matchData, statsData, playersData] = await Promise.all([
          matchService.getMatchDetails(matchId),
          matchService.getMatchStatistics(matchId),
          playerService.getAllPlayers()
        ]);
        
        setMatch(matchData.data || matchData.match);
        setStatistics(statsData.data || statsData);
        setPlayers(playersData.data || playersData.players || []);
        
        // Initialize score data from match
        const matchInfo = matchData.data || matchData.match;
        if (matchInfo) {
          // Get the current innings data
          const currentInnings = matchInfo.innings?.[matchInfo.currentInnings - 1];
          
          // Fetch last 5 balls if innings exists
          let recentBalls = [];
          if (currentInnings?.id) {
            try {
              const ballsData = await ballService.getRecentBalls(currentInnings.id, 5);
              recentBalls = (ballsData.data || ballsData.balls || []).map(ball => {
                const runs = (ball.runs || 0) + (ball.extras || 0);
                const isWicket = ball.isWicket;
                return { runs, isWicket };
              });
            } catch (err) {
              console.log('No balls recorded yet');
            }
          }
          
          setScoreData({
            runs: currentInnings?.totalRuns || 0,
            wickets: currentInnings?.totalWickets || 0,
            overs: parseFloat(currentInnings?.totalOvers || 0),
            currentOver: Math.floor(parseFloat(currentInnings?.totalOvers || 0)),
            currentBallInOver: Math.round((parseFloat(currentInnings?.totalOvers || 0) % 1) * 10),
            balls: recentBalls
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load match data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId]);

  const handleBallSubmit = async () => {
    if (!currentBall.batsmanId || !currentBall.bowlerId) {
      setError('Please select batsman and bowler');
      return;
    }
    
    if (!currentBall.nonStrikerId) {
      setError('Please select non-striker batsman');
      return;
    }

    if (currentBall.batsmanId === currentBall.nonStrikerId) {
      setError('Striker and non-striker cannot be the same player');
      return;
    }

    try {
      setSubmitting(true);
      
      // Get the current innings from match data
      const currentInnings = match.innings?.[match.currentInnings - 1];
      if (!currentInnings || !currentInnings.id) {
        setError('No active innings found. Please start an innings first.');
        setSubmitting(false);
        return;
      }
      
      const ballData = {
        matchId: parseInt(matchId),
        inningsId: currentInnings.id,
        overNumber: scoreData.currentOver,
        ballNumber: scoreData.currentBallInOver + 1,
        batsmanId: parseInt(currentBall.batsmanId),
        nonStrikerId: parseInt(currentBall.nonStrikerId),
        bowlerId: parseInt(currentBall.bowlerId),
        runs: parseInt(currentBall.runs) || 0,
        extras: parseInt(currentBall.extras) || 0,
        extraType: currentBall.extraType !== 'none' ? currentBall.extraType : null,
        isWicket: currentBall.isWicket,
        wicketType: currentBall.isWicket ? currentBall.dismissalType : null,
        dismissedPlayerId: currentBall.isWicket ? parseInt(currentBall.batsmanId) : null,
        fielderId: currentBall.fielderId ? parseInt(currentBall.fielderId) : null,
        commentary: currentBall.commentary || null,
      };

      await ballService.createBall(ballData);

      const runs = parseInt(currentBall.runs) || 0;
      const extras = parseInt(currentBall.extras) || 0;
      const totalRunsForBall = runs + extras;
      
      // Only increment ball count if not wide or no-ball
      const isValidDelivery = currentBall.extraType !== 'wide' && currentBall.extraType !== 'no_ball';
      const newBallInOver = isValidDelivery ? (scoreData.currentBallInOver + 1) % 6 : scoreData.currentBallInOver;
      const newOver = scoreData.currentOver + (newBallInOver === 0 && isValidDelivery ? 1 : 0);
      const newOvers = newOver + (newBallInOver / 10);

      // Fetch last 5 balls from backend
      const ballsData = await ballService.getRecentBalls(currentInnings.id, 5);
      const recentBalls = (ballsData.data || ballsData.balls || []).map(ball => {
        const runs = (ball.runs || 0) + (ball.extras || 0);
        const isWicket = ball.isWicket;
        return { runs, isWicket };
      });

      setScoreData(prev => ({
        ...prev,
        runs: prev.runs + totalRunsForBall,
        wickets: prev.wickets + (currentBall.isWicket ? 1 : 0),
        currentOver: newOver,
        currentBallInOver: newBallInOver,
        overs: parseFloat(newOvers.toFixed(1)),
        balls: recentBalls
      }));

      // Auto-swap striker and non-striker on odd runs (1, 3, 5)
      const shouldSwapBatsmen = runs % 2 === 1;
      const newStrikerId = shouldSwapBatsmen ? currentBall.nonStrikerId : currentBall.batsmanId;
      const newNonStrikerId = shouldSwapBatsmen ? currentBall.batsmanId : currentBall.nonStrikerId;

      // Reset form while keeping selections
      setCurrentBall({
        runs: '',
        extras: 0,
        extraType: 'none',
        isWicket: false,
        batsmanId: currentBall.isWicket ? '' : newStrikerId, // Clear if wicket, otherwise keep/swap
        nonStrikerId: currentBall.isWicket ? '' : newNonStrikerId, // Clear if wicket, otherwise keep/swap
        bowlerId: currentBall.bowlerId, // Always keep bowler selected
        dismissalType: '',
        fielderId: '',
        commentary: '',
      });

      // Refresh statistics to show updated values
      const statsData = await matchService.getMatchStatistics(matchId);
      setStatistics(statsData.data || statsData);

      setSuccessMessage(`Ball recorded: ${runs} run(s) - Over ${newOver}.${newBallInOver + 1}`);
    } catch (err) {
      console.error('Error submitting ball:', err);
      setError(err.message || 'Failed to record ball');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!match) {
    return (
      <Container>
        <Typography color="error" variant="h6">Match not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={3000} 
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 3 }}>
        <Button variant="outlined" onClick={() => navigate('/admin/matches')}>
          ← Back to Matches
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Score Entry - Match {match.id}
        </Typography>
        <Typography variant="h6">
          {match.team1?.name || match.Team1?.name || 'Team 1'} vs {match.team2?.name || match.Team2?.name || 'Team 2'}
        </Typography>
        <Typography variant="body2">
          {match.venue} • {new Date(match.matchDate).toLocaleDateString()}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Current Score Display */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ bgcolor: 'success.light', color: 'white' }}>
              <Typography variant="h6" gutterBottom>Current Score</Typography>
              <Typography variant="h2" fontWeight="bold">
                {scoreData.runs}/{scoreData.wickets}
              </Typography>
              <Typography variant="h6">
                {scoreData.overs} overs
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Last 5 Balls</Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                {scoreData.balls.map((ball, index) => {
                  const displayText = ball.isWicket 
                    ? (ball.runs === 0 ? 'W' : `${ball.runs}W`) 
                    : ball.runs;
                  const chipColor = ball.isWicket 
                    ? 'error' 
                    : (ball.runs === 6 ? 'error' : ball.runs === 4 ? 'primary' : 'default');
                  
                  return (
                    <Chip
                      key={index}
                      label={displayText}
                      color={chipColor}
                      size="large"
                      sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                    />
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ball Entry Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Enter Ball Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Current Ball Indicator */}
            <Box 
              sx={{ 
                mb: 3, 
                p: 2.5, 
                bgcolor: 'primary.main', 
                color: 'white', 
                borderRadius: 2,
                textAlign: 'center',
                boxShadow: 3
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
                NEXT BALL TO BE BOWLED
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {scoreData.currentOver}.{scoreData.currentBallInOver + 1}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Over.Ball
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', opacity: 0.3 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Ball {scoreData.currentBallInOver + 1}/6
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                    {[1, 2, 3, 4, 5, 6].map((ball) => (
                      <Box
                        key={ball}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: ball <= scoreData.currentBallInOver ? 'success.light' : 'white',
                          border: ball === scoreData.currentBallInOver + 1 ? '2px solid yellow' : 'none',
                          boxShadow: ball === scoreData.currentBallInOver + 1 ? '0 0 8px yellow' : 'none'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Batsman (Striker)</InputLabel>
                  <Select
                    value={currentBall.batsmanId}
                    onChange={(e) => setCurrentBall({ ...currentBall, batsmanId: e.target.value })}
                  >
                    {players.filter(p => {
                      // Get current innings to determine batting team
                      const currentInnings = match?.innings?.[match.currentInnings - 1];
                      const battingTeamId = currentInnings?.battingTeamId || match?.battingFirstId || match?.team1Id;
                      return p.teamId === battingTeamId;
                    }).map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name} ({player.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Non-Striker</InputLabel>
                  <Select
                    value={currentBall.nonStrikerId}
                    onChange={(e) => setCurrentBall({ ...currentBall, nonStrikerId: e.target.value })}
                  >
                    {players.filter(p => {
                      // Get current innings to determine batting team
                      const currentInnings = match?.innings?.[match.currentInnings - 1];
                      const battingTeamId = currentInnings?.battingTeamId || match?.battingFirstId || match?.team1Id;
                      return p.teamId === battingTeamId && p.id !== currentBall.batsmanId;
                    }).map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name} ({player.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Bowler</InputLabel>
                  <Select
                    value={currentBall.bowlerId}
                    onChange={(e) => setCurrentBall({ ...currentBall, bowlerId: e.target.value })}
                  >
                    {players.filter(p => {
                      // Get current innings to determine bowling team
                      const currentInnings = match?.innings?.[match.currentInnings - 1];
                      const battingTeamId = currentInnings?.battingTeamId || match?.battingFirstId || match?.team1Id;
                      const bowlingTeamId = currentInnings?.bowlingTeamId || 
                        (battingTeamId === match?.team1Id ? match?.team2Id : match?.team1Id);
                      return p.teamId === bowlingTeamId;
                    }).map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name} ({player.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Runs Scored
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[0, 1, 2, 3, 4, 6].map((run) => (
                    <Button
                      key={run}
                      variant={currentBall.runs === run.toString() ? 'contained' : 'outlined'}
                      onClick={() => setCurrentBall({ ...currentBall, runs: run.toString() })}
                      size="large"
                      sx={{ minWidth: '60px' }}
                    >
                      {run}
                    </Button>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Extra Type</InputLabel>
                  <Select
                    value={currentBall.extraType}
                    onChange={(e) => setCurrentBall({ ...currentBall, extraType: e.target.value })}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="wide">Wide</MenuItem>
                    <MenuItem value="noball">No Ball</MenuItem>
                    <MenuItem value="bye">Bye</MenuItem>
                    <MenuItem value="legbye">Leg Bye</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Extra Runs"
                  type="number"
                  value={currentBall.extras}
                  onChange={(e) => setCurrentBall({ ...currentBall, extras: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant={currentBall.isWicket ? 'contained' : 'outlined'}
                  color="error"
                  fullWidth
                  onClick={() => setCurrentBall({ ...currentBall, isWicket: !currentBall.isWicket })}
                >
                  {currentBall.isWicket ? '✓ Wicket' : 'Mark as Wicket'}
                </Button>
              </Grid>

              {currentBall.isWicket && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Dismissal Type</InputLabel>
                    <Select
                      value={currentBall.dismissalType}
                      onChange={(e) => setCurrentBall({ ...currentBall, dismissalType: e.target.value, fielderId: '' })}
                    >
                      <MenuItem value="bowled">Bowled</MenuItem>
                      <MenuItem value="caught">Caught</MenuItem>
                      <MenuItem value="lbw">LBW</MenuItem>
                      <MenuItem value="run_out">Run Out</MenuItem>
                      <MenuItem value="stumped">Stumped</MenuItem>
                      <MenuItem value="hit_wicket">Hit Wicket</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Fielder Selection - shown for caught, run_out, stumped */}
              {currentBall.isWicket && ['caught', 'run_out', 'stumped'].includes(currentBall.dismissalType) && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Fielder *</InputLabel>
                    <Select
                      value={currentBall.fielderId}
                      onChange={(e) => setCurrentBall({ ...currentBall, fielderId: e.target.value })}
                      required
                    >
                      {players.filter(p => {
                        // Get current innings to determine bowling team
                        const currentInnings = match?.innings?.[match.currentInnings - 1];
                        const bowlingTeamId = currentInnings?.bowlingTeamId || 
                          (match?.battingFirstId === match?.team1Id ? match?.team2Id : match?.team1Id);
                        return p.teamId === bowlingTeamId;
                      }).map((player) => (
                        <MenuItem key={player.id} value={player.id}>
                          {player.name} ({player.role})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Commentary Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Commentary (Optional)"
                  multiline
                  rows={2}
                  value={currentBall.commentary}
                  onChange={(e) => setCurrentBall({ ...currentBall, commentary: e.target.value })}
                  placeholder="e.g., 'Beautiful cover drive for four!' or 'Edged and caught behind!'"
                  helperText="Add description for this ball (shown in commentary section)"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleBallSubmit}
                  disabled={submitting || !currentBall.batsmanId || !currentBall.bowlerId}
                >
                  {submitting ? 'Submitting...' : 'Submit Ball'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Current Batsmen Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Current Batsmen
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Batsman</strong></TableCell>
                    <TableCell align="center"><strong>R</strong></TableCell>
                    <TableCell align="center"><strong>B</strong></TableCell>
                    <TableCell align="center"><strong>4s</strong></TableCell>
                    <TableCell align="center"><strong>6s</strong></TableCell>
                    <TableCell align="center"><strong>SR</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(currentBall.batsmanId || currentBall.nonStrikerId) && statistics?.playerStats ? (
                    statistics.playerStats
                      .filter(stat => 
                        stat.playerId === currentBall.batsmanId || 
                        stat.playerId === currentBall.nonStrikerId
                      )
                      .map((stat, index) => {
                        const isStriker = stat.playerId === currentBall.batsmanId;
                        const playerName = stat.player?.name || players.find(p => p.id === stat.playerId)?.name;
                        return (
                          <TableRow key={index} sx={{ bgcolor: isStriker ? 'success.lighter' : 'grey.50' }}>
                            <TableCell>
                              <strong>{playerName} {isStriker ? '*' : ''}</strong>
                            </TableCell>
                            <TableCell align="center">{stat.runsScored || 0}</TableCell>
                            <TableCell align="center">{stat.ballsFaced || 0}</TableCell>
                            <TableCell align="center">{stat.fours || 0}</TableCell>
                            <TableCell align="center">{stat.sixes || 0}</TableCell>
                            <TableCell align="center">{parseFloat(stat.strikeRate || 0).toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Select batsmen to see stats
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Current Bowler Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Current Bowler
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Bowler</strong></TableCell>
                    <TableCell align="center"><strong>O</strong></TableCell>
                    <TableCell align="center"><strong>M</strong></TableCell>
                    <TableCell align="center"><strong>R</strong></TableCell>
                    <TableCell align="center"><strong>W</strong></TableCell>
                    <TableCell align="center"><strong>Econ</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentBall.bowlerId && statistics?.playerStats ? (
                    statistics.playerStats
                      .filter(stat => stat.playerId === currentBall.bowlerId)
                      .map((stat, index) => {
                        const playerName = stat.player?.name || players.find(p => p.id === currentBall.bowlerId)?.name;
                        return (
                          <TableRow key={index} sx={{ bgcolor: 'info.lighter' }}>
                            <TableCell><strong>{playerName}</strong></TableCell>
                            <TableCell align="center">{stat.oversBowled || 0}</TableCell>
                            <TableCell align="center">{stat.maidenOvers || 0}</TableCell>
                            <TableCell align="center">{stat.runsConceded || 0}</TableCell>
                            <TableCell align="center">{stat.wicketsTaken || 0}</TableCell>
                            <TableCell align="center">{parseFloat(stat.economyRate || 0).toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Select a bowler to see stats
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminScoreEntryStatic;
