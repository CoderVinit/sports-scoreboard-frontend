import { useState, useEffect } from 'react';
import { Container, Box, Grid, Paper, Typography, Chip, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { matchService } from '../api/services';

const LiveScoreboard = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        setLoading(true);
        const response = await matchService.getLiveMatches();
        setLiveMatches(response.data || response.matches || []);
      } catch (error) {
        console.error('Error fetching live matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LiveTvIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
        <Typography variant="h3" component="h1">
          Live Cricket Matches
        </Typography>
      </Box>

      {liveMatches && liveMatches.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No live matches at the moment
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {liveMatches && liveMatches.map((match) => (
          <Grid item xs={12} key={match.id}>
            <Paper 
              component={Link} 
              to={`/match/${match.id}`}
              elevation={3} 
              sx={{ 
                p: 3, 
                position: 'relative',
                textDecoration: 'none',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <Chip 
                label="LIVE" 
                color="error" 
                size="small" 
                icon={<LiveTvIcon />}
                sx={{ position: 'absolute', top: 10, right: 10 }}
              />
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {match.matchType} • {match.venue} • {new Date(match.matchDate).toLocaleDateString()}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {match.Team1?.name || 'Team 1'}
                      </Typography>
                      {match.status === 'live' && (
                        <Chip label="Batting" size="small" color="primary" sx={{ mt: 0.5 }} />
                      )}
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {match.team1Score || 0}/{match.team1Wickets || 0}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({match.team1Overs || 0}/{match.matchType === 'T20' ? '20' : '50'} ov)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {match.Team2?.name || 'Team 2'}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {match.team2Score ? `${match.team2Score}/${match.team2Wickets}` : 'Yet to bat'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={7}>
                  <Paper elevation={0} sx={{ bgcolor: 'grey.100', p: 2 }}>
                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                      {match.tossWinner.shortName} won the toss and chose to {match.tossDecision}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      CRR: {(currentInnings.runs / currentInnings.overs).toFixed(2)} • Match in progress
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LiveScoreboard;
