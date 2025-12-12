import { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, Card, CardContent, Button, Chip, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { matchService } from '../api/services';

const HomePage = () => {
  const navigate = useNavigate();
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const [liveData, upcomingData] = await Promise.all([
          matchService.getLiveMatches(),
          matchService.getUpcomingMatches()
        ]);
        setLiveMatches(liveData.data || liveData.matches || []);
        setUpcomingMatches(upcomingData.data || upcomingData.matches || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
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
            <LiveTvIcon sx={{ color: 'error.main', mr: 1, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">Live Matches</Typography>
          </Box>
          <Grid container spacing={3}>
            {liveMatches.map((match) => (
              <Grid item xs={12} md={6} key={match.id}>
                <Card 
                  elevation={4} 
                  sx={{ 
                    position: 'relative', 
                    overflow: 'visible',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8
                    }
                  }}
                  onClick={() => navigate(`/match/${match.id}`)}
                >
                  <Chip 
                    label="LIVE" 
                    color="error" 
                    size="small" 
                    icon={<LiveTvIcon />}
                    sx={{ position: 'absolute', top: -10, right: 10 }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {match.matchType} • {match.venue}
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {match.Team1?.name || 'Team 1'}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary.main">
                          {match.team1Score || 0}/{match.team1Wickets || 0}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        ({match.team1Overs || 0} overs)
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        {match.Team2?.name || 'Team 2'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {match.team2Score ? `${match.team2Score}/${match.team2Wickets}` : 'Yet to bat'}
                      </Typography>
                    </Box>
                    <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary">
                        {match.venue}
                      </Typography>
                      {match.team1Overs > 0 && (
                        <Typography variant="caption" display="block" color="primary">
                          CRR: {(match.team1Score / match.team1Overs).toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {upcomingMatches && upcomingMatches.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Upcoming Matches
          </Typography>
          <Grid container spacing={3}>
            {upcomingMatches.map((match) => (
              <Grid item xs={12} md={4} key={match.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Chip label="Upcoming" size="small" color="info" sx={{ mb: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {match.matchType}
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {match.Team1?.name || 'Team 1'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                        vs
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {match.Team2?.name || 'Team 2'}
                      </Typography>
                    </Box>
                    <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary">
                        {match.venue}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {new Date(match.matchDate).toLocaleDateString()} • {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Button 
          variant="contained" 
          size="large" 
          component={Link}
          to="/live"
          sx={{ mr: 2 }}
        >
          View All Live Scores
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          component={Link}
          to="/login"
        >
          Admin Login
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
