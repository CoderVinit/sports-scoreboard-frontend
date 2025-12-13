import { Paper, Typography, Box, Grid, Card, CardContent, CardActions, Button, Chip, CircularProgress, Avatar, Divider, LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { matchService } from '../api/services';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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

    // Socket.IO real-time updates only (no polling)
    const socket = getSocket();
    
    socket.on('ballRecorded', () => {
      console.log('Ball recorded - refreshing home page data');
      fetchData();
    });

    return () => {
      socket.off('ballRecorded');
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
      }}>
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
    <Box sx={{ 
      minHeight: '100vh',
      background: '#f5f7fa',
      pb: 4
    }}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        {/* Hero Section */}
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
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              color: 'white', 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              mb: 1.5,
              letterSpacing: '-0.02em'
            }}
          >
            Welcome to Cricket Scoreboard
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255,255,255,0.95)',
              fontSize: { xs: '0.9375rem', md: '1.0625rem' },
              maxWidth: '650px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Track live cricket matches, view scores, and statistics in real-time
          </Typography>
        </Paper>

      {liveMatches && liveMatches.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LiveTvIcon sx={{ color: '#d32f2f', mr: 1.5, fontSize: 32 }} />
            <Typography 
              variant="h5" 
              fontWeight={700}
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                color: 'text.primary',
                letterSpacing: '-0.01em'
              }}
            >
              Live Matches
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {liveMatches.map((match) => {
              const currentInnings = match.innings?.[0]?.battingTeamId === match.team1Id ? match.innings[0] : match.innings?.[1];
              const totalOvers = match.totalOvers || (match.matchFormat === 'T20' ? 20 : match.matchFormat === 'ODI' ? 50 : 90);
              const progress = currentInnings ? (parseFloat(currentInnings.totalOvers || 0) / totalOvers) * 100 : 0;
              
              // Determine which team is batting first
              const isTeam1Batting = match.innings?.[0]?.battingTeamId === match.team1Id;
              const battingTeam = isTeam1Batting ? match.team1 : match.team2;
              const bowlingTeam = isTeam1Batting ? match.team2 : match.team1;
              const battingScore = match.innings?.[0] || { totalRuns: 0, totalWickets: 0 };
              const bowlingScore = match.innings?.[1] || { totalRuns: 0, totalWickets: 0 };
              
              return (
                <Grid item xs={12} lg={6} key={match.id}>
                  <Card 
                    component={Link}
                    to={`/match/${match.id}`}
                    elevation={0}
                    sx={{ 
                      position: 'relative', 
                      borderRadius: 2,
                      background: 'white',
                      border: '1px solid #e0e0e0',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        borderColor: '#1976d2',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 20, 
                      right: 20, 
                      zIndex: 1
                    }}>
                      <Chip 
                        label="LIVE" 
                        color="error" 
                        size="small" 
                        icon={<LiveTvIcon sx={{ fontSize: 14 }} />}
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          height: 26,
                          boxShadow: '0 2px 4px rgba(211, 47, 47, 0.2)'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3.5, flexWrap: 'wrap' }}>
                        <Chip 
                          label={match.matchFormat || match.matchType} 
                          size="small" 
                          color="primary"
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            height: 28,
                            px: 1.5
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" fontSize="0.9375rem" fontWeight={500}>
                            {match.venue}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ my: 3 }}>
                        {/* Batting Team */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: 2.5,
                          p: 3.5,
                          borderRadius: 2,
                          background: '#1976d2',
                          color: 'white',
                          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <Avatar sx={{ 
                              width: 52, 
                              height: 52,
                              background: 'rgba(255,255,255,0.25)',
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              border: '2px solid rgba(255,255,255,0.3)'
                            }}>
                              {(battingTeam?.shortName || 'T').charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3, color: 'white', fontSize: '1.125rem', mb: 0.75 }}>
                                {battingTeam?.shortName || 'Team'}
                              </Typography>
                              <Chip 
                                label="Batting" 
                                size="small" 
                                sx={{ 
                                  height: 24, 
                                  fontSize: '0.75rem', 
                                  fontWeight: 600,
                                  background: 'rgba(255,255,255,0.25)',
                                  color: 'white',
                                  border: '1px solid rgba(255,255,255,0.2)'
                                }} 
                              />
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right', ml: 2 }}>
                            <Typography variant="h4" fontWeight={800} sx={{ color: 'white', fontSize: { xs: '1.75rem', md: '2rem' }, lineHeight: 1, mb: 0.75 }}>
                              {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.875rem', fontWeight: 500 }}>
                              ({battingScore.totalOvers || '0.0'}/{totalOvers} ov)
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2.5 }} />
                        
                        {/* Bowling Team */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 3.5,
                          borderRadius: 2,
                          background: '#fafafa',
                          border: '1px solid #e0e0e0'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <Avatar sx={{ 
                              width: 52, 
                              height: 52,
                              background: '#9e9e9e',
                              fontSize: '1.25rem',
                              fontWeight: 700
                            }}>
                              {(bowlingTeam?.shortName || 'T').charAt(0)}
                            </Avatar>
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3, fontSize: '1.125rem', color: 'text.primary' }}>
                              {bowlingTeam?.shortName || 'Team'}
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight={700} color="text.secondary" sx={{ fontSize: '1rem', ml: 2 }}>
                            {bowlingScore.totalRuns > 0 ? 
                              `${bowlingScore.totalRuns || 0}/${bowlingScore.totalWickets || 0}` : 
                              'Yet to bat'
                            }
                          </Typography>
                        </Box>
                      </Box>
                      
                      {currentInnings && (
                        <Box sx={{ mb: 2.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.9375rem">
                              Match Progress
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontSize="0.9375rem" fontWeight={500}>
                              {currentInnings.totalOvers || '0.0'}/{totalOvers} overs
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 2,
                              background: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                background: '#1976d2',
                                borderRadius: 2
                              }
                            }} 
                          />
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <TrendingUpIcon sx={{ fontSize: 20, color: '#4caf50' }} />
                          <Typography variant="body2" color="text.secondary" fontSize="0.9375rem" fontWeight={500}>
                            CRR: <strong style={{ color: '#1976d2', fontWeight: 700 }}>{currentInnings ? (currentInnings.totalRuns / parseFloat(currentInnings.totalOvers || 1)).toFixed(2) : '0.00'}</strong>
                          </Typography>
                        </Box>
                        <Chip 
                          label="In Progress" 
                          size="small" 
                          color="success" 
                          sx={{ height: 26, fontWeight: 600, fontSize: '0.8125rem' }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 4, pt: 0 }}>
                      <Button 
                        fullWidth 
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          background: '#1976d2',
                          borderRadius: 1.5,
                          py: 1.75,
                          fontWeight: 700,
                          fontSize: '1rem',
                          textTransform: 'none',
                          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                          '&:hover': {
                            background: '#1565c0',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                          }
                        }}
                      >
                        View Live Score
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ScheduleIcon sx={{ color: '#1976d2', mr: 1.5, fontSize: 32 }} />
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              color: 'text.primary',
              letterSpacing: '-0.01em'
            }}
          >
            Upcoming Matches
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {upcomingMatches && upcomingMatches.slice(0, 6).map((match) => (
            <Grid item xs={12} sm={6} md={4} key={match.id}>
              <Card 
                component={Link}
                to={`/match/${match.id}`}
                elevation={0}
                sx={{ 
                  borderRadius: 2,
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    borderColor: '#1976d2',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
                    <Chip 
                      label={match.matchFormat || match.matchType} 
                      size="small" 
                      color="primary"
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 26,
                        px: 1
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontSize="0.875rem" fontWeight={500}>
                        {match.venue}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ my: 2.5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2,
                      p: 2.5,
                      borderRadius: 1.5,
                      background: '#fafafa',
                      border: '1px solid #e0e0e0'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Avatar sx={{ 
                          width: 44, 
                          height: 44,
                          background: '#1976d2',
                          fontSize: '1.125rem',
                          fontWeight: 700
                        }}>
                          {(match.team1?.name || match.Team1?.name || 'T1').charAt(0)}
                        </Avatar>
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3, fontSize: '1.0625rem' }}>
                          {match.team1?.name || match.Team1?.name || 'Team 1'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }}>
                      <Chip 
                        label="VS" 
                        size="small" 
                        sx={{ 
                          background: 'white',
                          border: '1px solid #e0e0e0',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          height: 24
                        }}
                      />
                    </Divider>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2.5,
                      borderRadius: 1.5,
                      background: '#fafafa',
                      border: '1px solid #e0e0e0'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Avatar sx={{ 
                          width: 44, 
                          height: 44,
                          background: '#9e9e9e',
                          fontSize: '1.125rem',
                          fontWeight: 700
                        }}>
                          {(match.team2?.name || match.Team2?.name || 'T2').charAt(0)}
                        </Avatar>
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3, fontSize: '1.0625rem' }}>
                          {match.team2?.name || match.Team2?.name || 'Team 2'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ 
                    p: 2.5, 
                    borderRadius: 1.5, 
                    background: '#fafafa',
                    border: '1px solid #e0e0e0'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.875rem">
                        {new Date(match.matchDate).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.875rem">
                        {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 1.5,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: '#1565c0',
                        background: 'rgba(25, 118, 210, 0.04)',
                        borderWidth: 2,
                      }
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
