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
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(118, 75, 162, 0.6);
  }
`;

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
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>Loading matches...</Typography>
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
      background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 6
    }}>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Hero Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 6 }, 
            mb: 5, 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)',
              backgroundSize: '20px 20px',
              opacity: 0.1,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              display: 'inline-block',
              animation: `${float} 3s ease-in-out infinite`,
              mb: 2
            }}>
              <SportsCricketIcon sx={{ fontSize: { xs: 60, md: 100 }, color: 'white' }} />
            </Box>
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                color: 'white', 
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                mb: 2
              }}
            >
              Welcome to Cricket Scoreboard
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.95)',
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 300
              }}
            >
              Track live cricket matches, view scores, and statistics in real-time
            </Typography>
          </Box>
        </Paper>

      {liveMatches && liveMatches.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 48, 
              height: 48, 
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
              mr: 2,
              animation: `${pulse} 2s ease-in-out infinite`
            }}>
              <LiveTvIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Live Matches
            </Typography>
          </Box>
          <Grid container spacing={3}>
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
                <Grid item xs={12} md={6} key={match.id}>
                  <Card 
                    component={Link}
                    to={`/match/${match.id}`}
                    elevation={0}
                    sx={{ 
                      position: 'relative', 
                      overflow: 'visible',
                      borderRadius: 3,
                      background: 'white',
                      border: '2px solid transparent',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      animation: `${slideIn} 0.5s ease-out`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
                        borderColor: '#f44336',
                        animation: `${glow} 2s ease-in-out infinite`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)',
                        borderRadius: '3px 3px 0 0',
                      }
                    }}
                  >
                    <Box sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      right: 16, 
                      zIndex: 2
                    }}>
                      <Chip 
                        label="LIVE" 
                        color="error" 
                        size="small" 
                        icon={<LiveTvIcon sx={{ fontSize: 16 }} />}
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          height: 28,
                          animation: `${pulse} 2s ease-in-out infinite`,
                          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
                        <Chip 
                          label={match.matchFormat || match.matchType} 
                          size="small" 
                          sx={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            height: 26
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {match.venue}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ my: 3 }}>
                        {/* Batting Team - Always on top */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: 2.5,
                          p: 2.5,
                          borderRadius: 2.5,
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.18) 0%, rgba(118, 75, 162, 0.18) 100%)',
                            transform: 'scale(1.02)'
                          }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                            <Avatar sx={{ 
                              width: 48, 
                              height: 48,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}>
                              {(battingTeam?.name || 'T').charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                {battingTeam?.name || 'Team'}
                              </Typography>
                              <Chip 
                                label="Batting" 
                                size="small" 
                                color="primary" 
                                sx={{ 
                                  mt: 0.5, 
                                  height: 20, 
                                  fontSize: '0.65rem',
                                  fontWeight: 600
                                }} 
                              />
                            </Box>
                          </Box>
                          <Typography variant="h3" fontWeight={800} sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: { xs: '1.75rem', md: '2.25rem' }
                          }}>
                            {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2.5, borderColor: 'rgba(0,0,0,0.08)' }} />
                        
                        {/* Bowling/Non-batting Team - Always on bottom */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2.5,
                          borderRadius: 2.5,
                          background: '#f8f9fa',
                          border: '1px solid rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: '#f0f2f5',
                            transform: 'scale(1.01)'
                          }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                            <Avatar sx={{ 
                              width: 48, 
                              height: 48,
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
                            }}>
                              {(bowlingTeam?.name || 'T').charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                                {bowlingTeam?.name || 'Team'}
                              </Typography>
                              {bowlingScore.totalRuns > 0 && (
                                <Chip 
                                  label="Batting" 
                                  size="small" 
                                  color="primary" 
                                  sx={{ 
                                    mt: 0.5, 
                                    height: 20, 
                                    fontSize: '0.65rem',
                                    fontWeight: 600
                                  }} 
                                />
                              )}
                            </Box>
                          </Box>
                          <Typography variant="h6" fontWeight={700} color="text.secondary">
                            {bowlingScore.totalRuns > 0 ? 
                              `${bowlingScore.totalRuns || 0}/${bowlingScore.totalWickets || 0}` : 
                              'Yet to bat'
                            }
                          </Typography>
                        </Box>
                      </Box>
                      
                      {currentInnings && (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Match Progress
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {currentInnings.totalOvers || '0.0'}/{totalOvers} overs
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 2,
                              background: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 2
                              }
                            }} 
                          />
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                          <Typography variant="caption" color="text.secondary">
                            CRR: <strong>{currentInnings ? (currentInnings.totalRuns / parseFloat(currentInnings.totalOvers || 1)).toFixed(2) : '0.00'}</strong>
                          </Typography>
                        </Box>
                        <Chip 
                          label="In Progress" 
                          size="small" 
                          color="success" 
                          sx={{ height: 24 }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2.5, pt: 0 }}>
                      <Button 
                        fullWidth 
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 2.5,
                          py: 1.5,
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 48, 
            height: 48, 
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            mr: 2
          }}>
            <ScheduleIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Upcoming Matches
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {upcomingMatches && upcomingMatches.slice(0, 6).map((match, index) => (
            <Grid item xs={12} md={6} key={match.id}>
              <Card 
                component={Link}
                to={`/match/${match.id}`}
                elevation={0}
                sx={{ 
                  position: 'relative', 
                  overflow: 'visible',
                  borderRadius: 3,
                  background: 'white',
                  border: '2px solid transparent',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  animation: `${slideIn} 0.5s ease-out ${index * 0.1}s both`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
                    borderColor: '#667eea',
                    animation: `${glow} 2s ease-in-out infinite`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '3px 3px 0 0',
                  }
                }}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: -12, 
                  right: 16, 
                  zIndex: 2
                }}>
                  <Chip 
                    label="UPCOMING" 
                    size="small" 
                    icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: 28,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
                    <Chip 
                      label={match.matchFormat || match.matchType} 
                      size="small" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 26
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {match.venue}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ my: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2.5,
                      p: 2.5,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.18) 0%, rgba(118, 75, 162, 0.18) 100%)',
                        transform: 'scale(1.02)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }}>
                          {(match.team1?.name || match.Team1?.name || 'T1').charAt(0)}
                        </Avatar>
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                          {match.team1?.name || match.Team1?.name || 'Team 1'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2.5, borderColor: 'rgba(0,0,0,0.08)' }}>
                      <Chip 
                        label="VS" 
                        size="small" 
                        sx={{ 
                          background: 'white',
                          border: '1px solid rgba(0,0,0,0.1)',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Divider>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2.5,
                      borderRadius: 2.5,
                      background: '#f8f9fa',
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: '#f0f2f5',
                        transform: 'scale(1.01)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48,
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
                        }}>
                          {(match.team2?.name || match.Team2?.name || 'T2').charAt(0)}
                        </Avatar>
                        <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                          {match.team2?.name || match.Team2?.name || 'Team 2'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2.5, borderColor: 'rgba(0,0,0,0.08)' }} />
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2.5, 
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.15)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
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
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2.5, pt: 0 }}>
                  <Button 
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 2.5,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      borderColor: '#667eea',
                      color: '#667eea',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: '#5568d3',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        transform: 'translateY(-2px)',
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
