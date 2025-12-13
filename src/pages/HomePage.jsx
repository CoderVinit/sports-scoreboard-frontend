import { Paper, Typography, Box, Grid, Card, CardContent, CardActions, Button, Chip, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { matchService } from '../api/services';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { getSocket } from '../utils/socket';

const HomePage = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [liveData, upcomingData] = await Promise.all([
          matchService.getLiveMatches(),
          matchService.getUpcomingMatches()
        ]);
        setLiveMatches(liveData.data || liveData.matches || []);
        setUpcomingMatches(upcomingData.data || upcomingData.matches || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err.message || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Socket.IO real-time updates
    const socket = getSocket();
    
    socket.on('ballRecorded', (data) => {
      console.log('Ball recorded - refreshing home page data');
      fetchData();
    });

    // Also keep polling as fallback
    const interval = setInterval(fetchData, 30000); // Increased to 30s since socket provides real-time updates
    
    return () => {
      socket.off('ballRecorded');
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
        <SportsCricketIcon sx={{ fontSize: 80, color: 'white', mb: 2 }} />
        <Typography variant="h2" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
          Welcome to Cricket Scoreboard
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Track live cricket matches, view scores, and statistics in real-time
        </Typography>
      </Paper>

      {liveMatches && liveMatches.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LiveTvIcon sx={{ color: 'error.main', mr: 1 }} />
            <Typography variant="h4">Live Matches</Typography>
          </Box>
          <Grid container spacing={3}>
            {liveMatches.map((match) => (
              <Grid item xs={12} md={6} key={match.id}>
                <Card elevation={4} sx={{ position: 'relative', overflow: 'visible' }}>
                  <Chip 
                    label="LIVE" 
                    color="error" 
                    size="small" 
                    sx={{ position: 'absolute', top: -10, right: 10 }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {match.matchFormat} • {match.venue}
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">{match.team1?.name || match.Team1?.name}</Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                          {match.innings?.[0]?.battingTeamId === match.team1Id ? 
                            `${match.innings[0]?.totalRuns || 0}/${match.innings[0]?.totalWickets || 0}` :
                            match.innings?.[1]?.totalRuns ? `${match.innings[1]?.totalRuns || 0}/${match.innings[1]?.totalWickets || 0}` : '0/0'
                          }
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">{match.team2?.name || match.Team2?.name}</Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                          {match.innings?.[0]?.battingTeamId === match.team2Id ? 
                            `${match.innings[0]?.totalRuns || 0}/${match.innings[0]?.totalWickets || 0}` :
                            match.innings?.[1]?.totalRuns ? `${match.innings[1]?.totalRuns || 0}/${match.innings[1]?.totalWickets || 0}` : 'Yet to bat'
                          }
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {match.status === 'live' ? 'Match in Progress' : match.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={Link} to={`/match/${match.id}`} fullWidth variant="contained">
                      View Live Score
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScheduleIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h4">Upcoming Matches</Typography>
        </Box>
        <Grid container spacing={3}>
          {upcomingMatches && upcomingMatches.slice(0, 6).map((match) => (
            <Grid item xs={12} md={4} key={match.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {match.matchFormat} • {match.venue}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">{match.team1?.name || match.Team1?.name || 'Team 1'}</Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                    {match.team2?.name || match.Team2?.name || 'Team 2'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(match.matchDate).toLocaleDateString()} at{' '}
                    {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} to={`/match/${match.id}`} size="small">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
