import { Container, Box, Grid, Paper, Typography, Chip, Divider, LinearProgress, CircularProgress, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SportsIcon from '@mui/icons-material/Sports';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { matchService, inningsService } from '../api/services';
import { getSocket } from '../utils/socket';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
`;

const LiveScoreboard = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        setLoading(true);
        const response = await matchService.getLiveMatches();
        setLiveMatches(response.data || response.matches || []);
      } catch (err) {
        console.error('Error fetching live matches:', err);
        setError(err.message || 'Failed to load live matches');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();

    // Socket.IO real-time updates
    const socket = getSocket();
    
    socket.on('ballRecorded', (data) => {
      console.log('Ball recorded - refreshing live scoreboard');
      fetchLiveMatches();
    });

    // Also keep polling as fallback
    const interval = setInterval(fetchLiveMatches, 30000); // Increased to 30s since socket provides real-time updates
    
    return () => {
      socket.off('ballRecorded');
      clearInterval(interval);
    };
  }, []);

  const getRunRate = (runs, overs) => {
    return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
  };

  const getProgressPercentage = (overs, totalOvers) => {
    return (overs / totalOvers) * 100;
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (liveMatches.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LiveTvIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            No live matches at the moment
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Check back later for live cricket action!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          color: 'white',
          boxShadow: 3
        }}
      >
        <LiveTvIcon sx={{ fontSize: 50, mr: 2, animation: `${pulse} 2s infinite` }} />
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Live Cricket Matches
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {liveMatches.length} {liveMatches.length === 1 ? 'match' : 'matches'} in progress
          </Typography>
        </Box>
      </Box>

      {liveMatches && liveMatches.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
          <SportsIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No live matches at the moment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back soon for live cricket action!
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {liveMatches && liveMatches.map((match) => {
          const totalOvers = match.totalOvers || (match.matchFormat === 'T20' ? 20 : match.matchFormat === 'ODI' ? 50 : 90);
          const currentOvers = parseFloat(match.innings?.[0]?.totalOvers || 0);
          const progress = getProgressPercentage(currentOvers, totalOvers);
          
          return (
            <Grid item xs={12} md={6} key={match.id}>
              <Paper 
                component={Link} 
                to={`/match/${match.id}`}
                elevation={2}
                sx={{ 
                  position: 'relative',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  border: '2px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                    borderColor: 'error.main',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)',
                  }
                }}
              >
                {/* Live Badge */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                  <Chip 
                    label="LIVE" 
                    color="error" 
                    size="small" 
                    icon={<LiveTvIcon />}
                    sx={{ 
                      fontWeight: 'bold',
                      animation: `${pulse} 2s infinite`,
                    }}
                  />
                </Box>

                {/* Match Info Header */}
                <Box sx={{ p: 2.5, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<SportsIcon />} 
                      label={match.matchFormat || match.matchType} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {match.venue}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(match.matchDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {/* Teams and Scores */}
                <Box sx={{ p: 3 }}>
                  {/* Team 1 */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar 
                          src={match.team1?.logo} 
                          alt={match.team1?.name}
                          sx={{ width: 48, height: 48 }}
                        >
                          {match.team1?.shortName?.charAt(0) || '🏏'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                            {match.team1?.shortName || match.team1?.name || 'Team 1'}
                          </Typography>
                          {match.currentInnings === 1 && (
                            <Chip label="Batting" size="small" color="primary" sx={{ mt: 0.5, height: 20 }} />
                          )}
                        </Box>
                      </Box>
                      <Typography variant="h3" fontWeight="bold" color="primary.main">
                        {match.innings?.[0]?.battingTeamId === match.team1Id ? 
                          `${match.innings[0]?.totalRuns || 0}/${match.innings[0]?.totalWickets || 0}` :
                          match.innings?.[1]?.totalRuns ? `${match.innings[1]?.totalRuns || 0}/${match.innings[1]?.totalWickets || 0}` : '0/0'
                        }
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
                      ({match.innings?.[0]?.totalOvers || '0.0'}/{totalOvers} overs)
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Team 2 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar 
                          src={match.team2?.logo} 
                          alt={match.team2?.name}
                          sx={{ width: 48, height: 48 }}
                        >
                          {match.team2?.shortName?.charAt(0) || '🏏'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                            {match.team2?.shortName || match.team2?.name || 'Team 2'}
                          </Typography>
                          {match.currentInnings === 2 && (
                            <Chip label="Batting" size="small" color="primary" sx={{ mt: 0.5, height: 20 }} />
                          )}
                        </Box>
                      </Box>
                      <Typography variant="h6" color="text.secondary" fontWeight="medium">
                        {match.innings?.[0]?.battingTeamId === match.team2Id ? 
                          `${match.innings[0]?.totalRuns || 0}/${match.innings[0]?.totalWickets || 0}` :
                          match.innings?.[1]?.totalRuns ? `${match.innings[1]?.totalRuns || 0}/${match.innings[1]?.totalWickets || 0}` : 'Yet to bat'
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {/* Match Progress */}
                <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Match Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ 
                        mt: 0.5, 
                        height: 6, 
                        borderRadius: 1,
                        bgcolor: 'grey.300',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        }
                      }} 
                    />
                  </Box>
                </Box>

                {/* Match Details Footer */}
                <Box sx={{ p: 2.5, bgcolor: 'primary.50' }}>
                  {match.tossWinner && (
                    <Typography variant="body2" fontWeight="medium" color="text.primary" gutterBottom>
                      🏏 {match.tossWinner} won the toss and chose to {match.tossDecision || 'bat'}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        CRR: <strong>{getRunRate(match.team1Score || 0, currentOvers)}</strong>
                      </Typography>
                    </Box>
                    <Chip 
                      label="Match in progress" 
                      size="small" 
                      color="success" 
                      variant="outlined"
                      sx={{ height: 24 }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default LiveScoreboard;
