import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Box, Paper, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Tabs, Tab, Card, Divider, CircularProgress
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { matchService } from '../api/services';
import { getSocket } from '../utils/socket';

const MatchDetails = () => {
  const { matchId } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [match, setMatch] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        const [matchData, statsData, commentaryData] = await Promise.all([
          matchService.getMatchDetails(matchId),
          matchService.getMatchStatistics(matchId),
          matchService.getMatchCommentary(matchId)
        ]);
        
        console.log('Commentary data:', commentaryData); // Debug log
        
        setMatch(matchData.data || matchData.match);
        setStatistics(statsData.data || statsData);
        setCommentary(commentaryData.data || commentaryData.commentary || []);
      } catch (error) {
        console.error('Error fetching match data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();

   
    // Socket.IO real-time updates
    const socket = getSocket();
    
    socket.on('ballRecorded', (data) => {
      if (data.matchId === parseInt(matchId)) {
        console.log('Ball recorded - updating data in real-time');
        // Refresh all data when a new ball is recorded
        fetchMatchData();
      }
    });

    return () => {
      socket.off('ballRecorded');
    };
  }, [matchId]);

  console.log({match});

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
    return <Container><Typography>Match not found</Typography></Container>;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Match Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              {match.matchFormat || match.matchType} • {match.venue}
            </Typography>
            <Typography variant="h6">
              {new Date(match.matchDate || match.date).toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </Typography>
          </Box>
          {match.status === 'live' && (
            <Chip 
              label="LIVE" 
              color="error" 
              icon={<LiveTvIcon />}
              sx={{ color: 'white', bgcolor: 'error.main' }}
            />
          )}
        </Box>

        {/* Score Display */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* {match.team1?.logo || '🏏'} {match.team1?.shortName || match.team1?.name || 'Team 1'} */}
                <img src={match.team1?.logo} alt={match.team1?.shortName} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mt: 1 }}>
                <Typography variant="h3" fontWeight="bold">
                  
                  {match.innings?.[0]?.totalRuns || 0}/{match.innings?.[0]?.totalWickets || 0}
                </Typography>
                <Typography variant="h6">
                  ({match.innings?.[0]?.totalOvers || '0.0'} ov)
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* {match.team1?.logo || '🏏'} {match.team1?.shortName || match.team1?.name || 'Team 1'} */}
                <img src={match.team2?.logo} alt={match.team2?.shortName} />
              </Box>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              {match.innings?.[1] ? `${match.innings[1].totalRuns}/${match.innings[1].totalWickets} (${match.innings[1].totalOvers} ov)` : 'Yet to bat'}
            </Typography>
          </Grid>
        </Grid>

        {/* Match Info */}
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
          <Typography variant="body2">
            {match.tossWinner?.shortName || match.tossWinner?.name || 'Team'} won the toss and chose to {match.tossDecision}
          </Typography>
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Scorecard" />
          <Tab label="Commentary" />
          <Tab label="Statistics" />
        </Tabs>
      </Box>

      {/* Scorecard Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Batting Scorecard */}
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {match.innings?.[0]?.battingTeam?.shortName || match.innings?.[0]?.battingTeam?.name || 
                 (match.innings?.[0]?.battingTeamId === match.team1Id ? (match.team1?.shortName || match.team1?.name) : (match.team2?.shortName || match.team2?.name)) || 
                 'Team'} Innings - {match.innings?.[0]?.totalRuns || 0}/{match.innings?.[0]?.totalWickets || 0} ({match.innings?.[0]?.totalOvers || '0.0'} ov)
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Batter</strong></TableCell>
                    <TableCell align="center"><strong>R</strong></TableCell>
                    <TableCell align="center"><strong>B</strong></TableCell>
                    <TableCell align="center"><strong>4s</strong></TableCell>
                    <TableCell align="center"><strong>6s</strong></TableCell>
                    <TableCell align="center"><strong>SR</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statistics?.battingStats?.length > 0 ? statistics.battingStats.map((stat, index) => {
                    console.log('Batting stat:', stat); // Debug log
                    // Format dismissal text
                    let dismissalText = '';
                    if (!stat.isOut) {
                      dismissalText = 'Not Out';
                    } else {
                      const dismissalType = stat.dismissalType;
                      const bowler = stat.dismissalBowler?.name;
                      const fielder = stat.dismissalFielder?.name;
                      
                      if (dismissalType === 'caught' && fielder && bowler) {
                        dismissalText = `c ${fielder} b ${bowler}`;
                      } else if (dismissalType === 'bowled' && bowler) {
                        dismissalText = `b ${bowler}`;
                      } else if (dismissalType === 'lbw' && bowler) {
                        dismissalText = `lbw b ${bowler}`;
                      } else if (dismissalType === 'stumped' && fielder && bowler) {
                        dismissalText = `st ${fielder} b ${bowler}`;
                      } else if (dismissalType === 'run_out' && fielder) {
                        dismissalText = `run out (${fielder})`;
                      } else if (dismissalType === 'hit_wicket' && bowler) {
                        dismissalText = `hit wicket b ${bowler}`;
                      } else {
                        dismissalText = dismissalType || 'out';
                      }
                    }

                    return (
                      <TableRow key={index} sx={{ bgcolor: !stat.isOut ? 'success.lighter' : 'inherit' }}>
                        <TableCell>
                          <Box>
                            <Typography fontWeight={!stat.isOut ? 'bold' : 'normal'}>
                              {stat.player?.name} {!stat.isOut && '⭐'}
                            </Typography>
                            <Typography variant="caption" color={!stat.isOut ? 'success.main' : 'text.secondary'} sx={{ fontStyle: 'italic' }}>
                              {dismissalText}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{stat.runsScored || 0}</TableCell>
                        <TableCell align="center">{stat.ballsFaced || 0}</TableCell>
                        <TableCell align="center">{stat.fours || 0}</TableCell>
                        <TableCell align="center">{stat.sixes || 0}</TableCell>
                        <TableCell align="center">{parseFloat(stat.strikeRate || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">No batting statistics available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Extras & Total */}
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2">
                <strong>Extras:</strong> {match.innings?.[0]?.extras || 0}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                <strong>Total:</strong> {match.innings?.[0]?.totalRuns || 0}/{match.innings?.[0]?.totalWickets || 0} ({match.innings?.[0]?.totalOvers || '0.0'} ov)
              </Typography>
            </Box>
          </Paper>

          {/* Bowling Scorecard */}
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {match.innings?.[0]?.bowlingTeam?.shortName || match.innings?.[0]?.bowlingTeam?.name || 
                 (match.innings?.[0]?.bowlingTeamId === match.team2Id ? (match.team2?.shortName || match.team2?.name) : (match.team1?.shortName || match.team1?.name)) || 
                 'Team'} Bowling
              </Typography>
            </Box>
            
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
                    <TableCell align="center"><strong>Wd</strong></TableCell>
                    <TableCell align="center"><strong>Nb</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statistics?.bowlingStats?.length > 0 ? statistics.bowlingStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell><strong>{stat.player?.name}</strong></TableCell>
                      <TableCell align="center">{parseFloat(stat.oversBowled || 0).toFixed(1)}</TableCell>
                      <TableCell align="center">{stat.maidenOvers || 0}</TableCell>
                      <TableCell align="center">{stat.runsConceded || 0}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {stat.wicketsTaken || 0}
                      </TableCell>
                      <TableCell align="center">{parseFloat(stat.economyRate || 0).toFixed(2)}</TableCell>
                      <TableCell align="center">{stat.wides || 0}</TableCell>
                      <TableCell align="center">{stat.noBalls || 0}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary">No bowling statistics available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Fall of Wickets */}
          <Card sx={{ mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Typography variant="h6" fontWeight="bold">
                Fall of Wickets
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {statistics?.fallOfWickets?.length > 0 ? statistics.fallOfWickets.map((fow, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Typography variant="body2" fontWeight="bold">
                      {fow.teamScore}-{fow.wicket} ({fow.over} ov)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fow.playerName || fow.player?.name}
                    </Typography>
                  </Grid>
                )) : (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      No wickets fallen yet
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Card>

          {/* Partnerships */}
          <Card>
            <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Typography variant="h6" fontWeight="bold">
                Partnerships
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {statistics?.partnerships?.length > 0 ? statistics.partnerships.map((partnership, index) => (
                <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < statistics.partnerships.length - 1 ? '1px solid #eee' : 'none' }}>
                  <Typography variant="body1" fontWeight="bold">
                    {partnership.wicketNumber === 0 ? 'Current' : `${partnership.wicketNumber}${partnership.wicketNumber === 1 ? 'st' : partnership.wicketNumber === 2 ? 'nd' : partnership.wicketNumber === 3 ? 'rd' : 'th'} Wicket`}: {partnership.runs} runs ({partnership.balls} balls)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {partnership.batsman1?.name} {partnership.batsman1Runs}*, {partnership.batsman2?.name} {partnership.batsman2Runs}*
                  </Typography>
                </Box>
              )) : (
                <Typography variant="body2" color="text.secondary">No partnership data available</Typography>
              )}
            </Box>
          </Card>
        </Box>
      )}

      {/* Commentary Tab */}
      {tabValue === 1 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Live Commentary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {commentary && commentary.length > 0 ? commentary.map((comment, index) => (
            <Box 
              key={comment.id || index} 
              sx={{ 
                mb: 2, 
                pb: 2, 
                borderBottom: index < commentary.length - 1 ? 1 : 0, 
                borderColor: 'divider' 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Chip 
                  label={`${comment.overNumber || comment.over}`}
                  size="small" 
                  color="primary" 
                  sx={{ fontWeight: 'bold' }}
                />
                {comment.isWicket && (
                  <Chip label="WICKET" size="small" color="error" />
                )}
                {comment.runs && (
                  <Chip label={`${comment.runs}`} size="small" color="success" />
                )}
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {comment.text || comment.commentary || 'No commentary available'}
              </Typography>
              {comment.commentary && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {comment.bowler} to {comment.batsman}
                </Typography>
              )}
            </Box>
          )) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No commentary available yet. Start recording balls to see commentary.
            </Typography>
          )}
        </Paper>
      )}

      {/* Statistics Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                  Match Statistics
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Runs</Typography>
                    <Typography variant="h5" fontWeight="bold">{match.innings?.[0]?.totalRuns || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Wickets</Typography>
                    <Typography variant="h5" fontWeight="bold">{match.innings?.[0]?.totalWickets || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Run Rate</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {match.innings?.[0]?.runRate || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Extras</Typography>
                    <Typography variant="h5" fontWeight="bold">{match.innings?.[0]?.extras || 0}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                  Scoring Breakdown
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                {(() => {
                  // Calculate runs from boundaries (4s and 6s)
                  const totalFours = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.fours || 0), 0) || 0;
                  const totalSixes = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.sixes || 0), 0) || 0;
                  const boundaryRuns = (totalFours * 4) + (totalSixes * 6);
                  const totalRuns = match.innings?.[0]?.totalRuns || 0;
                  const boundaryPercentage = totalRuns > 0 ? ((boundaryRuns / totalRuns) * 100).toFixed(0) : 0;

                  // Calculate total balls faced
                  const totalBallsFaced = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.ballsFaced || 0), 0) || 0;
                  
                  // Calculate dot balls (balls where batsman scored 0)
                  // This is approximate: totalBalls - (balls that scored runs)
                  const totalRunScoringBalls = statistics?.battingStats?.reduce((sum, stat) => {
                    // Approximate: runs / avg runs per scoring ball
                    // For simplicity, we'll calculate from boundaries and assume rest are 1s, 2s, 3s
                    const boundaryBalls = (stat.fours || 0) + (stat.sixes || 0);
                    const nonBoundaryRuns = (stat.runsScored || 0) - ((stat.fours || 0) * 4) - ((stat.sixes || 0) * 6);
                    // Assume non-boundary scoring balls are mostly singles/doubles (avg ~1.5 runs)
                    const nonBoundaryBalls = nonBoundaryRuns > 0 ? Math.round(nonBoundaryRuns / 1.5) : 0;
                    return sum + boundaryBalls + nonBoundaryBalls;
                  }, 0) || 0;
                  
                  const dotBalls = totalBallsFaced - totalRunScoringBalls;
                  const dotBallPercentage = totalBallsFaced > 0 ? ((dotBalls / totalBallsFaced) * 100).toFixed(0) : 0;

                  return (
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Runs in Boundaries
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {boundaryRuns} ({boundaryPercentage}% of total)
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {totalFours} fours, {totalSixes} sixes
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                        Dot balls percentage
                      </Typography>
                      <Typography variant="h6">{dotBallPercentage}%</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dotBalls} dot balls out of {totalBallsFaced} balls
                      </Typography>
                    </>
                  );
                })()}
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default MatchDetails;
