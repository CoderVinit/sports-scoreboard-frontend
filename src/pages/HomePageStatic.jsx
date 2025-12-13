import { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, Card, CardContent, Button, Chip, CircularProgress, Avatar, Divider, LinearProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
    <Box sx={{ 
      minHeight: '100vh',
      background: '#f5f7fa',
      pb: 4
    }}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, md: 5 }, 
            mb: 5, 
            textAlign: 'center', 
            background: '#1976d2',
            borderRadius: 2,
            color: 'white',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
          }}
        >
          <SportsCricketIcon sx={{ fontSize: { xs: 56, md: 72 }, color: 'white', mb: 2.5 }} />
          <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 1.5, letterSpacing: '-0.02em' }}>
            Welcome to Cricket Scoreboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', fontSize: { xs: '0.9375rem', md: '1.0625rem' }, maxWidth: '650px', mx: 'auto', lineHeight: 1.6 }}>
            Track live cricket matches, view scores, and statistics in real-time
          </Typography>
        </Paper>

      {liveMatches && liveMatches.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LiveTvIcon sx={{ color: '#d32f2f', mr: 1.5, fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, color: 'text.primary', letterSpacing: '-0.01em' }}>
              Live Matches
            </Typography>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ScheduleIcon sx={{ color: '#1976d2', mr: 1, fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600}>
              Upcoming Matches
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {upcomingMatches.map((match) => (
              <Grid item xs={12} sm={6} md={4} key={match.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    borderRadius: 1,
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderColor: '#1976d2',
                    }
                  }}
                  onClick={() => navigate(`/match/${match.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip 
                        label={match.matchType} 
                        size="small" 
                        color="primary"
                        sx={{ 
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          height: 24
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                          {match.venue}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ my: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32,
                          background: '#1976d2',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}>
                          {(match.Team1?.name || 'T1').charAt(0)}
                        </Avatar>
                        <Typography variant="body1" fontWeight={600} fontSize="0.9375rem">
                          {match.Team1?.name || 'Team 1'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 1, fontWeight: 600 }}>
                        VS
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32,
                          background: '#9e9e9e',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}>
                          {(match.Team2?.name || 'T2').charAt(0)}
                        </Avatar>
                        <Typography variant="body1" fontWeight={600} fontSize="0.9375rem">
                          {match.Team2?.name || 'Team 2'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 1, 
                      background: '#fafafa',
                      border: '1px solid #e0e0e0'
                    }}>
                      <Typography variant="body2" color="text.secondary" display="block" gutterBottom fontSize="0.875rem">
                        <ScheduleIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                        {new Date(match.matchDate).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                        {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          size="large" 
          component={Link}
          to="/live"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            mr: 2,
            mb: { xs: 2, sm: 0 },
            background: '#1976d2',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: '#1565c0',
            }
          }}
        >
          View All Live Scores
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          component={Link}
          to="/login"
          sx={{
            borderColor: '#1976d2',
            color: '#1976d2',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              borderColor: '#1565c0',
              background: 'rgba(25, 118, 210, 0.04)',
            }
          }}
        >
          Admin Login
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
